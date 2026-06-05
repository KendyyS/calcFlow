"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeftRight, Save, RefreshCw } from "lucide-react"
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
import { formatCurrency } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "\u20AC" },
  { code: "GBP", name: "British Pound", symbol: "\u00A3" },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00A5" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "INR", name: "Indian Rupee", symbol: "\u20B9" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "CNY", name: "Chinese Yuan", symbol: "CN\u00A5" },
  { code: "KRW", name: "South Korean Won", symbol: "\u20A9" },
]

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, INR: 83.1, BRL: 5.05, CNY: 7.24, KRW: 1320,
}

type ConversionHistory = {
  from: string
  to: string
  amount: number
  result: number
  rate: number
  timestamp: Date
}

export default function CurrencyConverter() {
  const { user } = useAuth()
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [history, setHistory] = useState<ConversionHistory[]>([])
  const historyRef = useRef<ConversionHistory[]>([])

  const rateFrom = EXCHANGE_RATES[fromCurrency] || 1
  const rateTo = EXCHANGE_RATES[toCurrency] || 1
  const conversionRate = rateTo / rateFrom
  const numAmount = parseFloat(amount) || 0
  const result = numAmount * conversionRate

  const recordConversion = () => {
    if (numAmount <= 0 || result <= 0) return
    const entry: ConversionHistory = {
      from: fromCurrency, to: toCurrency, amount: numAmount, result, rate: conversionRate, timestamp: new Date(),
    }
    historyRef.current = [entry, ...historyRef.current].slice(0, 10)
    setHistory(historyRef.current)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    setTimeout(() => recordConversion(), 0)
  }

  const handleFromChange = (v: string) => {
    setFromCurrency(v)
    setTimeout(() => recordConversion(), 0)
  }

  const handleToChange = (v: string) => {
    setToCurrency(v)
    setTimeout(() => recordConversion(), 0)
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setTimeout(() => recordConversion(), 0)
  }

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save results", variant: "destructive" })
      return
    }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "currency",
        inputs: { amount: numAmount, from: fromCurrency, to: toCurrency },
        outputs: { result, rate: conversionRate },
      })
      toast({ title: "Saved!", variant: "success" })
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-5">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromCurrency} onValueChange={handleFromChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" className="mt-6" onClick={handleSwap}>
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toCurrency} onValueChange={handleToChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Conversion Rate</p>
          <p className="text-sm font-medium">
            1 {fromCurrency} = {conversionRate.toFixed(6)} {toCurrency}
          </p>
        </div>
      </div>

      <CalculatorResult
        title={`${fromCurrency} to ${toCurrency}`}
        value={formatCurrency(result, toCurrency)}
        highlight
        description={`${formatCurrency(numAmount, fromCurrency)} = ${formatCurrency(result, toCurrency)}`}
      />

      <div className="glass-card rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Recent Conversions
          </h3>
        </div>
        <Separator />
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <AnimatePresence>
            {history.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No conversions yet</p>
            )}
            {history.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between text-sm py-1.5 px-2 rounded bg-muted/30"
              >
                <span>{formatCurrency(entry.amount, entry.from)}</span>
                <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{formatCurrency(entry.result, entry.to)}</span>
                <span className="text-xs text-muted-foreground">@{entry.rate.toFixed(4)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Save Result
        </Button>
      </div>
    </div>
  )
}