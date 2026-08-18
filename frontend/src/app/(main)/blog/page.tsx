"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogAPI } from "@/services";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getBlogs({ limit: "20" })
      .then(({ data }) => setBlogs(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Blog</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((post: any) => (
            <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {post.image?.url ? (
                <div className="h-48 overflow-hidden">
                  <img src={post.image.url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-200 dark:text-primary-800">{post.title?.charAt(0)}</span>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <h2 className="text-lg font-bold mb-2">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{post.excerpt}</p>
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-bg text-gray-500">{tag}</span>
                    ))}
                  </div>
                )}
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">Read More <ArrowRight className="h-3 w-3" /></Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
