"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, HeartOff } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { useFavorites } from "@/hooks/use-favorites"
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

export function FavoriteCalculators() {
  const { user, loading: authLoading } = useAuth()
  const { favorites, toggleFavorite, loading } = useFavorites(user?.uid)

  const isLoading = authLoading || loading

  const favoriteCalculators = CALCULATORS.filter((c) =>
    favorites.includes(c.id)
  )

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        <h2 className="text-lg font-semibold">Favorite Calculators</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : favoriteCalculators.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-8 text-center"
        >
          <HeartOff className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Save your most-used calculators for quick access
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/calculators">Browse calculators</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {favoriteCalculators.map((calc) => {
            const Icon = iconMap[calc.icon]
            return (
              <motion.div
                key={calc.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative"
              >
                <Link
                  href={`/calculators/${calc.id}`}
                  className="block glass-card rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="rounded-lg bg-primary/10 p-2 w-fit mb-2.5 group-hover:bg-primary/15 transition-colors">
                    {Icon && <Icon className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-sm font-medium truncate">{calc.name}</p>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(calc.id)
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-950"
                  title="Remove from favorites"
                >
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}