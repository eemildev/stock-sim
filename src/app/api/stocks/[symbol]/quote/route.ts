import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const { symbol } = await params;
    const symbolUpper = symbol.toUpperCase();

    // Get stock quote from Finnhub API
    try {
        const response = await fetch("https://finnhub.io/api/v1/quote?symbol=" + symbolUpper + "&token=" + process.env.FINNHUB_API_KEY);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error("API error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}