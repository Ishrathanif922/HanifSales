import api from "./api";
import { ApiResponse, PaginatedResponse, User, Product, Category, Brand, Order, Cart, Review, Coupon, Notification } from "@/types";

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>("/auth/login", data),
  googleLogin: (data?: { email?: string; name?: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>("/auth/google", data || {}),
  logout: () => api.post<ApiResponse>("/auth/logout"),
  getMe: () => api.get<ApiResponse<User>>("/auth/me"),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put<ApiResponse<User>>("/auth/update-profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse>("/auth/change-password", data),
  forgotPassword: (email: string) => api.post<ApiResponse>("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse>("/auth/reset-password", { token, password }),
  addAddress: (data: any) => api.post<ApiResponse<User>>("/auth/address", data),
  updateAddress: (id: string, data: any) => api.put<ApiResponse<User>>(`/auth/address/${id}`, data),
  deleteAddress: (id: string) => api.delete<ApiResponse<User>>(`/auth/address/${id}`),
  toggleWishlist: (productId: string) => api.post<ApiResponse>(`/auth/wishlist/${productId}`),
  getWallet: () => api.get<ApiResponse<any>>("/auth/wallet"),
  addFunds: (amount: number) => api.post<ApiResponse<any>>("/auth/wallet/add-funds", { amount }),
};

export const productAPI = {
  getProducts: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Product[]>>("/products", { params }),
  getProductBySlug: (slug: string) =>
    api.get<ApiResponse<Product>>(`/products/slug/${slug}`),
  getMyProducts: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Product[]>>("/products/my-products", { params }),
  getFeaturedProducts: () =>
    api.get<ApiResponse<Product[]>>("/products/featured"),
  getNewArrivals: () =>
    api.get<ApiResponse<Product[]>>("/products/new-arrivals"),
  getBestSellers: () =>
    api.get<ApiResponse<Product[]>>("/products/best-sellers"),
  getRelatedProducts: (id: string) =>
    api.get<ApiResponse<Product[]>>(`/products/${id}/related`),
  searchProducts: (q: string) =>
    api.get<ApiResponse<Product[]>>("/products/search", { params: { q } }),
  createProduct: (data: any) =>
    api.post<ApiResponse<Product>>("/products", data),
  updateProduct: (id: string, data: any) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, data),
  deleteProduct: (id: string) =>
    api.delete<ApiResponse>(`/products/${id}`),
};

export const categoryAPI = {
  getCategories: () => api.get<ApiResponse<Category[]>>("/categories"),
  getCategoryBySlug: (slug: string) =>
    api.get<ApiResponse<{ category: Category; subcategories: Category[] }>>(`/categories/${slug}`),
};

export const orderAPI = {
  createOrder: (data: any) => api.post<ApiResponse<Order>>("/orders", data),
  getMyOrders: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Order[]>>("/orders/my-orders", { params }),
  getSellerOrders: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Order[]>>("/orders/seller-orders", { params }),
  getOrderById: (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  cancelOrder: (id: string, reason?: string) =>
    api.put<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason }),
  requestRefund: (id: string) => api.put<ApiResponse<Order>>(`/orders/${id}/refund`),
  approveRefund: (id: string) => api.put<ApiResponse<Order>>(`/orders/${id}/refund/approve`),
  rejectRefund: (id: string) => api.put<ApiResponse<Order>>(`/orders/${id}/refund/reject`),
  updateStatus: (id: string, data: any) => api.put<ApiResponse<Order>>(`/orders/${id}/status`, data),
};

export const cartAPI = {
  getCart: () => api.get<ApiResponse<Cart>>("/cart"),
  addToCart: (productId: string, quantity?: number, variant?: string) =>
    api.post<ApiResponse>("/cart/add", { productId, quantity, variant }),
  updateCartItem: (itemId: string, quantity: number) =>
    api.put<ApiResponse>(`/cart/item/${itemId}`, { quantity }),
  removeFromCart: (itemId: string) =>
    api.delete<ApiResponse>(`/cart/item/${itemId}`),
  clearCart: () => api.delete<ApiResponse>("/cart/clear"),
  applyCoupon: (code: string) =>
    api.post<ApiResponse>("/cart/coupon/apply", { code }),
  removeCoupon: () => api.delete<ApiResponse>("/cart/coupon/remove"),
};

export const reviewAPI = {
  createReview: (productId: string, data: { rating: number; title: string; comment: string }) =>
    api.post<ApiResponse<Review>>(`/reviews/${productId}`, data),
  getProductReviews: (productId: string, params?: Record<string, string>) =>
    api.get<PaginatedResponse<Review[]>>(`/reviews/${productId}`, { params }),
  markHelpful: (reviewId: string) =>
    api.put<ApiResponse>(`/reviews/${reviewId}/helpful`),
  reportReview: (reviewId: string) =>
    api.put<ApiResponse>(`/reviews/${reviewId}/report`),
};

export const notificationAPI = {
  getNotifications: () =>
    api.get<ApiResponse<Notification[]>>("/notifications"),
  markAsRead: (id: string) =>
    api.put<ApiResponse>(`/notifications/${id}/read`),
  markAllAsRead: () =>
    api.put<ApiResponse>("/notifications/read-all"),
};

export const ticketAPI = {
  create: (data: { subject: string; message: string; priority?: string }) =>
    api.post<ApiResponse>("/tickets", data),
  getMyTickets: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<any[]>>("/tickets/my-tickets", { params }),
  getAllTickets: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<any[]>>("/tickets/admin/all", { params }),
  getTicketById: (id: string) =>
    api.get<ApiResponse<any>>(`/tickets/${id}`),
  replyToTicket: (id: string, message: string) =>
    api.post<ApiResponse>(`/tickets/${id}/reply`, { message }),
  updateTicketStatus: (id: string, status: string) =>
    api.put<ApiResponse>(`/tickets/${id}/status`, { status }),
};

export const adminAPI = {
  getDashboard: () => api.get<ApiResponse>("/admin/dashboard"),
  getAllUsers: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<User[]>>("/admin/users", { params }),
  updateUserStatus: (id: string, isActive: boolean) =>
    api.put<ApiResponse>(`/admin/users/${id}/status`, { isActive }),
  updateUserRole: (id: string, role: string) =>
    api.put<ApiResponse>(`/admin/users/${id}/role`, { role }),
  getAllCategories: () => api.get<ApiResponse<Category[]>>("/admin/categories"),
  createCategory: (data: any) => api.post<ApiResponse<Category>>("/admin/categories", data),
  updateCategory: (id: string, data: any) => api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete<ApiResponse>(`/admin/categories/${id}`),
  getAllCoupons: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Coupon[]>>("/admin/coupons", { params }),
  createCoupon: (data: any) => api.post<ApiResponse<Coupon>>("/admin/coupons", data),
  updateCoupon: (id: string, data: any) => api.put<ApiResponse<Coupon>>(`/admin/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete<ApiResponse>(`/admin/coupons/${id}`),
  getAllProducts: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Product[]>>("/admin/products", { params }),
  deleteAdminProduct: (id: string) =>
    api.delete<ApiResponse>(`/admin/products/${id}`),
  getAllOrders: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Order[]>>("/admin/orders", { params }),
  getAllReviews: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Review[]>>("/admin/reviews", { params }),
  toggleReviewApproval: (id: string, isApproved: boolean) =>
    api.put<ApiResponse>(`/admin/reviews/${id}/approval`, { isApproved }),
  getAllBanners: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<any[]>>("/admin/banners", { params }),
  createBanner: (data: any) => api.post<ApiResponse>("/admin/banners", data),
  updateBanner: (id: string, data: any) => api.put<ApiResponse>(`/admin/banners/${id}`, data),
  deleteBanner: (id: string) => api.delete<ApiResponse>(`/admin/banners/${id}`),
  getAllBlogs: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<any[]>>("/admin/blogs", { params }),
  createBlog: (data: any) => api.post<ApiResponse>("/admin/blogs", data),
  updateBlog: (id: string, data: any) => api.put<ApiResponse>(`/admin/blogs/${id}`, data),
  deleteBlog: (id: string) => api.delete<ApiResponse>(`/admin/blogs/${id}`),
};

export const uploadAPI = {
  uploadImage: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post<ApiResponse<{ url: string; public_id: string }>>(
      `/upload${folder ? `?folder=${folder}` : ""}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },
  uploadMultiple: (files: File[], folder?: string) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    return api.post<ApiResponse<{ url: string; public_id: string }[]>>(
      `/upload/multiple${folder ? `?folder=${folder}` : ""}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },
  deleteImage: (publicId: string) =>
    api.delete<ApiResponse>("/upload", { data: { publicId } }),
};

export const blogAPI = {
  getBlogs: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<any[]>>("/blogs", { params }),
  getBlogBySlug: (slug: string) =>
    api.get<ApiResponse<any>>(`/blogs/${slug}`),
};

export const bannerAPI = {
  getBanners: (position?: string) =>
    api.get<ApiResponse<any[]>>("/banners", { params: position ? { position } : {} }),
};
