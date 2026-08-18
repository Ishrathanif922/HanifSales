"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[...Array(maxStars)].map((_, i) => {
          const filled = rating >= i + 1;
          const halfFilled = rating >= i + 0.5 && rating < i + 1;
          return (
            <Star
              key={i}
              className={cn(
                sizeMap[size],
                filled ? "text-yellow-400 fill-yellow-400" : halfFilled ? "text-yellow-400 fill-yellow-200" : "text-gray-300"
              )}
            />
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && <span className="text-sm text-gray-500">({reviewCount})</span>}
    </div>
  );
}
