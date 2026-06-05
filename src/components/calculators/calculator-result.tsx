"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CalculatorResultProps {
  title: string
  value: string | number
  description?: string
  highlight?: boolean
}

export function CalculatorResult({ title, value, description, highlight }: CalculatorResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "rounded-xl border backdrop-blur-md p-5 space-y-2 transition-shadow",
        highlight
          ? "bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-violet-500/10 border-blue-500/20 dark:border-blue-500/30 shadow-lg shadow-blue-500/10"
          : "glass-card"
      )}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </p>
      <p
        className={cn(
          "font-bold tracking-tight",
          highlight
            ? "text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
            : "text-2xl md:text-3xl text-foreground"
        )}
      >
        {typeof value === "number" ? value.toLocaleString("en-US", { maximumFractionDigits: 4 }) : value}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </motion.div>
  )
}