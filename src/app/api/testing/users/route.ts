import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  if (process.env.NODE_ENV === "production") {
    if (process.env.ENABLE_TEST_ROUTES !== "true") {
      return NextResponse.json("Forbidden", { status: 403 });
    }
  }

  try {
    const { email, name, password } = await req.json();
    const result = await auth.api.signUpEmail({ body: { email, name, password } });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sign-up failed" },
      { status: 400 },
    );
  }
}
