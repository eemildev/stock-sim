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
