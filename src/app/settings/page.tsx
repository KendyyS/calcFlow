"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Mail,
  Shield,
  User,
  CreditCard,
  Trash2,
  Sparkles,
  ExternalLink,
  Check,
  Palette,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useTheme } from "@/components/layout/theme-provider"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const NOTIFICATIONS_KEY = "calcflow-notifications"

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
}

const themeOptions = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
]

function SettingsContent() {
  const { user, profile } = useAuth()
  const { mode, setTheme } = useTheme()
  const { toast } = useToast()

  const [displayName, setDisplayName] = useState(profile?.name || user?.displayName || "")
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    if (typeof window === "undefined") {
      return { emailNotifications: true, pushNotifications: true, weeklyDigest: false }
    }
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY)
      if (stored) return JSON.parse(stored)
    } catch {}
    return { emailNotifications: true, pushNotifications: true, weeklyDigest: false }
  })

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    const next = { ...notifications, [key]: value }
    setNotifications(next)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next))
    toast({ title: "Preferences updated", description: "Notification settings saved." })
  }

  const handleSaveGeneral = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast({ title: "Profile updated", description: "Your display name has been saved." })
  }

  const sections = [
    {
      id: "general",
      component: (
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>General</CardTitle>
                <CardDescription>Manage your basic profile information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={user?.email || ""} readOnly disabled />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support for account changes.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 bg-muted/30">
            <Button onClick={handleSaveGeneral} loading={saving} className="gap-2">
              <Check className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      ),
    },
    {
      id: "appearance",
      component: (
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how CalcFlow looks for you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-medium">Theme Mode</label>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((opt) => {
                  const active = mode === opt.value
                  const Icon = opt.icon
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                        active
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/50 hover:border-border hover:bg-accent/50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          active ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          active ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {opt.label}
                      </span>
                      {active && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "notifications",
      component: (
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Control what notifications you receive</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive updates and alerts via email
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(v) => updateNotification("emailNotifications", v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="flex items-start gap-3">
                <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Get push notifications in your browser
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(v) => updateNotification("pushNotifications", v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Weekly Digest</p>
                  <p className="text-xs text-muted-foreground">
                    A weekly summary of your activity
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(v) => updateNotification("weeklyDigest", v)}
              />
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "account",
      component: (
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your subscription and account settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-border/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Current Plan</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {profile?.plan || "free"}
                    </p>
                  </div>
                </div>
                {profile?.plan === "free" ? (
                  <Button size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Manage
                  </Button>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() =>
                  toast({
                    title: "Action required",
                    description: "Please contact support to delete your account.",
                    variant: "destructive",
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                This action is irreversible. All your data will be permanently removed.
              </p>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="general" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>

        {sections.map((section, i) => (
          <TabsContent key={section.id} value={section.id}>
            <motion.div
              custom={i}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              {section.component}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  )
}