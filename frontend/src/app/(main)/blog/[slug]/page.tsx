"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, Tag, ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: { url: string; public_id: string };
  author: { name: string };
  tags: string[];
  createdAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.slug) return;
    api.get(`/blogs/${params.slug}`)
      .then(({ data }) => setPost(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/blog"><Button>Back to Blog</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/blog" className="hover:text-primary-600">Blog</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{post.title}</span>
      </nav>

      <article>
        {post.image?.url && (
          <div className="rounded-3xl overflow-hidden mb-8 aspect-video bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
            <img src={post.image.url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {formatDate(post.createdAt)}
          </div>
          {post.author && (
            <span>By <span className="font-medium text-gray-900 dark:text-gray-100">{post.author.name}</span></span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{post.title}</h1>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full gap-1"><Tag className="h-3 w-3" />{tag}</Badge>
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed">{post.content}</div>
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-dark-border">
        <Link href="/blog">
          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Blog</Button>
        </Link>
      </div>
    </div>
  );
}
