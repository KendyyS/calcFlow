import type { Metadata } from "next"
import { AuthGuard } from "@/components/auth/auth-guard"
import { LoginForm } from "@/features/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In | CalcFlow",
  description: "Sign in to your CalcFlow account to access all calculators and features.",
}

export default function LoginPage() {
  return (
    <AuthGuard>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a1a]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 2L2 6v6l2 4v4h16v-4l2-4V6l-2-4H4z" />
                <path d="M2 6h20" />
                <path d="M6 10h4v4H6z" />
                <path d="M14 10h4v4h-4z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">CalcFlow</span>
          </div>

          <LoginForm />
        </div>
      </div>
    </AuthGuard>
  )
}