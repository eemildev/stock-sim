"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export function StockLogoSkeleton() {
  return (
    <Skeleton className="h-10 w-10 rounded-md bg-muted" />
  );
}
export function StockLogo({ symbol }: { symbol: string }) {
  const src =`/api/logo?symbol=${symbol}`;
  return (
    <Image
      src={src}
      alt=""
      width={40}
      height={40}
      className="h-10 w-10 rounded-md bg-muted object-contain"
      unoptimized
    />
  );
}