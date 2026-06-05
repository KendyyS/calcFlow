"use client"

import { useState } from "react"
import { Save, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalculatorResult } from "@/components/calculators/calculator-result"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { formatNumber } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

const MODES = [
  { id: "x-percent-of-y", label: "What is X% of Y?" },
  { id: "x-is-what-percent-of-y", label: "X is what % of Y?" },
  { id: "x-is-y-percent-of-what", label: "X is Y% of what?" },
]

export default function PercentageCalculator() {
  const { user } = useAuth()
  const [mode, setMode] = useState("x-percent-of-y")
  const [x, setX] = useState("20")
  const [y, setY] = useState("200")

  const numX = parseFloat(x) || 0
  const numY = parseFloat(y) || 0

  let result = 0
  let label = ""
  let resultDesc = ""

  switch (mode) {
    case "x-percent-of-y":
      result = (numX / 100) * numY
      label = `What is ${formatNumber(numX)}% of ${formatNumber(numY)}?`
      resultDesc = `${formatNumber(numX)}% of ${formatNumber(numY)} = ${formatNumber(result)}`
      break
    case "x-is-what-percent-of-y":
      result = numY > 0 ? (numX / numY) * 100 : 0
      label = `${formatNumber(numX)} is what % of ${formatNumber(numY)}?`
      resultDesc = `${formatNumber(numX)} is ${formatNumber(result)}% of ${formatNumber(numY)}`
      break
    case "x-is-y-percent-of-what":
      result = numY > 0 ? (numX / (numY / 100)) : 0
      label = `${formatNumber(numX)} is ${formatNumber(numY)}% of what?`
      resultDesc = `${formatNumber(numX)} is ${formatNumber(numY)}% of ${formatNumber(result)}`
      break
  }

  const handleSave = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "percentage",
        inputs: { mode, x: numX, y: numY },
        outputs: { result },
      })
      toast({ title: "Saved!", variant: "success" })
    } catch { toast({ title: "Error", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Percentage Calculator</h2>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Calculation Mode</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>X</Label>
            <Input type="number" step="any" value={x} onChange={(e) => setX(e.target.value)} placeholder="Enter value X" />
          </div>
          <div className="space-y-2">
            <Label>Y</Label>
            <Input type="number" step="any" value={y} onChange={(e) => setY(e.target.value)} placeholder="Enter value Y" />
          </div>
        </div>
      </div>

      <CalculatorResult title={label} value={formatNumber(result, 4)} highlight={result > 0} description={resultDesc} />

      <div className="flex justify-end">
        <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save Result</Button>
      </div>
    </div>
  )
}