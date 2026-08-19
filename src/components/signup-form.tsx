"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/actions/user";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const initialState = {
  errors: {
    form: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  values: {
    name: "",
    email: "",
  },
  success: false,
};

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Successful Sign-up");
      router.replace("/dashboard");
      router.refresh();
    }
  }, [state, router]);

  const handleGoogleAuth = async () => {
		await authClient.signIn.social({
			provider: "google",
			// Optional: redirect new users to a specific page
			callbackURL: "/dashboard"
		})
	}

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                defaultValue={state.values?.name ?? ""}
                aria-invalid={!!state.errors?.name || !!state.errors?.form}
                required
              />
              {state.errors?.name && (
                <FieldError>{state.errors.name}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={state.values?.email ?? ""}
                placeholder="m@example.com"
                aria-invalid={!!state.errors?.email || !!state.errors?.form}
                required
              />
              {state.errors?.email && (
                <FieldError>{state.errors.email}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required aria-invalid={!!state.errors?.password || !!state.errors?.form}/>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              {state.errors?.password && (
                <FieldError>{state.errors.password}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                aria-invalid={
                  !!state.errors?.confirmPassword || !!state.errors?.form
                }
              />
              {state.errors?.confirmPassword && (
                <FieldError>{state.errors.confirmPassword}</FieldError>
              )}
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            {state.errors?.form && <FieldError>{state.errors.form}</FieldError>}
            <FieldGroup>
              <Field>
                <Button disabled={pending} type="submit">
                  Create Account
                </Button>
                <Button
                  disabled={pending}
                  variant="outline"
                  type="button"
                  onClick={()=>handleGoogleAuth()}
                >
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
