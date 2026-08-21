import { NextResponse } from "next/server";
import { getQuote } from "@/services/stocks";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  try {
    const data = await getQuote(symbol);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}