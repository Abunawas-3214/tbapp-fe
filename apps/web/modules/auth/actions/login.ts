"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
    })
  } catch (error) {
    if (error instanceof AuthError) {
      // NextAuth wraps the error we threw in authorize() inside error.cause
      const message = (error.cause as any)?.err?.message || "Kredensial salah"
      return { error: message }
    }
    // We must re-throw the error if it's not an AuthError, 
    // because NextAuth uses redirects which are thrown as special errors.
    throw error
  }
}
