"use client"

import { signIn, useSession } from "next-auth/react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { useActionState, useEffect, useState, startTransition } from "react"
import { loginAction } from "../actions/login"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [errors, setErrors] = useState<{ email?: string; password?: string; root?: string }>({})
  const [serverError, setServerError] = useState(false)
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
      setServerError(true)
    }
  }, [state])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({})
    setServerError(false)

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "Email harus diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!password) {
      newErrors.password = "Kata sandi harus diisi.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return
    }

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      {...props} 
      onSubmit={handleLogin} 
      onChange={(e) => {
        if (serverError) setServerError(false)
        const target = e.target as unknown as HTMLInputElement
        if (target.name && errors[target.name as keyof typeof errors]) {
          setErrors(prev => ({ ...prev, [target.name]: undefined }))
        }
      }}
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Selamat Datang di TB App</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Silakan masuk terlebih dahulu untuk mengakses Aplikasi.
          </p>
        </div>

        {errors.root && (
          <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
            {errors.root}
          </div>
        )}

        <Field data-invalid={!!errors.email || serverError}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="kamu@email.com"
            required
            disabled={isPending}
            aria-invalid={!!errors.email || serverError}
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.password || serverError}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Lupa kata sandi?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isPending}
            aria-invalid={!!errors.password || serverError}
          />
          {errors.password && <FieldError>{errors.password}</FieldError>}
        </Field>
        <Field>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Sedang masuk..." : "Masuk Sekarang"}
          </Button>
        </Field>
        <FieldSeparator>Atau lanjut dengan</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            className="w-full"
            onClick={() => signIn("google")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Masuk dengan Google
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

