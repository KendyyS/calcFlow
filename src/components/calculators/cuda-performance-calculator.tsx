"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalculatorResult } from "@/components/calculators/calculator-result"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { formatNumber } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

export default function CudaPerformanceCalculator() {
  const { user } = useAuth()
  const [gridSize, setGridSize] = useState("64")
  const [blockSize, setBlockSize] = useState("256")
  const [sharedMem, setSharedMem] = useState("48")
  const [registersPerThread, setRegistersPerThread] = useState("32")

  const grid = parseInt(gridSize) || 1
  const block = parseInt(blockSize) || 1
  const shared = parseFloat(sharedMem) || 0
  const regs = parseInt(registersPerThread) || 0

  const MAX_THREADS_PER_SM = 1024
  const MAX_BLOCKS_PER_SM = 16
  const MAX_SHARED_MEM_PER_SM = 96
  const MAX_REGISTERS_PER_SM = 65536
  const MEMORY_BUS_WIDTH = 256
  const MEMORY_CLOCK_GHZ = 1.75

  const threadsPerBlock = block
  const warpsPerBlock = Math.ceil(threadsPerBlock / 32)

  const blocksPerSM = Math.min(
    MAX_BLOCKS_PER_SM,
    Math.floor(MAX_THREADS_PER_SM / threadsPerBlock)
  )

  const sharedMemBlocks = shared > 0 ? Math.floor(MAX_SHARED_MEM_PER_SM / shared) : MAX_BLOCKS_PER_SM
  const regBlocks = regs > 0 ? Math.floor(MAX_REGISTERS_PER_SM / (regs * threadsPerBlock)) : MAX_BLOCKS_PER_SM

  const occupancyLimiters = [blocksPerSM, sharedMemBlocks, regBlocks]
  const effectiveBlocks = Math.min(...occupancyLimiters)
  const effectiveThreads = effectiveBlocks * threadsPerBlock
  const effectiveWarps = effectiveBlocks * warpsPerBlock

  const occupancy = (effectiveThreads / MAX_THREADS_PER_SM) * 100

  const theoreticalBandwidth = 2 * MEMORY_BUS_WIDTH * MEMORY_CLOCK_GHZ * 1000 / 8
  const occupancyPercent = Math.min(occupancy, 100)

  const gaugeColor =
    occupancyPercent >= 80 ? "bg-green-500" :
    occupancyPercent >= 50 ? "bg-yellow-500" : "bg-red-500"

  const totalThreads = grid * block

  const handleSave = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "cuda-performance",
        inputs: { gridSize: grid, blockSize: block, sharedMemory: shared, registersPerThread: regs },
        outputs: { occupancy: occupancyPercent, threadsPerSM: effectiveThreads, warpsPerSM: effectiveWarps },
      })
      toast({ title: "Saved!", variant: "success" })
    } catch { toast({ title: "Error", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">CUDA Performance Calculator</h2>
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Grid Size</Label>
            <Input type="number" min={1} value={gridSize} onChange={(e) => setGridSize(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Block Size (Threads)</Label>
            <Input type="number" min={1} max={1024} value={blockSize} onChange={(e) => setBlockSize(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Shared Memory (KB)</Label>
            <Input type="number" min={0} step="0.1" value={sharedMem} onChange={(e) => setSharedMem(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Registers Per Thread</Label>
            <Input type="number" min={0} max={255} value={registersPerThread} onChange={(e) => setRegistersPerThread(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CalculatorResult title="Occupancy" value={`${formatNumber(occupancyPercent, 1)}%`} highlight description="Theoretical occupancy" />
        <CalculatorResult title="Threads / SM" value={formatNumber(effectiveThreads, 0)} description={`Max: ${MAX_THREADS_PER_SM}`} />
        <CalculatorResult title="Warps / SM" value={formatNumber(effectiveWarps, 0)} />
        <CalculatorResult title="Total Threads" value={formatNumber(totalThreads, 0)} description={`${grid} blocks x ${block} threads`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CalculatorResult title="Theoretical BW" value={`${formatNumber(theoreticalBandwidth, 0)} GB/s`} />
        <CalculatorResult title="Blocks / SM" value={formatNumber(effectiveBlocks, 0)} />
        <CalculatorResult title="Registers Used" value={formatNumber(effectiveThreads * regs, 0)} description={`of ${MAX_REGISTERS_PER_SM}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Occupancy Gauge</h3>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Occupancy: {formatNumber(occupancyPercent, 1)}%</span>
            <span className={gaugeColor.replace("bg-", "text-") + " font-semibold"}>
              {occupancyPercent >= 80 ? "Optimal" : occupancyPercent >= 50 ? "Moderate" : "Low"}
            </span>
          </div>
          <div className="relative h-5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${gaugeColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(occupancyPercent, 100)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div>Blocks limited by: {blocksPerSM}</div>
          <div>Shared mem limited by: {sharedMemBlocks}</div>
          <div>Registers limited by: {regBlocks}</div>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save Result</Button>
      </div>
    </div>
  )
}