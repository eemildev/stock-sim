"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth";
import { buyHolding, sellHolding } from "@/services/holdings";
import { addTransaction } from "@/services/transactions";
import { updatePortfolioCashBalance } from "@/services/portfolios";
import { getQuote } from "@/services/stocks";


type BuyStockState = {
    success?: boolean;
    error?: string;
};

export async function buyStockAction(
    prevState: BuyStockState,
    formData: FormData) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        return {
            success: false,
            error: "User not authenticated",
        };
    }

    const portfolioId = formData.get("portfolioId") as string;
    const stockId = formData.get("stockId") as string;
    const quantity = formData.get("quantity") as string;
    const symbol = formData.get("symbol") as string;
    const quote = await getQuote(symbol);
    const price = quote.c;
    const totalCost = Number(quantity) * Number(price);

    try {
        await addTransaction(Number(portfolioId), Number(stockId), "buy", quantity, price);
        await updatePortfolioCashBalance(Number(portfolioId), (Number(totalCost) * -1).toString());
        await buyHolding(Number(portfolioId), Number(stockId), quantity, price);

        return {
            success: true,
        };

    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                error: "An error occurred while buying the stock: " + error.message,
            };
        }
        return {
            success: false,
            error: "Unknown error occurred while buying the stock",
        };
    }
}

export async function sellStockAction(
    prevState: BuyStockState,
    formData: FormData) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        return {
            success: false,
            error: "User not authenticated",
        };
    }

    const portfolioId = formData.get("portfolioId") as string;
    const stockId = formData.get("stockId") as string;
    const quantity = formData.get("quantity") as string;
    const symbol = formData.get("symbol") as string;
    const quote = await getQuote(symbol);
    const price = quote.c;
    const totalCost = Number(quantity) * Number(price);

    try {
        await addTransaction(Number(portfolioId), Number(stockId), "sell", quantity, price);
        await updatePortfolioCashBalance(Number(portfolioId), (Number(totalCost)).toString());
        await sellHolding(Number(portfolioId), Number(stockId), quantity);

        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                error: "An error occurred while selling the stock: " + error.message,
            };
        }
        return {
            success: false,
            error: "Unknown error occurred while selling the stock",
        };
    }
}

