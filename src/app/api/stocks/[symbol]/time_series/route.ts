import { NextResponse } from "next/server";
import { MarketDataApi, CreateConfig, TwelvedataApiError } from "@twelvedata/twelvedata-node";

const config = CreateConfig(process.env.TWELVEDATA_SECRET);
const api = new MarketDataApi(config);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  // Get stock historical data from TwelveData API
  try {
    const response = await api.getTimeSeries({
      symbol: symbol,
      interval: "1day",
      outputsize: 365
    });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof TwelvedataApiError) {
      console.error("API error:", error);
      return NextResponse.json(
        { error: error.message || "TwelveData API Error" },
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