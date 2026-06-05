"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WelcomeSection } from "@/features/dashboard/welcome-section"
import { StatsCards } from "@/features/dashboard/stats-cards"
import { RecentCalculators } from "@/features/dashboard/recent-calculators"
import { FavoriteCalculators } from "@/features/dashboard/favorite-calculators"
import { UsageChart } from "@/features/dashboard/usage-chart"
import { CalculatorGrid } from "@/features/dashboard/calculator-grid"

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
}

function DashboardContent() {
  const sections = [
    { id: "welcome", component: <WelcomeSection /> },
    { id: "stats", component: <StatsCards /> },
    { id: "recents", component: <RecentCalculators /> },
    { id: "favorites", component: <FavoriteCalculators /> },
    { id: "chart", component: <UsageChart /> },
    { id: "grid", component: <CalculatorGrid /> },
  ]

  return (
    <div className="space-y-8">
      {sections.map((section, i) => (
        <motion.div
          key={section.id}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          {section.component}
        </motion.div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}