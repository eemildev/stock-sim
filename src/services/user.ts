import { headers } from "next/headers"
import { auth } from "@/lib/auth";

export async function getAuthenticatedUserId() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user.id;

    if (!userId) {
        throw new Error("User not authenticated");
    }

    return userId;
}