import { NextResponse } from "next/server";
import { getTimeSeries } from "@/services/stocks";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  try {
    const data = await getTimeSeries(symbol);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Time series error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}