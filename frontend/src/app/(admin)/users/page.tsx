"use client";

import React, { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Search, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAPI } from "@/services";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const params: Record<string, string> = { limit: "100" };
    if (roleFilter) params.role = roleFilter;
    adminAPI.getAllUsers(params)
      .then(({ data }) => setUsers(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roleFilter]);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await adminAPI.updateUserStatus(id, !currentStatus);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: !currentStatus } : u));
      toast.success("User status updated");
    } catch { toast.error("Failed"); }
  };

  const changeRole = async (id: string, role: string) => {
    try {
      await adminAPI.updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: role as any } : u));
      toast.success("Role updated");
    } catch { toast.error("Failed"); }
  };

  const filtered = users.filter((u) =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Manage Users</h1><p className="text-sm text-gray-500">{users.length} total users</p></div>
        <div className="flex gap-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" /></div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-10 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 text-sm">
            <option value="">All Roles</option><option value="customer">Customer</option><option value="seller">Seller</option><option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading...</td></tr> :
                filtered.map((user) => (
                  <tr key={user._id} className="border-b dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">{user.name.charAt(0)}</div>
                        <div><p className="font-medium">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select value={user.role} onChange={(e) => changeRole(user._id, e.target.value)} className="text-xs rounded-lg border border-gray-200 dark:border-dark-border bg-transparent px-2 py-1">
                        <option value="customer">Customer</option><option value="seller">Seller</option><option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4"><Badge variant={user.isActive ? "success" : "destructive"} className="text-xs">{user.isActive ? "Active" : "Banned"}</Badge></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right"><Button variant="outline" size="sm" onClick={() => toggleStatus(user._id, user.isActive)}>{user.isActive ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
