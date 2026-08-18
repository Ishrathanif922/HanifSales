"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/services";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    adminAPI.getAllReviews({ page: String(page), limit: "20" })
      .then(({ data }) => {
        setReviews(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const handleToggleApproval = async (id: string, isApproved: boolean) => {
    try {
      await adminAPI.toggleReviewApproval(id, isApproved);
      setReviews((prev) => prev.map((r) => r._id === id ? { ...r, isApproved } : r));
      toast.success(isApproved ? "Review approved" : "Review rejected");
    } catch {
      toast.error("Failed to update review");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <p className="text-sm text-gray-500">Approve or reject customer reviews</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold mb-2">No Reviews</h3>
            <p className="text-gray-500">No reviews to moderate yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Reviewer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Rating</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Comment</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review._id} className="border-b dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium">{(review.user as any)?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-500">{(review.user as any)?.email || ""}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="truncate max-w-[150px]">{(review.product as any)?.name || "Unknown"}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{review.title} - {review.comment}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={review.isApproved ? "success" : "destructive"} className="text-xs">
                            {review.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{formatDate(review.createdAt)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-1 justify-end">
                            {!review.isApproved && (
                              <Button variant="ghost" size="sm" onClick={() => handleToggleApproval(review._id, true)}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            {review.isApproved && (
                              <Button variant="ghost" size="sm" onClick={() => handleToggleApproval(review._id, false)}>
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="py-2 px-4 text-sm text-gray-500">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
