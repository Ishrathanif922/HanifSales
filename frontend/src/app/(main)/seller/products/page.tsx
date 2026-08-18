"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, Edit, Trash2, Package, X, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productAPI, categoryAPI, uploadAPI } from "@/services";
import { Product, Category } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const emptyForm = {
  name: "", description: "", shortDescription: "", price: "", comparePrice: "",
  stock: "", category: "", brand: "", sku: "", tags: "",
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [images, setImages] = useState<{ url: string; public_id: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    categoryAPI.getCategories().then(({ data }) => setCategories(data.data || [])).catch(() => {});
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    productAPI.getMyProducts({ limit: "100" })
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const { data } = await uploadAPI.uploadMultiple(Array.from(files), "hanif-sales/products");
      if (data.data) setImages((prev) => [...prev, ...data.data!]);
      toast.success("Images uploaded");
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = async (publicId: string) => {
    try {
      await uploadAPI.deleteImage(publicId);
      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
    } catch {}
  };

  const openEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || "",
      price: String(product.price),
      comparePrice: product.comparePrice ? String(product.comparePrice) : "",
      stock: String(product.stock),
      category: (product.category as any)?._id || (typeof product.category === "string" ? product.category : ""),
      brand: (product.brand as any)?._id || "",
      sku: product.sku || "",
      tags: product.tags?.join(", ") || "",
    });
    setImages(product.images || []);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload: any = {
        name: form.name,
        description: form.description,
        shortDescription: form.shortDescription || undefined,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        stock: Number(form.stock),
        category: form.category || undefined,
        brand: form.brand || undefined,
        sku: form.sku || undefined,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        images,
      };

      if (editingId) {
        await productAPI.updateProduct(editingId, payload);
        toast.success("Product updated!");
      } else {
        await productAPI.createProduct(payload);
        toast.success("Product created!");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setImages([]);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productAPI.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-sm text-gray-500">{products.length} product(s)</p>
        </div>
        <Button className="gap-2" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); setImages([]); }}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Product" : "Create New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Product Images</Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {images.map((img) => (
                    <div key={img.public_id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-dark-border group">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(img.public_id)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-dark-border flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : <><Upload className="h-5 w-5 text-gray-400" /><span className="text-[10px] text-gray-400 mt-1">Upload</span></>}
                    <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input className="mt-1" placeholder="e.g. Wireless Headphones" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input className="mt-1" placeholder="e.g. WH-1000" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Short Description</Label>
                <Input className="mt-1" placeholder="Brief description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
              </div>
              <div>
                <Label>Full Description *</Label>
                <textarea className="mt-1 w-full h-24 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-sm" placeholder="Detailed product description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Price (PKR) *</Label>
                  <Input type="number" className="mt-1" placeholder="0" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div>
                  <Label>Compare Price</Label>
                  <Input type="number" className="mt-1" placeholder="0" min="0" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
                </div>
                <div>
                  <Label>Stock *</Label>
                  <Input type="number" className="mt-1" placeholder="0" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <select className="mt-1 w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input className="mt-1" placeholder="e.g. wireless, headphones, bluetooth" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={formLoading} className="gap-2">
                  {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {editingId ? "Update Product" : "Create Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
          <p className="text-gray-500 mb-4">Start adding products to your store</p>
          <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Your First Product</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-dark-bg shrink-0 flex items-center justify-center overflow-hidden">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-primary-300">{product.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">{formatPrice(product.price)} · {product.stock} in stock</p>
                </div>
                <Badge variant={product.isActive ? "success" : "secondary"}>{product.isActive ? "Active" : "Inactive"}</Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                    <Edit className="h-3 w-3 text-blue-500" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(product._id)}>
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
