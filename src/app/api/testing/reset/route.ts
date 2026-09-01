import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { NextResponse } from "next/server"

export async function DELETE() {
    if (process.env.ENABLE_TEST_ROUTES !== "true") {
    return NextResponse.json("Forbidden", { status: 403 });
  }

  try {
    await db.delete(user);
    return NextResponse.json(
      { message: "Database reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error during reset:", error);
    return NextResponse.json(
      { error: "Something went wrong resetting the database. Please try again later." },
      { status: 500 }
    );
  }
}