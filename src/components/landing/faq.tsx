"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "What is CalcFlow?",
    answer:
      "CalcFlow is a modern, web-based platform that provides powerful interactive calculators for finance, health, academics, technology, and everyday conversions. Each calculator updates in real-time and includes beautiful data visualizations.",
  },
  {
    question: "Is CalcFlow really free?",
    answer:
      "Yes! CalcFlow offers a generous free tier that includes access to 10 calculators, real-time calculations, basic charts, and dark mode. No credit card required. You can upgrade to Pro anytime for unlimited access and advanced features.",
  },
  {
    question: "Can I use CalcFlow offline?",
    answer:
      "CalcFlow is primarily a web-based application that requires an internet connection. However, with the Pro plan, your data syncs across devices automatically, so you can seamlessly switch between desktop and mobile.",
  },
  {
    question: "How does cloud sync work?",
    answer:
      "Your calculators, history, saved results, and preferences are stored securely in the cloud. When you log in from any device, everything is automatically synced so you can pick up right where you left off.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Absolutely. The Pro plan includes team collaboration features. You can create shared workspaces, set permissions, and work on calculators together in real-time. It's perfect for teams, classrooms, and study groups.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All payments are processed securely through Stripe. You can cancel your Pro subscription at any time.",
  },
]

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Got questions? We have answers.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="mt-16 space-y-3"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={cn(
                "rounded-xl border border-border/50 overflow-hidden transition-colors",
                openIndex === index
                  ? "border-blue-200/50 dark:border-blue-800/30"
                  : "hover:border-border"
              )}
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-accent/50"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}