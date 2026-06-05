"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedGradient } from "./animated-gradient"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <AnimatedGradient />

      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-indigo-900/20 dark:from-blue-500/5 dark:to-indigo-800/10" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-blue-50/80 px-4 py-1.5 text-xs font-medium text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            Now in Beta — Try it Free
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="gradient-text">Modern Smart Calculators</span>
          <br />
          <span className="text-foreground">for Everyone</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          CalcFlow brings powerful, interactive calculators to your fingertips. 
          From finance to health, make complex calculations simple with real-time 
          results, beautiful charts, and seamless collaboration.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/dashboard">
            <Button size="lg" className="group h-12 px-8 text-base">
              Start Calculating
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Try Free
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-indigo-500"
                />
              ))}
            </div>
            <span>Joined by 2,000+ users</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}