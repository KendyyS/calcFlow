"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Weight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalculatorResult } from "@/components/calculators/calculator-result"
import { formatNumber } from "@/lib/utils"

function getBMICategory(bmi: number): { label: string; color: string; barColor: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", barColor: "bg-blue-500" }
  if (bmi < 25) return { label: "Normal", color: "text-green-500", barColor: "bg-green-500" }
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-500", barColor: "bg-yellow-500" }
  return { label: "Obese", color: "text-red-500", barColor: "bg-red-500" }
}

const MIN_HEALTHY_BMI = 18.5
const MAX_HEALTHY_BMI = 24.9

export default function BmiCalculator() {
  const [heightCm, setHeightCm] = useState("170")
  const [weightKg, setWeightKg] = useState("70")
  const [heightFeet, setHeightFeet] = useState("5")
  const [heightInches, setHeightInches] = useState("9")
  const [weightLbs, setWeightLbs] = useState("154")
  const [useImperial, setUseImperial] = useState(false)

  const height = useMemo(() => {
    if (useImperial) {
      const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0)
      return totalInches * 2.54
    }
    return parseFloat(heightCm) || 0
  }, [useImperial, heightCm, heightFeet, heightInches])

  const weight = useMemo(() => {
    if (useImperial) return (parseFloat(weightLbs) || 0) * 0.453592
    return parseFloat(weightKg) || 0
  }, [useImperial, weightKg, weightLbs])

  const heightM = height / 100
  const bmi = heightM > 0 ? weight / (heightM * heightM) : 0
  const category = getBMICategory(bmi)

  const healthyMin = MIN_HEALTHY_BMI * (heightM * heightM)
  const healthyMax = MAX_HEALTHY_BMI * (heightM * heightM)
  const bmiPercent = Math.min((bmi / 40) * 100, 100)

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Weight className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">BMI Calculator</h2>
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Height ({useImperial ? "ft/in" : "cm"})</Label>
            {useImperial ? (
              <div className="flex gap-2">
                <Input type="number" placeholder="ft" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} />
                <Input type="number" placeholder="in" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
              </div>
            ) : (
              <Input type="number" min={0} step="0.1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            )}
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setUseImperial(!useImperial)}>
              Switch to {useImperial ? "cm" : "ft/in"}
            </Button>
          </div>
          <div className="space-y-3">
            <Label>Weight ({useImperial ? "lbs" : "kg"})</Label>
            {useImperial ? (
              <Input type="number" min={0} step="0.1" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} />
            ) : (
              <Input type="number" min={0} step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
            )}
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setUseImperial(!useImperial)}>
              Switch to {useImperial ? "kg" : "lbs"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CalculatorResult title="Your BMI" value={formatNumber(bmi, 1)} highlight />
        <CalculatorResult title="Category" value={category.label} description={`BMI is ${category.label.toLowerCase()}`} />
        <CalculatorResult title="Healthy Weight Range" value={`${formatNumber(healthyMin, 1)} - ${formatNumber(healthyMax, 1)} kg`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">BMI Scale</span>
          <span className={`text-sm font-bold ${category.color}`}>{category.label}</span>
        </div>
        <div className="relative h-4 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-gray-400 shadow-md z-10"
            style={{ left: `calc(${bmiPercent}% - 10px)` }}
            animate={{ left: `calc(${bmiPercent}% - 10px)` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
        </div>
      </motion.div>

      <div className="glass-card rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Understanding Your BMI</h3>
        <Separator />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { range: "< 18.5", label: "Underweight", color: "text-blue-500" },
            { range: "18.5 - 24.9", label: "Normal", color: "text-green-500" },
            { range: "25 - 29.9", label: "Overweight", color: "text-yellow-500" },
            { range: "30+", label: "Obese", color: "text-red-500" },
          ].map((item) => (
            <div key={item.label} className={`p-2 rounded bg-muted/30 ${item.color}`}>
              <p className="font-semibold">{item.range}</p>
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}