"use client"

import { motion } from "framer-motion"
import {
  Calculator,
  BookmarkCheck,
  Heart,
  CalendarDays,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

const stats = [
  {
    label: "Calculations Today",
    value: 12,
    icon: Calculator,
    trend: 8.5,
    trending: "up" as const,
  },
  {
    label: "Saved Results",
    value: 48,
    icon: BookmarkCheck,
    trend: 12.3,
    trending: "up" as const,
  },
  {
    label: "Favorite Tools",
    value: 6,
    icon: Heart,
    trend: 2.1,
    trending: "down" as const,
  },
  {
    label: "Active Days",
    value: 23,
    icon: CalendarDays,
    trend: 5.7,
    trending: "up" as const,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

export function StatsCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trending === "up" ? TrendingUp : TrendingDown
        const trendColor =
          stat.trending === "up" ? "text-emerald-500" : "text-red-500"

        return (
          <motion.div
            key={stat.label}
            variants={item}
            className="glass-card rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                <TrendIcon className="h-3.5 w-3.5" />
                <span>{stat.trend}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}