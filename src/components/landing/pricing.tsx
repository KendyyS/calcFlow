"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started with basic calculations.",
    href: "/register",
    cta: "Get Started",
    featured: false,
    features: [
      { included: true, text: "Up to 10 calculators" },
      { included: true, text: "Real-time calculations" },
      { included: true, text: "Basic charts" },
      { included: true, text: "Dark mode" },
      { included: false, text: "Export to CSV/PDF" },
      { included: false, text: "Cloud sync" },
      { included: false, text: "Team collaboration" },
      { included: false, text: "Priority support" },
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Unlock everything CalcFlow has to offer.",
    href: "/register?plan=pro",
    cta: "Start Free Trial",
    featured: true,
    features: [
      { included: true, text: "Unlimited calculators" },
      { included: true, text: "Real-time calculations" },
      { included: true, text: "Advanced interactive charts" },
      { included: true, text: "Dark mode" },
      { included: true, text: "Export to CSV/PDF" },
      { included: true, text: "Cloud sync across devices" },
      { included: true, text: "Team collaboration" },
      { included: true, text: "Priority support" },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
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

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, upgrade when you need more power.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={cn(
                "relative flex",
                tier.featured && "lg:-mt-4 lg:mb-4"
              )}
            >
              <Card
                className={cn(
                  "flex w-full flex-col border-border/50 transition-all duration-300",
                  tier.featured &&
                    "border-blue-300/50 shadow-xl shadow-blue-500/10 dark:border-blue-700/50 dark:shadow-blue-500/5"
                )}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="gradient-primary text-white shadow-sm">
                      Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="flex flex-col gap-6 p-6 pt-8">
                  <div>
                    <h3 className="text-xl font-semibold">{tier.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature.text}
                        className={cn(
                          "flex items-center gap-3 text-sm",
                          !feature.included && "text-muted-foreground/60"
                        )}
                      >
                        {feature.included ? (
                          <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                        )}
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Link href={tier.href} className="w-full">
                    <Button
                      variant={tier.featured ? "primary" : "outline"}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}