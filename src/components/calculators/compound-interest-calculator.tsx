"use client"

import { useState, useMemo } from "react"
import { Save } from "lucide-react"
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
import { formatCurrency } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

const FREQUENCIES = [
  { value: 1, label: "Annually" },
  { value: 2, label: "Semi-annually" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
  { value: 365, label: "Daily" },
]

export default function CompoundInterestCalculator() {
  const { user } = useAuth()
  const [principal, setPrincipal] = useState("10000")
  const [rate, setRate] = useState("5")
  const [years, setYears] = useState("10")
  const [frequency, setFrequency] = useState("12")

  const P = parseFloat(principal) || 0
  const r = (parseFloat(rate) || 0) / 100
  const t = parseFloat(years) || 0
  const n = parseInt(frequency) || 1

  const totalAmount = P * Math.pow(1 + r / n, n * t)
  const totalInterest = totalAmount - P

  const growthData = useMemo(() => {
    const data = []
    for (let y = 0; y <= t; y++) {
      const amount = P * Math.pow(1 + r / n, n * y)
      data.push({ year: y, amount: Math.round(amount * 100) / 100, interest: Math.round((amount - P) * 100) / 100 })
    }
    return data
  }, [P, r, n, t])

  const breakdownData = useMemo(() => {
    const data = []
    for (let y = 1; y <= t; y++) {
      const amount = P * Math.pow(1 + r / n, n * y)
      const prevAmount = P * Math.pow(1 + r / n, n * (y - 1))
      data.push({
        year: y,
        amount: Math.round(amount * 100) / 100,
        interest: Math.round((amount - P) * 100) / 100,
        yearInterest: Math.round((amount - prevAmount) * 100) / 100,
      })
    }
    return data
  }, [P, r, n, t])

  const handleSave = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "compound-interest",
        inputs: { principal: P, rate: parseFloat(rate), years: t, frequency: n },
        outputs: { totalAmount, totalInterest },
      })
      toast({ title: "Saved!", variant: "success" })
    } catch { toast({ title: "Error", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Principal ($)</Label>
            <Input type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Annual Rate (%)</Label>
            <Input type="number" min={0} step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Time (Years)</Label>
            <Input type="number" min={1} max={50} value={years} onChange={(e) => setYears(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Compound Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map((f) => (
                  <SelectItem key={f.value} value={String(f.value)}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CalculatorResult title="Total Amount" value={formatCurrency(totalAmount)} highlight />
        <CalculatorResult title="Total Interest" value={formatCurrency(totalInterest)} />
        <CalculatorResult title="Principal" value={formatCurrency(P)} />
      </div>

      {t > 0 && (
        <CalculatorChart type="area" data={growthData} xKey="year" yKeys={["amount", "interest"]} title="Growth Over Time" />
      )}

      {breakdownData.length > 0 && (
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Yearly Breakdown</h3>
          <Separator />
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground text-xs border-b">
                  <th className="pb-2 font-medium">Year</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Year Interest</th>
                  <th className="pb-2 font-medium">Total Interest</th>
                </tr>
              </thead>
              <tbody>
                {breakdownData.map((row) => (
                  <tr key={row.year} className="border-b border-border/40 last:border-0">
                    <td className="py-2">{row.year}</td>
                    <td className="py-2 font-medium">{formatCurrency(row.amount)}</td>
                    <td className="py-2">{formatCurrency(row.yearInterest)}</td>
                    <td className="py-2">{formatCurrency(row.interest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save Result</Button>
      </div>
    </div>
  )
}