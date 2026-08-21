"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers"

const session = await auth.api.getSession({
    headers: await headers(),
});

export type BuyStockState = {
    success?: boolean;
    error?: string;
};

export async function buyStock(
    prevState: BuyStockState, 
    formData: FormData
) {
    
    if (!session) {
        return {
            success: false,
            error: "User not authenticated",
        };
    }

    const symbol = formData.get("symbol") as string;


}
