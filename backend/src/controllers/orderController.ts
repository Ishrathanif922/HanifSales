import { Response } from "express";
import { IAuthRequest } from "../types";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";
import Coupon from "../models/Coupon";
import User from "../models/User";
import Notification from "../models/Notification";
import stripe from "../config/stripe";
import transporter from "../config/nodemailer";
import { sendSuccess, sendError } from "../utils/response";
import { generateOrderNumber, paginate } from "../utils/helpers";
import {
  orderConfirmationEmail,
  orderShippedEmail,
  orderCancelledEmail,
  refundApprovedEmail,
} from "../utils/emailTemplates";

const TAX_RATE = 0.0;

export const createOrder = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress, billingAddress, paymentMethod, couponCode, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user?._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      sendError(res, 400, "Cart is empty");
      return;
    }

    let subtotal = 0;
    const items = [];

    for (const item of cart.items) {
      const product = item.product as any;
      if (!product || product.stock < item.quantity) {
        sendError(res, 400, `Insufficient stock for ${product?.name || "product"}`);
        return;
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      items.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        price: product.price,
        quantity: item.quantity,
        variant: item.variant,
        seller: product.seller,
      });
    }

    let discount = 0;
    let couponDoc = null;

    if (couponCode) {
      couponDoc = await Coupon.findOne({ code: couponCode, isActive: true });
      if (!couponDoc || couponDoc.expiresAt < new Date()) {
        sendError(res, 400, "Invalid or expired coupon");
        return;
      }
      if (couponDoc.usedCount >= couponDoc.usageLimit) {
        sendError(res, 400, "Coupon usage limit reached");
        return;
      }
      if (subtotal < (couponDoc.minPurchase || 0)) {
        sendError(res, 400, `Minimum purchase of ${couponDoc.minPurchase} required`);
        return;
      }

      if (couponDoc.discountType === "percentage") {
        discount = (subtotal * couponDoc.discountValue) / 100;
        if (couponDoc.maxDiscount) discount = Math.min(discount, couponDoc.maxDiscount);
      } else if (couponDoc.discountType === "fixed") {
        discount = Math.min(couponDoc.discountValue, subtotal);
      }

      couponDoc.usedCount += 1;
      await couponDoc.save();
    }

    const shippingCost = subtotal >= 5000 ? 0 : 200;
    const tax = subtotal * TAX_RATE;
    const total = subtotal - discount + shippingCost + tax;

    const resolvedAddress = shippingAddress;

    if (paymentMethod === "wallet") {
      const user = await User.findById(req.user?._id);
      if (!user || user.wallet.balance < total) {
        sendError(res, 400, "Insufficient wallet balance");
        return;
      }
      user.wallet.balance -= total;
      user.wallet.transactions.push({
        amount: total,
        type: "debit",
        description: `Order payment - ${generateOrderNumber()}`,
        createdAt: new Date(),
      } as any);
      await user.save();
    }

    if (paymentMethod === "stripe") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/account/orders?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout?payment=cancelled`,
        metadata: { userId: req.user?._id?.toString() || "" },
        line_items: items.map((item: any) => ({
          price_data: {
            currency: "pkr",
            product_data: { name: item.name },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
      });

      const order = await Order.create({
        orderNumber: generateOrderNumber(),
        user: req.user?._id,
        items,
        shippingAddress: resolvedAddress,
        billingAddress: billingAddress || resolvedAddress,
        paymentMethod: "stripe",
        paymentStatus: "pending",
        orderStatus: "pending",
        subtotal,
        tax,
        shippingCost,
        discount,
        total,
        coupon: couponDoc?._id,
        notes,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        stripeSessionId: session.id,
      });

      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, numSold: item.quantity },
        });
      }

      await Cart.findOneAndDelete({ user: req.user?._id });

      sendSuccess(res, 201, "Checkout session created", { orderId: order._id, sessionId: session.id, url: session.url });
      return;
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user?._id,
      items,
      shippingAddress: resolvedAddress,
      billingAddress: billingAddress || resolvedAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : paymentMethod === "wallet" ? "paid" : "pending",
      orderStatus: "pending",
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      coupon: couponDoc?._id,
      notes,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, numSold: item.quantity },
      });
    }

    await Cart.findOneAndDelete({ user: req.user?._id });

    try {
      const user = await User.findById(req.user?._id);
      if (user?.email) {
        await transporter.sendMail({
          from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
          to: user.email,
          ...orderConfirmationEmail(order.orderNumber, items, total, resolvedAddress),
        });
      }
    } catch {}

    await Notification.create({
      user: req.user?._id,
      title: "Order Placed",
      message: `Your order #${order.orderNumber} has been placed successfully.`,
      type: "order",
      link: `/account/orders`,
    });

    sendSuccess(res, 201, "Order placed successfully", order);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const stripeWebhook = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch {
      res.status(400).json({ error: "Webhook signature verification failed" });
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.paymentStatus = "paid";
        order.paymentIntentId = session.payment_intent;
        await order.save();

        try {
          const user = await User.findById(order.user);
          if (user?.email) {
            await transporter.sendMail({
              from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
              to: user.email,
              ...orderConfirmationEmail(order.orderNumber, order.items as any, order.total, order.shippingAddress),
            });
          }
        } catch {}

        await Notification.create({
          user: order.user,
          title: "Payment Confirmed",
          message: `Payment for order #${order.orderNumber} has been confirmed.`,
          type: "order",
          link: `/account/orders`,
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "10", status } = req.query as Record<string, string>;
    const filter: any = { user: req.user?._id };
    if (status) filter.orderStatus = status;

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Orders fetched", orders, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getOrderById = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name slug images");

    if (!order) {
      sendError(res, 404, "Order not found");
      return;
    }

    sendSuccess(res, 200, "Order fetched", order);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const cancelOrder = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      sendError(res, 404, "Order not found");
      return;
    }

    if (order.user.toString() !== req.user?._id?.toString()) {
      sendError(res, 403, "Not authorized to cancel this order");
      return;
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      sendError(res, 400, "Order cannot be cancelled at this stage");
      return;
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason;
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, numSold: -item.quantity },
      });
    }

    if (order.paymentMethod === "wallet" && order.paymentStatus === "paid") {
      const user = await User.findById(order.user);
      if (user) {
        user.wallet.balance += order.total;
        user.wallet.transactions.push({
          amount: order.total,
          type: "credit",
          description: `Refund for cancelled order ${order.orderNumber}`,
          createdAt: new Date(),
        } as any);
        await user.save();
      }
    }

    try {
      const user = await User.findById(order.user);
      if (user?.email) {
        await transporter.sendMail({
          from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
          to: user.email,
          ...orderCancelledEmail(order.orderNumber, req.body.reason),
        });
      }
    } catch {}

    await Notification.create({
      user: order.user,
      title: "Order Cancelled",
      message: `Your order #${order.orderNumber} has been cancelled.`,
      type: "order",
      link: `/account/orders`,
    });

    sendSuccess(res, 200, "Order cancelled", order);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const requestRefund = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      sendError(res, 404, "Order not found");
      return;
    }

    if (order.user.toString() !== req.user?._id?.toString()) {
      sendError(res, 403, "Not authorized");
      return;
    }

    if (order.orderStatus !== "delivered") {
      sendError(res, 400, "Can only request refund for delivered orders");
      return;
    }

    order.refundStatus = "requested";
    order.refundAmount = order.total;
    await order.save();

    await Notification.create({
      user: order.user,
      title: "Refund Requested",
      message: `Refund request for order #${order.orderNumber} has been submitted.`,
      type: "order",
      link: `/account/orders`,
    });

    sendSuccess(res, 200, "Refund requested", order);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const approveRefund = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      sendError(res, 404, "Order not found");
      return;
    }

    if (order.refundStatus !== "requested") {
      sendError(res, 400, "No pending refund request");
      return;
    }

    order.refundStatus = "approved";
    order.paymentStatus = "refunded";
    await order.save();

    if (order.paymentMethod === "stripe" && order.paymentIntentId) {
      try {
        await stripe.refunds.create({ payment_intent: order.paymentIntentId });
      } catch {}
    }

    if (order.paymentMethod === "wallet") {
      const user = await User.findById(order.user);
      if (user) {
        user.wallet.balance += order.refundAmount || order.total;
        user.wallet.transactions.push({
          amount: order.refundAmount || order.total,
          type: "credit",
          description: `Refund for order ${order.orderNumber}`,
          createdAt: new Date(),
        } as any);
        await user.save();
      }
    }

    try {
      const user = await User.findById(order.user);
      if (user?.email) {
        await transporter.sendMail({
          from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
          to: user.email,
          ...refundApprovedEmail(order.orderNumber, order.refundAmount || order.total),
        });
      }
    } catch {}

    await Notification.create({
      user: order.user,
      title: "Refund Approved",
      message: `Your refund for order #${order.orderNumber} has been approved and processed.`,
      type: "order",
      link: `/account/orders`,
    });

    sendSuccess(res, 200, "Refund approved", order);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const rejectRefund = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      sendError(res, 404, "Order not found");
      return;
    }

    if (order.refundStatus !== "requested") {
      sendError(res, 400, "No pending refund request");
      return;
    }

    order.refundStatus = "rejected";
    await order.save();

    await Notification.create({
      user: order.user,
      title: "Refund Rejected",
      message: `Your refund request for order #${order.orderNumber} has been rejected.`,
      type: "order",
      link: `/account/orders`,
    });

    sendSuccess(res, 200, "Refund rejected", order);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getSellerOrders = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "10", status } = req.query as Record<string, string>;
    const filter: any = { "items.seller": req.user?._id };
    if (status) filter.orderStatus = status;

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim)
        .populate("user", "name email"),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Seller orders fetched", orders, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateOrderStatus = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { orderStatus, trackingNumber, cancelReason } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          orderStatus,
          ...(trackingNumber && { trackingNumber }),
          ...(cancelReason && { cancelReason }),
          ...(orderStatus === "cancelled" && { cancelledAt: new Date() }),
          ...(orderStatus === "delivered" && { deliveredAt: new Date(), paymentStatus: "paid" }),
        },
      },
      { new: true }
    );

    if (!order) {
      sendError(res, 404, "Order not found");
      return;
    }

    if (orderStatus === "shipped") {
      try {
        const user = await User.findById(order.user);
        if (user?.email) {
          await transporter.sendMail({
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: user.email,
            ...orderShippedEmail(order.orderNumber, trackingNumber || ""),
          });
        }
      } catch {}

      await Notification.create({
        user: order.user,
        title: "Order Shipped",
        message: `Your order #${order.orderNumber} has been shipped.${trackingNumber ? ` Tracking: ${trackingNumber}` : ""}`,
        type: "delivery",
        link: `/account/orders`,
      });
    }

    if (orderStatus === "delivered") {
      await Notification.create({
        user: order.user,
        title: "Order Delivered",
        message: `Your order #${order.orderNumber} has been delivered.`,
        type: "delivery",
        link: `/account/orders`,
      });
    }

    sendSuccess(res, 200, "Order status updated", order);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getAllOrders = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20", status } = req.query as Record<string, string>;
    const filter: any = {};
    if (status) filter.orderStatus = status;

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim)
        .populate("user", "name email"),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "All orders fetched", orders, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
