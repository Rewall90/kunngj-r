# Phase 3: Authentication System

**Duration:** 2 days (12-16 hours)
**Prerequisites:** Phase 1 & 2 completed
**Goal:** Build complete authentication system with login, signup, email verification, password reset, and protected routes

---

## Overview

In this phase, we'll create a production-ready authentication system using Supabase Auth. This includes UI components, form validation, email flows, and route protection.

## What You'll Build

- ✅ Login page with email/password
- ✅ Signup page with email verification
- ✅ Password reset flow
- ✅ Email confirmation page
- ✅ Protected route middleware
- ✅ Auth context and hooks
- ✅ User session management
- ✅ Error handling and validation
- ✅ Loading states and redirects

---

## Step 1: Auth Context & Hooks (30 minutes)

### 1.1: Create Auth Context

Create `contexts/auth-context.tsx`:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### 1.2: Add Auth Provider to Root Layout

Edit `app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 1.3: Create useUser Hook

Create `hooks/use-user.ts`:

```typescript
'use client'

import { useAuth } from '@/contexts/auth-context'

export function useUser() {
  const { user, loading } = useAuth()

  return {
    user,
    loading,
    isAuthenticated: !!user,
  }
}
```

---

## Step 2: Form Validation Utilities (20 minutes)

### 2.1: Create Form Validation Helpers

Create `lib/validations/auth.ts`:

```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const updatePasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
```

### 2.2: Install React Hook Form

```bash
npm install react-hook-form @hookform/resolvers
```

---

## Step 3: Login Page (45 minutes)

### 3.1: Create Auth Layout

Create `app/(auth)/layout.tsx`:

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

### 3.2: Create Login Page

Create `app/(auth)/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
          Sign In
        </h2>
        <p className="text-center text-base-content/70 mb-6">
          Welcome back! Sign in to your account
        </p>

        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              </label>
            )}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              </label>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/reset-password"
              className="link link-primary text-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="divider">OR</div>
        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="link link-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## Step 4: Signup Page (45 minutes)

### 4.1: Create Signup Page

Create `app/(auth)/signup/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Sign up user
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })

      if (signUpError) throw signUpError

      setEmailSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          <h2 className="card-title text-2xl justify-center">
            Check Your Email
          </h2>
          <p className="text-base-content/70 mt-2">
            We've sent you a confirmation email. Please click the link in the
            email to verify your account.
          </p>
          <div className="card-actions justify-center mt-6">
            <Link href="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
          Create Account
        </h2>
        <p className="text-center text-base-content/70 mb-6">
          Get started with your free account
        </p>

        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Display Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className={`input input-bordered ${errors.displayName ? 'input-error' : ''}`}
              {...register('displayName')}
            />
            {errors.displayName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.displayName.message}
                </span>
              </label>
            )}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              </label>
            )}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              </label>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.confirmPassword.message}
                </span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="divider">OR</div>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="link link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## Step 5: Password Reset Flow (30 minutes)

### 5.1: Create Reset Password Request Page

Create `app/(auth)/reset-password/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      setEmailSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          <h2 className="card-title text-2xl justify-center">
            Check Your Email
          </h2>
          <p className="text-base-content/70 mt-2">
            We've sent you a password reset link. Please check your email and
            follow the instructions.
          </p>
          <div className="card-actions justify-center mt-6">
            <Link href="/login" className="btn btn-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
          Reset Password
        </h2>
        <p className="text-center text-base-content/70 mb-6">
          Enter your email and we'll send you a reset link
        </p>

        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="divider">OR</div>
        <p className="text-center text-sm">
          <Link href="/login" className="link link-primary">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
```

### 5.2: Create Update Password Page

Create `app/(auth)/update-password/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { updatePasswordSchema, type UpdatePasswordInput } from '@/lib/validations/auth'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const onSubmit = async (data: UpdatePasswordInput) => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) throw error

      router.push('/login?message=Password updated successfully')
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
          Update Password
        </h2>
        <p className="text-center text-base-content/70 mb-6">
          Enter your new password
        </p>

        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              </label>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.confirmPassword.message}
                </span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Updating password...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

## Step 6: Email Confirmation Page (15 minutes)

### 6.1: Create Auth Callback Route Handler

Create `app/auth/confirm/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/admin`)
}
```

### 6.2: Create Confirmation Success Page

Create `app/(auth)/auth-confirmed/page.tsx`:

```typescript
import Link from 'next/link'

export default function AuthConfirmedPage() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-center">
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="card-title text-2xl justify-center">
          Email Confirmed!
        </h2>
        <p className="text-base-content/70 mt-2">
          Your email has been successfully verified. You can now sign in to your
          account.
        </p>
        <div className="card-actions justify-center mt-6">
          <Link href="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
```

---

## Step 7: Protected Routes Middleware (20 minutes)

### 7.1: Update Middleware for Auth Protection

Edit `middleware.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/signup') &&
    user
  ) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## Step 8: Test Admin Page (15 minutes)

### 8.1: Create Protected Admin Page

Create `app/(admin)/layout.tsx`:

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-base-200">
      {children}
    </div>
  )
}
```

### 8.2: Create Admin Dashboard Page

Create `app/(admin)/admin/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Welcome!</h2>
          <p>You are successfully authenticated.</p>

          <div className="mt-4">
            <p className="text-sm text-base-content/70">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-base-content/70">
              <strong>User ID:</strong> {user.id}
            </p>
          </div>

          <form action="/auth/signout" method="post" className="mt-6">
            <button type="submit" className="btn btn-error">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

### 8.3: Create Sign Out Route Handler

Create `app/auth/signout/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/login', request.url))
}
```

---

## Testing Checklist

Before moving to Phase 4, verify:

- [ ] Can access login page at `/login`
- [ ] Can access signup page at `/signup`
- [ ] Login form validates email and password
- [ ] Signup form validates all fields including password match
- [ ] Sign up sends confirmation email
- [ ] Email confirmation link works and redirects to admin
- [ ] Password reset request sends email
- [ ] Password reset link allows updating password
- [ ] Cannot access `/admin` without authentication (redirects to `/login`)
- [ ] Authenticated users redirected from `/login` to `/admin`
- [ ] Sign out works and redirects to login
- [ ] Error messages display correctly for invalid credentials
- [ ] Loading states show during async operations
- [ ] Auth context provides user data throughout app

---

## Troubleshooting

### "Invalid login credentials" error
- Check email is verified in Supabase Dashboard → Authentication → Users
- Verify password meets requirements (min 6 characters)

### Email not received
- Check spam folder
- Verify SMTP settings in Supabase Dashboard → Project Settings → Auth
- In development, check Supabase Dashboard → Authentication → Logs

### Redirect loop
- Clear browser cookies
- Check middleware matcher config
- Verify environment variables are loaded

### TypeScript errors on form submission
- Ensure React Hook Form and Zod resolver are installed
- Check form field names match schema

---

## Commit Your Changes

```bash
git add .
git commit -m "feat: Complete Phase 3 - Authentication system with login, signup, password reset, and protected routes"
git push
```

---

## Next Steps

Phase 3 Complete! 🎉

**Next Phase:** [Phase 4 - Admin Layout & Navigation](phase-04-admin-layout.md)

In Phase 4, we'll build:
- Admin dashboard layout
- Sidebar navigation
- Header with user menu
- Responsive mobile menu
- Protected layout wrapper

---

**Estimated Time:** 2 days
**Difficulty:** ⭐⭐⭐ Intermediate
**Phase Status:** ⚪ Not Started → 🟢 Complete
