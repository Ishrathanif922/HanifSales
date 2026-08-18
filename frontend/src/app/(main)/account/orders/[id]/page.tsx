"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Package, Truck, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { orderAPI } from "@/services";
import { Order } from "@/types";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  packed: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  returned: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const statusSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    orderAPI.getOrderById(params.id as string)
      .then(({ data }) => { if (data.data) setOrder(data.data); })
      .catch(() => toast.error("Order not found"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleCancel = async () => {
    if (!order || !confirm("Are you sure you want to cancel this order?")) return;
    try {
      const { data } = await orderAPI.cancelOrder(order._id);
      if (data.data) setOrder(data.data);
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <Link href="/account/orders"><Button>Back to Orders</Button></Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/account" className="hover:text-primary-600">Account</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/account/orders" className="hover:text-primary-600">Orders</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">#{order.orderNumber}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={cn("text-sm capitalize px-3 py-1", statusColors[order.orderStatus] || "")}>{order.orderStatus}</Badge>
          <Badge variant={order.paymentStatus === "paid" ? "success" : "outline"} className="text-sm capitalize px-3 py-1">{order.paymentStatus}</Badge>
        </div>
      </div>

      {/* Order Progress */}
      {order.orderStatus !== "cancelled" && order.orderStatus !== "returned" && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      i <= currentStepIndex
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "bg-gray-100 dark:bg-dark-bg border-gray-200 dark:border-dark-border text-gray-400"
                    )}>
                      {i < currentStepIndex ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <span className={cn("text-xs font-medium capitalize", i <= currentStepIndex ? "text-primary-600" : "text-gray-400")}>{step}</span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={cn("flex-1 h-0.5 mx-2 mb-6", i < currentStepIndex ? "bg-primary-500" : "bg-gray-200 dark:bg-dark-border")} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold mb-4">Order Items ({order.items.length})</h2>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-dark-card shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold mb-3">Shipping Address</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}<br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </CardContent>
            </Card>
          )}

          {order.trackingNumber && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold mb-3">Tracking</h2>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary-500" />
                  <span className="text-sm font-medium">Tracking Number:</span>
                  <span className="text-sm text-primary-600">{order.trackingNumber}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>{formatPrice(order.tax)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="text-green-600">-{formatPrice(order.discount)}</span></div>}
              <div className="border-t dark:border-dark-border pt-3 flex justify-between font-bold"><span>Total</span><span className="gradient-text">{formatPrice(order.total)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold mb-3">Payment</h2>
              <p className="text-sm text-gray-500">Method: <span className="font-medium capitalize text-gray-900 dark:text-gray-100">{order.paymentMethod}</span></p>
              <p className="text-sm text-gray-500">Status: <span className={cn("font-medium capitalize", order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600")}>{order.paymentStatus}</span></p>
            </CardContent>
          </Card>

          {(order.orderStatus === "pending" || order.orderStatus === "confirmed") && (
            <Button variant="destructive" className="w-full" onClick={handleCancel}>
              <XCircle className="h-4 w-4 mr-2" /> Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
