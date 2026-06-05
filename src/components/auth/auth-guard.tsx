"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/services/auth-service"
import type { ReactNode } from "react"

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.replace("/dashboard")
    }
  }, [router])

  return <>{children}</>
}