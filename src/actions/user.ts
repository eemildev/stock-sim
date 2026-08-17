"use server"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { APIError } from "better-auth/api"

export type SignUpState = {
  values?: {
    name?: string
    email?: string
  }
  errors?: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    form?: string
  }
  success?: boolean
}

export const signUpAction = async (
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> => {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  const errors: SignUpState["errors"] = {}
  if (!password || password.length < 8) errors.password = "Password must be at least 8 characters long"
  if (!confirmPassword || confirmPassword !== password) errors.confirmPassword = "Passwords do not match"
  if (Object.keys(errors).length > 0) {
    return {
      values: {
        name,
        email,
      },
      errors,
      success: false
    }
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    })
  } catch (error) {

    let errorMessage = "An unknown error occurred"

    if (error instanceof APIError) {
      errorMessage = error.message
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      values: { name, email },
      errors: { form: errorMessage },
      success: false
    }
  }
  return { errors: {}, values: {}, success: true }
}

export type SignInState = {
  errors?: {
    form?: string,
    email?: string,
    password?: string,
  },
  success?: boolean
}

export const signInAction = async (
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> => {

  const email = (formData.get("email") as string)?.trim()
  const password = formData.get("password") as string

  try {
    await auth.api.signInEmail({
      body: {
        email: email, // required
        password: password, // required
      },
    });
  } catch (error) {
    let errorMessage = "An unknown error occurred"

    if (error instanceof APIError) {
      errorMessage = error.message
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      errors: { form: errorMessage },
      success: false
    }
  }

  return { errors: {}, success: true }
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers()
  })
  redirect("/sign-in")


}