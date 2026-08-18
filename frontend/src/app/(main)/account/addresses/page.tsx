"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Plus, Trash2, Check, ChevronRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/store/AppContext";
import { authAPI } from "@/services";
import toast from "react-hot-toast";

export default function AddressesPage() {
  const { state, refreshUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    setLoading(true);
    try {
      if (editingId) {
        await authAPI.updateAddress(editingId, { ...data, isDefault: data.isDefault === "on" });
        toast.success("Address updated!");
      } else {
        await authAPI.addAddress({ ...data, isDefault: !state.user?.addresses?.length });
        toast.success("Address added!");
      }
      await refreshUser();
      setShowForm(false);
      setEditingId(null);
      form.reset();
    } catch { toast.error(editingId ? "Failed to update address" : "Failed to add address"); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await authAPI.deleteAddress(id);
      await refreshUser();
      toast.success("Address deleted");
    } catch { toast.error("Failed"); }
  };

  const openEdit = (addr: any) => {
    setEditingId(addr._id);
    setShowForm(true);
    setTimeout(() => {
      const form = document.getElementById("address-form") as HTMLFormElement;
      if (form) {
        (form.elements.namedItem("fullName") as HTMLInputElement).value = addr.fullName || "";
        (form.elements.namedItem("phone") as HTMLInputElement).value = addr.phone || "";
        (form.elements.namedItem("address") as HTMLInputElement).value = addr.address || "";
        (form.elements.namedItem("city") as HTMLInputElement).value = addr.city || "";
        (form.elements.namedItem("state") as HTMLInputElement).value = addr.state || "";
        (form.elements.namedItem("zipCode") as HTMLInputElement).value = addr.zipCode || "";
        (form.elements.namedItem("country") as HTMLInputElement).value = addr.country || "Pakistan";
      }
    }, 100);
  };

  if (!state.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <Link href="/auth/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/account" className="hover:text-primary-600">Account</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100">Addresses</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-bold mb-4">{editingId ? "Edit Address" : "New Address"}</h2>
            <form id="address-form" onSubmit={handleAddAddress} className="grid md:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input name="fullName" required className="mt-1" /></div>
              <div><Label>Phone</Label><Input name="phone" required className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Address</Label><Input name="address" required className="mt-1" /></div>
              <div><Label>City</Label><Input name="city" required className="mt-1" /></div>
              <div><Label>State</Label><Input name="state" required className="mt-1" /></div>
              <div><Label>ZIP Code</Label><Input name="zipCode" required className="mt-1" /></div>
              <div><Label>Country</Label><Input name="country" defaultValue="Pakistan" required className="mt-1" /></div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Address" : "Save Address"}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.user.addresses?.map((addr) => (
          <Card key={addr._id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm">{addr.fullName}</p>
                {addr.isDefault && <Badge variant="success" className="text-[10px]">Default</Badge>}
              </div>
              <p className="text-sm text-gray-600">{addr.phone}</p>
              <p className="text-sm text-gray-500 mt-1">{addr.address}, {addr.city}, {addr.state} {addr.zipCode}</p>
              <p className="text-sm text-gray-500">{addr.country}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600" onClick={() => openEdit(addr)}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => addr._id && handleDelete(addr._id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!state.user.addresses || state.user.addresses.length === 0) && !showForm && (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No addresses saved yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
