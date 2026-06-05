"use client"

import { motion } from "framer-motion"
import {
  DollarSign,
  Heart,
  BookOpen,
  Cpu,
  ArrowLeftRight,
  PiggyBank,
  Activity,
  Calculator,
  Hash,
  Ruler,
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  {
    name: "Finance",
    icon: DollarSign,
    gradient: "from-emerald-500 to-teal-500",
    calculators: [
      { name: "Mortgage Calculator", icon: PiggyBank },
      { name: "Loan Calculator", icon: DollarSign },
      { name: "Investment Returns", icon: Activity },
    ],
  },
  {
    name: "Health",
    icon: Heart,
    gradient: "from-rose-500 to-pink-500",
    calculators: [
      { name: "BMI Calculator", icon: Heart },
      { name: "Calorie Tracker", icon: Activity },
      { name: "Body Fat %", icon: Heart },
    ],
  },
  {
    name: "Academic",
    icon: BookOpen,
    gradient: "from-violet-500 to-purple-500",
    calculators: [
      { name: "Grade Calculator", icon: BookOpen },
      { name: "GPA Estimator", icon: Calculator },
      { name: "Statistics Tool", icon: Hash },
    ],
  },
  {
    name: "Technology",
    icon: Cpu,
    gradient: "from-cyan-500 to-blue-500",
    calculators: [
      { name: "Base Converter", icon: Cpu },
      { name: "Bandwidth Calc", icon: Activity },
      { name: "Hash Generator", icon: Hash },
    ],
  },
  {
    name: "Conversion",
    icon: ArrowLeftRight,
    gradient: "from-orange-500 to-amber-500",
    calculators: [
      { name: "Unit Converter", icon: Ruler },
      { name: "Currency Exchange", icon: DollarSign },
      { name: "Time Zone Calc", icon: ArrowLeftRight },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export function CalculatorShowcase() {
  return (
    <section id="calculators" className="relative py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Calculators for Every Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From finance to fitness, we have the tools you need.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {categories.map((category) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
              className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-blue-200/50 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-800/30"
            >
              <div
                className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm",
                  category.gradient
                )}
              >
                <category.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-4 text-lg font-semibold">{category.name}</h3>
              <ul className="space-y-3">
                {category.calculators.map((calc) => (
                  <li key={calc.name}>
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <calc.icon className="h-4 w-4 shrink-0" />
                      <span>{calc.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            And many more calculators — updated regularly.
          </p>
        </motion.div>
      </div>
    </section>
  )
}