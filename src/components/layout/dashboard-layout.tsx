"use client"

import { useState, type ReactNode } from "react"
import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { ProtectedRoute } from "./protected-route"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedRoute>
          <div className="flex min-h-screen">
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <div className="flex flex-1 flex-col min-w-0">
              <Navbar onMenuClick={() => setSidebarOpen(true)} />
              <main
                className={cn(
                  "flex-1 overflow-y-auto",
                  "p-4 md:p-6 lg:p-8"
                )}
              >
                {children}
              </main>
            </div>
          </div>
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  )
}