import type { Metadata } from "next"
import { LandingLayout } from "@/components/layout/landing-layout"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { CalculatorShowcase } from "@/components/landing/calculator-showcase"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "CalcFlow — Modern Smart Calculators for Everyone",
  description:
    "CalcFlow brings powerful, interactive calculators to your fingertips. From finance to health, make complex calculations simple with real-time results, beautiful charts, and seamless collaboration.",
  openGraph: {
    title: "CalcFlow — Modern Smart Calculators for Everyone",
    description:
      "Powerful, interactive calculators with real-time results, beautiful charts, and seamless collaboration.",
  },
}

export default function Home() {
  return (
    <LandingLayout>
      <Hero />
      <Features />
      <CalculatorShowcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </LandingLayout>
  )
}