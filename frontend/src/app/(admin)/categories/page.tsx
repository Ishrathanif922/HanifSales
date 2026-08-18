"use client";

import React, { useEffect, useState } from "react";
import { Tag, Plus, Trash2, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminAPI } from "@/services";
import { Category } from "@/types";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  const fetchCategories = () => {
    adminAPI.getAllCategories()
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await adminAPI.createCategory({ name });
      setName("");
      setShowForm(false);
      fetchCategories();
      toast.success("Category created!");
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await adminAPI.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Deleted!");
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Categories</h1><p className="text-sm text-gray-500">{categories.length} categories</p></div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2"><Plus className="h-4 w-4" /> Add Category</Button>
      </div>
      {showForm && (
        <Card><CardContent className="p-4"><form onSubmit={handleCreate} className="flex gap-3"><Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required /><Button type="submit">Create</Button><Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button></form></CardContent></Card>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-dark-card rounded-xl animate-pulse" />) :
        categories.map((cat) => (
          <div key={cat._id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm">{cat.name.charAt(0)}</div>
              <div><p className="font-medium text-sm">{cat.name}</p><p className="text-xs text-gray-500">Level {cat.level}</p></div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant={cat.isActive ? "success" : "secondary"} className="text-[10px]">{cat.isActive ? "Active" : "Off"}</Badge>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(cat._id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
