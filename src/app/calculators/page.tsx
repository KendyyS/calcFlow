"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CalculatorGrid } from "@/features/dashboard/calculator-grid"

const categoryLabels: Record<string, string> = {
  all: "All Calculators",
  finance: "Finance Calculators",
  health: "Health Calculators",
  academic: "Academic Calculators",
  tech: "Technology Calculators",
  conversion: "Conversion Calculators",
}

function CalculatorsContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || "all"
  const validCategory = category in categoryLabels ? category : "all"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {categoryLabels[validCategory]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse and use our collection of smart calculators
        </p>
      </div>
      <CalculatorGrid initialCategory={validCategory} />
    </motion.div>
  )
}

export default function CalculatorsPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16">
            <div className="text-muted-foreground">Loading calculators...</div>
          </div>
        }
      >
        <CalculatorsContent />
      </Suspense>
    </DashboardLayout>
  )
}
