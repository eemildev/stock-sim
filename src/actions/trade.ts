"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { executeStockTrade } from "@/services/trade";
import { getQuote } from "@/services/stocks";

type StockState = {
  success?: boolean;
  error?: string;
};

async function stockAction(
  formData: FormData,
  type: "buy" | "sell"
): Promise<StockState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  try {
    const portfolioId = Number(formData.get("portfolioId"));
    const stockId = Number(formData.get("stockId"));
    const quantity = Number(formData.get("quantity"));
    const symbol = String(formData.get("symbol"));

    if (!portfolioId || !stockId || !symbol) {
      return {
        success: false,
        error: "Invalid form data",
      };
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return {
        success: false,
        error: "Invalid quantity",
      };
    }

    const quote = await getQuote(symbol);

    if (!quote.c || quote.c <= 0) {
      return {
        success: false,
        error: "Unable to get a valid stock price",
      };
    }

    await executeStockTrade({
      userId: session.user.id,
      portfolioId,
      stockId,
      quantity,
      price: quote.c,
      type,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : `Unable to ${type} stock`,
    };
  }
}

export async function buyStockAction(
  prevState: StockState,
  formData: FormData
) {
  return stockAction(formData, "buy");
}

export async function sellStockAction(
  prevState: StockState,
  formData: FormData
) {
  return stockAction(formData, "sell");
}