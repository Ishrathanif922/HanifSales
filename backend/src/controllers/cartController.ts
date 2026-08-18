import { Response } from "express";
import { IAuthRequest } from "../types";
import Cart from "../models/Cart";
import Product from "../models/Product";
import Coupon from "../models/Coupon";
import { sendSuccess, sendError } from "../utils/response";

export const getCart = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id })
      .populate("items.product", "name slug price images stock discount comparePrice");

    if (!cart) {
      sendSuccess(res, 200, "Cart fetched", { items: [], total: 0 });
      return;
    }

    let total = 0;
    const items = cart.items.map((item) => {
      const product = item.product as any;
      const price = product?.discount
        ? product.price - (product.price * product.discount) / 100
        : product?.price || 0;
      const itemTotal = price * item.quantity;
      total += itemTotal;
      return { ...item.toObject(), price, itemTotal };
    });

    sendSuccess(res, 200, "Cart fetched", { items, total, coupon: cart.coupon });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const addToCart = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      sendError(res, 404, "Product not found");
      return;
    }

    if (product.stock < quantity) {
      sendError(res, 400, "Insufficient stock");
      return;
    }

    let cart = await Cart.findOne({ user: req.user?._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user?._id,
        items: [{ product: productId, quantity, variant }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId && item.variant === variant
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, variant } as any);
      }
      await cart.save();
    }

    sendSuccess(res, 200, "Added to cart", cart);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateCartItem = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user?._id });

    if (!cart) {
      sendError(res, 404, "Cart not found");
      return;
    }

    const item = (cart.items as any).id(req.params.itemId);
    if (!item) {
      sendError(res, 404, "Item not found in cart");
      return;
    }

    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) {
      sendError(res, 400, "Insufficient stock");
      return;
    }

    item.quantity = quantity;
    await cart.save();

    sendSuccess(res, 200, "Cart updated", cart);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const removeFromCart = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      sendError(res, 404, "Cart not found");
      return;
    }

    cart.items = cart.items.filter((item) => item._id?.toString() !== req.params.itemId);
    await cart.save();

    sendSuccess(res, 200, "Removed from cart", cart);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const clearCart = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    await Cart.findOneAndDelete({ user: req.user?._id });
    sendSuccess(res, 200, "Cart cleared");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const applyCoupon = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon || coupon.expiresAt < new Date()) {
      sendError(res, 400, "Invalid or expired coupon");
      return;
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      sendError(res, 400, "Coupon usage limit reached");
      return;
    }

    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      sendError(res, 404, "Cart not found");
      return;
    }

    cart.coupon = coupon._id;
    await cart.save();

    sendSuccess(res, 200, "Coupon applied", { coupon, cart });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const removeCoupon = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      sendError(res, 404, "Cart not found");
      return;
    }

    cart.coupon = undefined;
    await cart.save();

    sendSuccess(res, 200, "Coupon removed", cart);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
