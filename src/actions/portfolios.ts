"use server"

import { auth } from "@/lib/auth";
import { addPortfolio } from "@/services/portfolios";
import { headers } from "next/headers"



export type AddPortfolioState = {
    success?: boolean;
    error?: string;
};

export async function addPortfolioAction(
    prevState: AddPortfolioState,
    formData: FormData
) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {
            success: false,
            error: "User not authenticated",
        };
    }

    const name = formData.get("name") as string;
    const cashBalance = formData.get("cashBalance") as string;

    if (!name || !cashBalance) {
        return {
            success: false,
            error: "Name and cash balance are required",
        };
    }

    if (isNaN(Number(cashBalance)) || Number(cashBalance) <= 0 || Number(cashBalance) > 100000) {
        return {
            success: false,
            error: "Cash balance must be a positive number",
        };
    }

    try {
        await addPortfolio(session.user.id, name, cashBalance);
        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                error: "An error occurred while adding the portfolio: " + error.message,
            };
        }
        return {
            success: false,
            error: "Unknown error occurred while adding the portfolio",
        };
    }
}
