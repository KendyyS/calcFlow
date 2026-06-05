"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Financial Analyst",
    initials: "SC",
    quote:
      "CalcFlow has completely transformed how I handle financial models. The real-time calculations and beautiful charts save me hours every week. My team loves the collaboration features.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "High School Teacher",
    initials: "MJ",
    quote:
      "I use CalcFlow daily in my classroom. The grade calculator and statistics tools make it easy for my students to understand complex concepts. The dark mode is a bonus for late-night grading!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Software Engineer",
    initials: "PP",
    quote:
      "The unit converter and base calculator are indispensable for my dev work. Cloud sync means I can access my custom calculators from any machine. Clean, fast, and reliable.",
    rating: 5,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by Users
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our community is saying about CalcFlow.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={cardVariants}>
              <Card className="flex h-full flex-col border-border/50 transition-all duration-300 hover:border-blue-200/50 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-800/30">
                <CardContent className="flex flex-1 flex-col gap-5 p-6">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-medium text-white">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}