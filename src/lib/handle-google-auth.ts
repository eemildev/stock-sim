import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const handleGoogleAuth = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  } catch (error) {
    console.error("Google sign-in failed:", error);
    toast.error("Unable to sign up with Google");
  }
};