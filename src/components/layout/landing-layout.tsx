"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ThemeProvider, useTheme } from "./theme-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalculatorIcon, Sun, Moon } from "lucide-react"

function LandingNavbar() {
  const { resolved, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolved === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 px-4 md:px-8",
        "glass"
      )}
    >
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-sm">
          <CalculatorIcon className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">CalcFlow</span>
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground"
          aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
        >
          {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Link href="/login">
          <Button variant="ghost">Log in</Button>
        </Link>
        <Link href="/register">
          <Button>Sign up</Button>
        </Link>
      </div>
    </header>
  )
}

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <LandingNavbar />
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  )
}