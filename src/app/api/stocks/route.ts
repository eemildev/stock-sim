import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const apiKey = process.env.TWELVEDATA_SECRET;

    if (!apiKey) {
      return NextResponse.json(
        { error: "TWELVEDATA_SECRET is not configured in environment variables" },
        { status: 500 }
      );
    }

    // Read ?page= query parameter from URL (defaults to page 1)
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const outputsize = searchParams.get("outputsize") || "25";

    const response = await fetch(
      `https://api.twelvedata.com/stocks?exchange=NASDAQ&type=Common%20Stock&outputsize=${outputsize}&page=${page}&apikey=${apiKey}`
    );

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      return NextResponse.json(
        { error: "Twelve Data API error", message: data.message || "Failed to fetch stocks" },
        { status: response.status >= 400 ? response.status : 400 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Error fetching stocks:", error);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}