"use client";

import React, { useEffect, useState } from "react";
import { Tag, Plus, Trash2, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminAPI } from "@/services";
import { Coupon } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", description: "", discountType: "percentage", discountValue: 0, usageLimit: 100, expiresAt: "" });

  const fetchCoupons = () => {
    adminAPI.getAllCoupons({ limit: "50" })
      .then(({ data }) => setCoupons(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.createCoupon({ ...form, expiresAt: form.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
      setShowForm(false);
      fetchCoupons();
      toast.success("Coupon created!");
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await adminAPI.deleteCoupon(id); setCoupons((p) => p.filter((c) => c._id !== id)); toast.success("Deleted!"); } catch { toast.error("Failed"); }
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); toast.success("Copied!"); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Coupons</h1><p className="text-sm text-gray-500">{coupons.length} coupons</p></div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2"><Plus className="h-4 w-4" /> Create Coupon</Button>
      </div>
      {showForm && (
        <Card><CardContent className="p-6">
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required className="mt-1" /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="mt-1" /></div>
            <div><Label>Type</Label><select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 text-sm"><option value="percentage">Percentage</option><option value="fixed">Fixed</option><option value="free_shipping">Free Shipping</option></select></div>
            <div><Label>Value</Label><Input type="number" value={form.discountValue || ""} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} required className="mt-1" /></div>
            <div><Label>Usage Limit</Label><Input type="number" value={form.usageLimit || ""} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} className="mt-1" /></div>
            <div><Label>Expires</Label><Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="mt-1" /></div>
            <div className="sm:col-span-2 flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button></div>
          </form>
        </CardContent></Card>
      )}
      <div className="space-y-3">
        {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-dark-card rounded-xl animate-pulse" />) :
        coupons.length === 0 ? <p className="text-center text-gray-500 py-12">No coupons yet</p> :
        coupons.map((coupon) => (
          <div key={coupon._id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs"><Tag className="h-5 w-5" /></div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{coupon.code}</p>
                  <button onClick={() => copyCode(coupon.code)} className="text-gray-400 hover:text-primary-600"><Copy className="h-3 w-3" /></button>
                </div>
                <p className="text-xs text-gray-500">{coupon.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800">{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : coupon.discountType === "fixed" ? formatPrice(coupon.discountValue) : "Free Ship"}</Badge>
              <Badge variant={coupon.isActive ? "success" : "secondary"}>{coupon.isActive ? "Active" : "Expired"}</Badge>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(coupon._id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
