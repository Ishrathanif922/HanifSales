"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/store/AppContext";
import { authAPI } from "@/services";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { state, refreshUser } = useApp();
  const [name, setName] = useState(state.user?.name || "");
  const [phone, setPhone] = useState(state.user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile({ name, phone });
      await refreshUser();
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update"); } finally { setLoading(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      toast.success("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed"); } finally { setLoading(false); }
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
        <span className="text-gray-900 dark:text-gray-100">Settings</span>
      </nav>

      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2"><User className="h-4 w-4" /> Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" /></div>
              <div><Label>Email</Label><Input value={state.user.email} disabled className="mt-1 opacity-60" /></div>
              <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" /></div>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Lock className="h-4 w-4" /> Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div><Label>Current Password</Label><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1" required /></div>
              <div><Label>New Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" required minLength={6} /></div>
              <Button type="submit" disabled={loading}>{loading ? "Changing..." : "Change Password"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
