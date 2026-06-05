"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Clock,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Activity,
  Landmark,
  Percent,
  Calendar,
  Cpu,
  Brain,
  Server,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { useRecents } from "@/hooks/use-recents"
import { CALCULATORS } from "@/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "graduation-cap": GraduationCap,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
  activity: Activity,
  landmark: Landmark,
  percent: Percent,
  calendar: Calendar,
  cpu: Cpu,
  brain: Brain,
  server: Server,
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export function RecentCalculators() {
  const { user, loading: authLoading } = useAuth()
  const { recents, loading } = useRecents(user?.uid)

  const isLoading = authLoading || loading

  const calculators = recents
    .map((r) => {
      const calc = CALCULATORS.find((c) => c.id === r.calculatorId)
      return calc ? { ...calc, timestamp: r.timestamp } : null
    })
    .filter(Boolean)

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Recent Calculators</h2>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-44 shrink-0 rounded-xl" />
          ))}
        </div>
      ) : calculators.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-8 text-center"
        >
          <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No recent calculations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start using calculators and they will appear here
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/calculators">Browse calculators</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {calculators.map((calc) => {
            if (!calc) return null
            const Icon = iconMap[calc.icon]
            return (
              <motion.div
                key={calc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="shrink-0"
              >
                <Link
                  href={`/calculators/${calc.id}`}
                  className="block glass-card rounded-xl p-4 w-44 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      {Icon && <Icon className="h-4 w-4 text-primary" />}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(calc.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{calc.name}</p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}