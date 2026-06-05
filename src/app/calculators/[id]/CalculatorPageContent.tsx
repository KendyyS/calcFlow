"use client"

import { useEffect, useCallback } from "react"
import { useParams, notFound } from "next/navigation"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalculatorLayout } from "@/components/calculators/calculator-layout"
import { CALCULATORS, type CalculatorId } from "@/types"
import { useAuth } from "@/hooks/use-auth"
import { useFavorites } from "@/hooks/use-favorites"
import { useRecents } from "@/hooks/use-recents"
import dynamic from "next/dynamic"

const GpaCalculator = dynamic(() => import("@/components/calculators/gpa-calculator"), { ssr: false })
const CurrencyConverter = dynamic(() => import("@/components/calculators/currency-converter"), { ssr: false })
const CompoundInterestCalculator = dynamic(() => import("@/components/calculators/compound-interest-calculator"), { ssr: false })
const BmiCalculator = dynamic(() => import("@/components/calculators/bmi-calculator"), { ssr: false })
const LoanCalculator = dynamic(() => import("@/components/calculators/loan-calculator"), { ssr: false })
const PercentageCalculator = dynamic(() => import("@/components/calculators/percentage-calculator"), { ssr: false })
const AgeCalculator = dynamic(() => import("@/components/calculators/age-calculator"), { ssr: false })
const GpuSpeedupCalculator = dynamic(() => import("@/components/calculators/gpu-speedup-calculator"), { ssr: false })
const AiTokenCostCalculator = dynamic(() => import("@/components/calculators/ai-token-cost-calculator"), { ssr: false })
const CudaPerformanceCalculator = dynamic(() => import("@/components/calculators/cuda-performance-calculator"), { ssr: false })

const calculatorComponents: Record<CalculatorId, React.ComponentType> = {
  "gpa": GpaCalculator,
  "currency": CurrencyConverter,
  "compound-interest": CompoundInterestCalculator,
  "bmi": BmiCalculator,
  "loan": LoanCalculator,
  "percentage": PercentageCalculator,
  "age": AgeCalculator,
  "gpu-speedup": GpuSpeedupCalculator,
  "ai-token-cost": AiTokenCostCalculator,
  "cuda-performance": CudaPerformanceCalculator,
}

export function CalculatorPageContent() {
  return <CalculatorPageInner />
}

function CalculatorPageInner() {
  const params = useParams<{ id: string }>()
  const { user } = useAuth()
  const { addRecent } = useRecents(user?.uid)
  const { toggleFavorite, favorites } = useFavorites(user?.uid)

  const calculator = CALCULATORS.find((c) => c.id === params.id)

  useEffect(() => {
    if (calculator && user) {
      addRecent(calculator.id)
    }
  }, [calculator, user, addRecent])

  const isFav = calculator ? favorites.includes(calculator.id) : false

  const handleToggleFav = useCallback(async () => {
    if (!calculator || !user) return
    await toggleFavorite(calculator.id)
  }, [calculator, user, toggleFavorite])

  if (!calculator) {
    notFound()
    return null
  }

  const CalculatorComponent = calculatorComponents[calculator.id as CalculatorId]

  if (!CalculatorComponent) {
    notFound()
    return null
  }

  return (
    <CalculatorLayout calculator={calculator}>
      <div className="flex justify-end mb-2">
        <Button
          variant={isFav ? "primary" : "outline"}
          size="sm"
          onClick={handleToggleFav}
          disabled={!user}
        >
          <Heart className={`h-4 w-4 mr-1.5 ${isFav ? "fill-current" : ""}`} />
          {isFav ? "Favorited" : "Favorite"}
        </Button>
      </div>
      <motion.div
        key={calculator.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CalculatorComponent />
      </motion.div>
    </CalculatorLayout>
  )
}