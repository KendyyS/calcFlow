export type CalculatorId =
  | "gpa"
  | "currency"
  | "compound-interest"
  | "bmi"
  | "loan"
  | "percentage"
  | "age"
  | "gpu-speedup"
  | "ai-token-cost"
  | "cuda-performance"

export interface Calculator {
  id: CalculatorId
  name: string
  description: string
  icon: string
  category: CalculatorCategory
  pro: boolean
  popular?: boolean
}

export type CalculatorCategory =
  | "finance"
  | "health"
  | "academic"
  | "tech"
  | "conversion"

export interface UserProfile {
  uid: string
  name: string
  email: string
  photoURL?: string
  createdAt: Date
  plan: "free" | "pro"
}

export interface FavoriteCalculator {
  userId: string
  calculatorId: CalculatorId
  addedAt: Date
}

export interface RecentCalculator {
  userId: string
  calculatorId: CalculatorId
  timestamp: Date
}

export interface CalculationResult {
  id: string
  userId: string
  calculatorId: CalculatorId
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  savedAt: Date
}

export interface ThemeConfig {
  mode: "light" | "dark" | "system"
}

export interface AnalyticsEvent {
  userId?: string
  event: string
  properties?: Record<string, unknown>
  timestamp: Date
}

export const CALCULATORS: Calculator[] = [
  { id: "gpa", name: "GPA Calculator", description: "Calculate your Grade Point Average", icon: "graduation-cap", category: "academic", pro: false, popular: true },
  { id: "currency", name: "Currency Converter", description: "Convert between world currencies", icon: "dollar-sign", category: "conversion", pro: false, popular: true },
  { id: "compound-interest", name: "Compound Interest", description: "Calculate compound interest growth", icon: "trending-up", category: "finance", pro: false, popular: true },
  { id: "bmi", name: "BMI Calculator", description: "Calculate your Body Mass Index", icon: "activity", category: "health", pro: false, popular: true },
  { id: "loan", name: "Loan Calculator", description: "Calculate loan payments and interest", icon: "landmark", category: "finance", pro: false, popular: false },
  { id: "percentage", name: "Percentage Calculator", description: "Quick percentage calculations", icon: "percent", category: "finance", pro: false, popular: true },
  { id: "age", name: "Age Calculator", description: "Calculate exact age in years, months, days", icon: "calendar", category: "conversion", pro: false, popular: false },
  { id: "gpu-speedup", name: "GPU Speedup", description: "Compare CPU vs GPU performance", icon: "cpu", category: "tech", pro: true, popular: false },
  { id: "ai-token-cost", name: "AI Token Cost", description: "Estimate LLM API costs", icon: "brain", category: "tech", pro: true, popular: true },
  { id: "cuda-performance", name: "CUDA Performance", description: "Analyze CUDA kernel performance", icon: "server", category: "tech", pro: true, popular: false },
]

export interface CalculationResultInput {
  calculatorId: CalculatorId
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
}

export const CATEGORIES: { id: CalculatorCategory; label: string; icon: string }[] = [
  { id: "finance", label: "Finance", icon: "wallet" },
  { id: "health", label: "Health", icon: "heart" },
  { id: "academic", label: "Academic", icon: "book-open" },
  { id: "tech", label: "Technology", icon: "monitor" },
  { id: "conversion", label: "Conversion", icon: "arrow-left-right" },
]