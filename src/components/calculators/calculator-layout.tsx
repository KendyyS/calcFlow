"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Calculator, CalculatorCategory } from "@/types"

const categoryVariants: Record<CalculatorCategory, string> = {
  finance: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  health: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  academic: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  tech: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  conversion: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
}

interface CalculatorLayoutProps {
  calculator: Calculator
  children: ReactNode
}

export function CalculatorLayout({ calculator, children }: CalculatorLayoutProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{calculator.name}</h1>
            <Badge className={categoryVariants[calculator.category]}>
              {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1)}
            </Badge>
            {calculator.pro && (
              <Badge variant="default" className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1">
                <Crown className="h-3 w-3" />
                Pro
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{calculator.description}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {calculator.description} Use the inputs below to perform your calculation in real-time.
            </p>
            {calculator.pro && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                This is a Pro calculator. Upgrade your plan for unlimited access.
              </p>
            )}
          </div>
        </div>
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}