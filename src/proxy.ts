import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/";

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/"],
};