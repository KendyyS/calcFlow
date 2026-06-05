"use client"

import { useState, useMemo } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalculatorResult } from "@/components/calculators/calculator-result"
import { CalculatorChart } from "@/components/calculators/calculator-chart"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

interface AmortizationRow {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export default function LoanCalculator() {
  const { user } = useAuth()
  const [loanAmount, setLoanAmount] = useState("300000")
  const [interestRate, setInterestRate] = useState("6.5")
  const [loanTerm, setLoanTerm] = useState("30")
  const [downPayment, setDownPayment] = useState("60000")

  const P = Math.max(0, (parseFloat(loanAmount) || 0) - (parseFloat(downPayment) || 0))
  const annualRate = (parseFloat(interestRate) || 0) / 100
  const r = annualRate / 12
  const n = (parseFloat(loanTerm) || 0) * 12

  const monthlyPayment = r > 0 && n > 0
    ? P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    : P / (n || 1)

  const amortization = useMemo((): AmortizationRow[] => {
    const rows: AmortizationRow[] = []
    let balance = P
    let period = 0
    while (balance > 0.01 && period < n) {
      period++
      const interest = balance * r
      const principal = monthlyPayment - interest
      balance = Math.max(0, balance - principal)
      rows.push({ period, payment: monthlyPayment, principal, interest, balance })
      if (period > 360) break
    }
    return rows
  }, [P, r, monthlyPayment, n])

  const totalPaid = monthlyPayment * amortization.length
  const totalInterest = totalPaid - P

  const pieData = [
    { name: "Principal", value: Math.round(P) },
    { name: "Interest", value: Math.round(totalInterest) },
  ].filter((d) => d.value > 0)

  const handleSave = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "loan",
        inputs: { loanAmount: parseFloat(loanAmount), rate: parseFloat(interestRate), term: parseFloat(loanTerm), downPayment: parseFloat(downPayment) },
        outputs: { monthlyPayment, totalInterest, totalPaid },
      })
      toast({ title: "Saved!", variant: "success" })
    } catch { toast({ title: "Error", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold">Loan Details</h2>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Loan Amount ($)</Label>
            <Input type="number" min={0} value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Down Payment ($)</Label>
            <Input type="number" min={0} value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <Input type="number" min={0} step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Loan Term (Years)</Label>
            <Input type="number" min={1} max={50} value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CalculatorResult title="Monthly Payment" value={formatCurrency(monthlyPayment)} highlight />
        <CalculatorResult title="Total Interest" value={formatCurrency(totalInterest)} />
        <CalculatorResult title="Total Payment" value={formatCurrency(totalPaid)} />
      </div>

      {pieData.length > 0 && (
        <CalculatorChart type="pie" data={pieData} xKey="name" yKeys={["value"]} title="Principal vs Interest" />
      )}

      {amortization.length > 0 && (
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Amortization Schedule</h3>
          <Separator />
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground text-xs border-b">
                  <th className="pb-2 font-medium">Period</th>
                  <th className="pb-2 font-medium">Payment</th>
                  <th className="pb-2 font-medium">Principal</th>
                  <th className="pb-2 font-medium">Interest</th>
                  <th className="pb-2 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortization.map((row) => (
                  <tr key={row.period} className="border-b border-border/40 last:border-0">
                    <td className="py-2">{row.period}</td>
                    <td className="py-2">{formatCurrency(row.payment)}</td>
                    <td className="py-2">{formatCurrency(row.principal)}</td>
                    <td className="py-2">{formatCurrency(row.interest)}</td>
                    <td className="py-2 font-medium">{formatCurrency(row.balance)}</td>
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