"use client"

import { useState, useMemo } from "react"
import { Save, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalculatorResult } from "@/components/calculators/calculator-result"
import { CalculatorChart } from "@/components/calculators/calculator-chart"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

interface ModelPricing {
  id: string
  name: string
  inputPer1K: number
  outputPer1K: number
}

const MODELS: ModelPricing[] = [
  { id: "gpt4", name: "GPT-4", inputPer1K: 0.03, outputPer1K: 0.06 },
  { id: "gpt35", name: "GPT-3.5", inputPer1K: 0.0015, outputPer1K: 0.002 },
  { id: "claude3", name: "Claude 3", inputPer1K: 0.015, outputPer1K: 0.075 },
  { id: "claude35", name: "Claude 3.5", inputPer1K: 0.003, outputPer1K: 0.015 },
  { id: "gemini-pro", name: "Gemini Pro", inputPer1K: 0.001, outputPer1K: 0.002 },
  { id: "llama3", name: "LLaMA 3", inputPer1K: 0.0005, outputPer1K: 0.00075 },
]

export default function AiTokenCostCalculator() {
  const { user } = useAuth()
  const [selectedModel, setSelectedModel] = useState("gpt4")
  const [inputTokens, setInputTokens] = useState("10000")
  const [outputTokens, setOutputTokens] = useState("2000")
  const [dailyUsage, setDailyUsage] = useState("10")

  const model = MODELS.find((m) => m.id === selectedModel) || MODELS[0]
  const inTokens = parseInt(inputTokens) || 0
  const outTokens = parseInt(outputTokens) || 0
  const daily = parseInt(dailyUsage) || 1

  const inputCost = (inTokens / 1000) * model.inputPer1K
  const outputCost = (outTokens / 1000) * model.outputPer1K
  const totalCost = inputCost + outputCost
  const monthlyCost = totalCost * daily * 30

  const comparisonData = useMemo(() => {
    return MODELS.map((m) => ({
      name: m.name.split(" ")[0],
      input: ((inTokens / 1000) * m.inputPer1K * daily * 30),
      output: ((outTokens / 1000) * m.outputPer1K * daily * 30),
      total: ((inTokens / 1000) * m.inputPer1K + (outTokens / 1000) * m.outputPer1K) * daily * 30,
    }))
  }, [inTokens, outTokens, daily])

  const handleSave = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "ai-token-cost",
        inputs: { model: selectedModel, inputTokens: inTokens, outputTokens: outTokens, dailyUsage: daily },
        outputs: { inputCost, outputCost, totalCost, monthlyCost },
      })
      toast({ title: "Saved!", variant: "success" })
    } catch { toast({ title: "Error", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Token Cost Calculator</h2>
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Input Tokens</Label>
            <Input type="number" min={0} value={inputTokens} onChange={(e) => setInputTokens(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Output Tokens</Label>
            <Input type="number" min={0} value={outputTokens} onChange={(e) => setOutputTokens(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Daily API Calls</Label>
            <Input type="number" min={1} value={dailyUsage} onChange={(e) => setDailyUsage(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div><span className="font-medium">Input:</span> ${model.inputPer1K}/1K tokens</div>
          <div><span className="font-medium">Output:</span> ${model.outputPer1K}/1K tokens</div>
          <div><span className="font-medium">Model:</span> {model.name}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <CalculatorResult title="Input Cost" value={formatCurrency(inputCost)} />
        <CalculatorResult title="Output Cost" value={formatCurrency(outputCost)} />
        <CalculatorResult title="Total Cost" value={formatCurrency(totalCost)} highlight />
        <CalculatorResult title="Monthly Est." value={formatCurrency(monthlyCost)} description={`${formatNumber(daily, 0)} calls/day x 30 days`} />
      </div>

      {comparisonData.length > 0 && (
        <CalculatorChart type="bar" data={comparisonData} xKey="name" yKeys={["total"]} title="Monthly Cost Comparison Across Models" />
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save Result</Button>
      </div>
    </div>
  )
}