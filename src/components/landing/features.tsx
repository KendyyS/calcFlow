"use client"

import { motion } from "framer-motion"
import {
  Calculator,
  BarChart3,
  Moon,
  Download,
  Cloud,
  Users,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Calculator,
    title: "Real-time Calculations",
    description:
      "See results update instantly as you adjust inputs. No page reloads, no waiting — just pure, responsive calculation logic.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Beautiful Charts",
    description:
      "Visualize your data with stunning, interactive charts. From bar graphs to line plots, understand your numbers at a glance.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "Calculate comfortably day or night. Our seamless dark mode reduces eye strain and looks gorgeous on every screen.",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    icon: Download,
    title: "Export Results",
    description:
      "Export your calculations to CSV, PDF, or share them via a unique link. Your data is always accessible and portable.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description:
      "All your calculators, history, and preferences sync automatically across devices. Pick up right where you left off.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Users,
    title: "Team Access",
    description:
      "Collaborate with your team on shared calculators. Create workspaces, control permissions, and calculate together.",
    gradient: "from-rose-500 to-pink-500",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to calculate smarter, faster, and better.
            Built for professionals, students, and teams.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className="group h-full cursor-default border-border/50 transition-all duration-300 hover:border-blue-200/50 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-800/30 dark:hover:shadow-blue-500/5">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm",
                      feature.gradient
                    )}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}