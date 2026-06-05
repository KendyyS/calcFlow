"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Search, X } from "lucide-react"
import {
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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

const categoryLabels: Record<string, string> = {
  all: "All",
  finance: "Finance",
  health: "Health",
  academic: "Academic",
  tech: "Technology",
  conversion: "Conversion",
}

const categories = ["all", "finance", "health", "academic", "tech", "conversion"] as const

interface CalculatorGridProps {
  initialCategory?: string
}

export function CalculatorGrid({ initialCategory }: CalculatorGridProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "all")

  const filtered = useMemo(() => {
    return CALCULATORS.filter((calc) => {
      const matchesSearch =
        calc.name.toLowerCase().includes(search.toLowerCase()) ||
        calc.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        activeCategory === "all" || calc.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search calculators..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No calculators found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {search
              ? `No results for "${search}" in ${categoryLabels[activeCategory]}`
              : "No calculators in this category yet"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("")
              setActiveCategory("all")
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((calc) => {
              const Icon = iconMap[calc.icon]
              return (
                <motion.div
                  key={calc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    href={`/calculators/${calc.id}`}
                    className="group block glass-card rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/15 transition-colors">
                        {Icon && <Icon className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0">
                          {categoryLabels[calc.category]}
                        </Badge>
                        {calc.pro && (
                          <Badge variant="success" className="text-[10px] px-2 py-0">
                            Pro
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {calc.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {calc.description}
                    </p>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
