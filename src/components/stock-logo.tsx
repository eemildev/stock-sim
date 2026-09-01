"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export function StockLogoSkeleton() {
  return <Skeleton className="h-10 w-10 rounded-md bg-muted" />;
}

export function StockLogo({ symbol }: { symbol: string }) {
  const [error, setError] = useState(false);
  const src = `/api/logo?symbol=${symbol}`;

  if (error) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
        {symbol.slice(0, 3).toUpperCase()}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={40}
      height={40}
      className="h-10 w-10 rounded-md bg-muted object-contain"
      unoptimized
      onError={() => setError(true)}
    />
  );
}
