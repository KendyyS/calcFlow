"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

const demoData = [
  { day: "Mon", calculations: 4 },
  { day: "Tue", calculations: 7 },
  { day: "Wed", calculations: 5 },
  { day: "Thu", calculations: 9 },
  { day: "Fri", calculations: 6 },
  { day: "Sat", calculations: 3 },
  { day: "Sun", calculations: 8 },
]

export function UsageChart() {
  const { profile } = useAuth()
  const isPro = profile?.plan === "pro"

  const data = useMemo(() => demoData, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Usage (Last 7 Days)</h2>
        </div>
        {!isPro && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <Lock className="h-3 w-3" />
            Pro
          </div>
        )}
      </div>

      {isPro ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="calculations"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="relative h-64 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 backdrop-blur-[2px] rounded-lg" />
          <div className="relative z-10">
            <Lock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Usage analytics are Pro-only</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Upgrade to see your calculation history, trends, and insights
            </p>
            <Button size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
            <svg viewBox="0 0 400 80" className="w-full h-full">
              <path
                d="M0,60 Q50,20 100,40 T200,30 T300,45 T400,25 L400,80 L0,80 Z"
                fill="hsl(var(--primary))"
                opacity={0.3}
              />
              <path
                d="M0,65 Q50,35 100,50 T200,40 T300,55 T400,35 L400,80 L0,80 Z"
                fill="hsl(var(--primary))"
                opacity={0.15}
              />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  )
}