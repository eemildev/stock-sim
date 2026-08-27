"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Portfolio } from "@/types/portfolios";
import { SelectPortfolio } from "@/components/select-portfolio";

export function FilterPortfolio({
  portfolios,
}: {
  portfolios: Portfolio[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPortfolioId =
    searchParams.get("portfolioId") ??
    String(portfolios[0]?.id ?? "");

  function handlePortfolioChange(portfolioId: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (portfolioId) {
      params.set("portfolioId", portfolioId);
    } else {
      params.delete("portfolioId");
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <SelectPortfolio
      portfolios={portfolios}
      selectedPortfolioId={selectedPortfolioId}
      handlePortfolioChange={handlePortfolioChange}
    />
  );
}