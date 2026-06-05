"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

type ThemeMode = "light" | "dark" | "system"

interface ThemeContextValue {
  mode: ThemeMode
  resolved: "light" | "dark"
  setTheme: (mode: ThemeMode) => void
}

const STORAGE_KEY = "calcflow-theme"

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "system"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark" || stored === "system") return stored
  return "system"
}

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return mode
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement
  if (resolved === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

function initMode(): ThemeMode {
  const stored = getStoredMode()
  if (typeof window !== "undefined") {
    applyTheme(resolveMode(stored))
  }
  return stored
}

function initResolved(): "light" | "dark" {
  return resolveMode(getStoredMode())
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return ctx
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(initMode)
  const [resolved, setResolved] = useState<"light" | "dark">(initResolved)

  useEffect(() => {
    if (mode !== "system") return

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const r = resolveMode("system")
      setResolved(r)
      applyTheme(r)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [mode])

  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
    const r = resolveMode(newMode)
    setResolved(r)
    applyTheme(r)
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}