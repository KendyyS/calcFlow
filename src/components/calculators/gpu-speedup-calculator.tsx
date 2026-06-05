"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalculatorResult } from "@/components/calculators/calculator-result"
import { CalculatorChart } from "@/components/calculators/calculator-chart"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { formatNumber } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

export default function GpuSpeedupCalculator() {
  const { user } = useAuth()
  const [cpuTime, setCpuTime] = useState("1000")
  const [gpuTime, setGpuTime] = useState("100")
  const [gpuCores, setGpuCores] = useState("1024")

  const cpu = parseFloat(cpuTime) || 0
  const gpu = parseFloat(gpuTime) || 0
  const cores = parseFloat(gpuCores) || 1

  const speedup = gpu > 0 ? cpu / gpu : 0
  const efficiency = speedup / cores

  const speedupColor =
    speedup >= 10 ? "text-green-500" :
    speedup >= 5 ? "text-yellow-500" :
    speedup >= 1 ? "text-orange-500" : "text-red-500"

  const speedupLabel =
    speedup >= 10 ? "Excellent" :
    speedup >= 5 ? "Good" :
    speedup >= 2 ? "Moderate" :
    speedup >= 1 ? "Minimal" : "Slower"

  const chartData = [
    { name: "CPU", time: cpu },
    { name: "GPU", time: gpu },
  ]

  const handleSave = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "gpu-speedup",
        inputs: { cpuTime: cpu, gpuTime: gpu, gpuCores: cores },
        outputs: { speedup, efficiency },
      })
      toast({ title: "Saved!", variant: "success" })
    } catch { toast({ title: "Error", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">GPU Speedup Calculator</h2>
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>CPU Execution Time (ms)</Label>
            <Input type="number" min={0} step="any" value={cpuTime} onChange={(e) => setCpuTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>GPU Execution Time (ms)</Label>
            <Input type="number" min={0} step="any" value={gpuTime} onChange={(e) => setGpuTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>GPU Cores (optional)</Label>
            <Input type="number" min={1} value={gpuCores} onChange={(e) => setGpuCores(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CalculatorResult title="Speedup Factor" value={`${formatNumber(speedup, 2)}x`} highlight description={speedupLabel} />
        <CalculatorResult title="Efficiency" value={`${formatNumber(efficiency * 100, 4)}%`} description={`per core`} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border backdrop-blur-md p-5 space-y-2 glass-card"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</p>
          <p className={`text-2xl md:text-3xl font-bold ${speedupColor}`}>{speedupLabel}</p>
          <p className="text-xs text-muted-foreground">
            GPU is {speedup >= 1 ? formatNumber(speedup, 2) : formatNumber(1 / speedup, 2)}x
            {speedup >= 1 ? " faster" : " slower"} than CPU
          </p>
        </motion.div>
      </div>

      {cpu > 0 && gpu > 0 && (
        <CalculatorChart type="bar" data={chartData} xKey="name" yKeys={["time"]} title="Execution Time Comparison (ms)" />
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save Result</Button>
      </div>
    </div>
  )
}