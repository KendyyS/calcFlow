"use client"

import type { ReactNode } from "react"
import { AuthProvider as InternalAuthProvider } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  return <InternalAuthProvider>{children}</InternalAuthProvider>
}