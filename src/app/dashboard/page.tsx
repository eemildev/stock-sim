"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AddPortfolio } from "./add-portfolio";
import { getPortfolios } from "@/services/portfolios";
import { getHoldingsByPortfolioId } from "@/services/holdings";
import { getQuote } from "@/services/stocks";
import { FilterPortfolio } from "@/components/filter-portfolio";
import { HoldingsTable } from "./holdings-table";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ portfolioId?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        Not authenticated
      </div>
    );
  }
  const { portfolioId } = await searchParams;
  const portfolios = await getPortfolios(session.user.id);
  const selectedPortfolioId = Number(portfolioId) || portfolios[0]?.id;
  const holdings = await getHoldingsByPortfolioId(selectedPortfolioId);

  const holdingsWithQuotes = await Promise.all(
    holdings.map(async (holding) => ({
      holding,
      quote: await getQuote(holding.stock.symbol),
    })),
  );

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 p-6 md:p-10">
      <FilterPortfolio portfolios={portfolios} />
      <AddPortfolio />
      <HoldingsTable holdingsWithQuotes={holdingsWithQuotes} />
    </div>
  );
}
