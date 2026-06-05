"use client"

import { motion } from "framer-motion"
import {
  User,
  Calculator,
  Bookmark,
  Heart,
  Calendar,
  Clock,
  Edit3,
  Activity,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
}

const statCards = [
  {
    label: "Total Calculations",
    value: 142,
    icon: Calculator,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Saved Results",
    value: 38,
    icon: Bookmark,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Favorites",
    value: 12,
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
]

const recentActivity = [
  {
    action: "Calculated BMI",
    detail: "Body Mass Index - 22.4 kg/m²",
    time: "2 hours ago",
    icon: Activity,
  },
  {
    action: "Converted Currency",
    detail: "USD 100.00 → EUR 92.50",
    time: "5 hours ago",
    icon: TrendingUp,
  },
  {
    action: "Used AI Token Cost",
    detail: "GPT-4o: 150K tokens estimated",
    time: "1 day ago",
    icon: Sparkles,
  },
  {
    action: "Calculated GPA",
    detail: "Semester GPA: 3.75",
    time: "2 days ago",
    icon: Calculator,
  },
  {
    action: "Added to Favorites",
    detail: "Compound Interest Calculator",
    time: "3 days ago",
    icon: Heart,
  },
]

function formatMemberSince(date?: Date | string): string {
  if (!date) return "N/A"
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function ProfileContent() {
  const { user, profile } = useAuth()

  const name = profile?.name || user?.displayName || "User"
  const email = user?.email || "No email"
  const photoURL = profile?.photoURL || user?.photoURL || undefined
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const sections = [
    {
      id: "header",
      component: (
        <Card className="glass-card overflow-hidden">
          <div className="relative h-32 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20" />
          <div className="relative px-6 pb-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end -mt-12">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                {photoURL ? (
                  <AvatarImage src={photoURL} alt={name} />
                ) : (
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 pt-2 sm:pt-0">
                <h1 className="text-2xl font-bold">{name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Member since {formatMemberSince(profile?.createdAt)}
                  </span>
                </div>
              </div>
              <Button className="gap-2 shrink-0 mt-2 sm:mt-0">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: "stats",
      component: (
        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        stat.bg
                      )}
                    >
                      <Icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ),
    },
    {
      id: "activity",
      component: (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest calculations and actions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {recentActivity.map((activity, i) => {
                const Icon = activity.icon
                return (
                  <div key={i}>
                    <div className="flex items-start gap-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.detail}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">
                        {activity.time}
                      </span>
                    </div>
                    {i < recentActivity.length - 1 && (
                      <Separator className="bg-border/50" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-8">
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

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfileContent />
    </DashboardLayout>
  )
}