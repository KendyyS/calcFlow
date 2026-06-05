"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { CALCULATORS } from "@/types"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getMotivationalMessage(): string {
  const messages = [
    "Ready to crunch some numbers?",
    "Let's make math work for you today.",
    "Small calculations lead to big insights.",
    "Your data journey starts here.",
    "Keep calculating, keep growing.",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

export function WelcomeSection() {
  const { profile, loading } = useAuth()

  const greeting = useMemo(() => getGreeting(), [])
  const message = useMemo(() => getMotivationalMessage(), [])
  const popularCalc = useMemo(
    () => CALCULATORS.find((c) => c.popular && !c.pro),
    []
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-xl p-6 md:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold">
                {greeting}
                {profile?.name ? (
                  <span className="gradient-text">, {profile.name}</span>
                ) : (
                  ""
                )}
              </h1>
              <p className="text-muted-foreground mt-1">{message}</p>
            </>
          )}
        </div>

        {popularCalc && (
          <Button asChild className="gap-2 shrink-0">
            <a href={`/calculators/${popularCalc.id}`}>
              <Sparkles className="h-4 w-4" />
              {popularCalc.name}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  )
}