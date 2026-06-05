import { CALCULATORS } from "@/types"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CalculatorPageContent } from "./CalculatorPageContent"

export async function generateStaticParams() {
  return CALCULATORS.map((c) => ({ id: c.id }))
}

export default function CalculatorPage() {
  return (
    <DashboardLayout>
      <CalculatorPageContent />
    </DashboardLayout>
  )
}
