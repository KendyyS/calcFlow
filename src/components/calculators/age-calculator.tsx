"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Save, Calendar, Cake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalculatorResult } from "@/components/calculators/calculator-result"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { formatNumber } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

const ZODIAC_SIGNS = [
  { name: "Capricorn", start: [12, 22], end: [1, 19] },
  { name: "Aquarius", start: [1, 20], end: [2, 18] },
  { name: "Pisces", start: [2, 19], end: [3, 20] },
  { name: "Aries", start: [3, 21], end: [4, 19] },
  { name: "Taurus", start: [4, 20], end: [5, 20] },
  { name: "Gemini", start: [5, 21], end: [6, 20] },
  { name: "Cancer", start: [6, 21], end: [7, 22] },
  { name: "Leo", start: [7, 23], end: [8, 22] },
  { name: "Virgo", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", start: [11, 22], end: [12, 21] },
]

function getZodiac(month: number, day: number): string {
  for (const sign of ZODIAC_SIGNS) {
    const [sM, sD] = sign.start
    const [eM, eD] = sign.end
    if (sM <= eM ? (month === sM && day >= sD) || (month === eM && day <= eD) || (month > sM && month < eM)
                  : (month >= sM || month <= eM) && !(month === eM && day > eD) && !(month === sM && day < sD)) {
      if (sM > eM) {
        if (month >= sM || month <= eM) return sign.name
      } else {
        if (month > sM && month < eM) return sign.name
        if (month === sM && day >= sD) return sign.name
        if (month === eM && day <= eD) return sign.name
      }
    }
  }
  return "Capricorn"
}

function daysUntilBirthday(birthMonth: number, birthDay: number): number {
  const now = new Date()
  const currentYear = now.getFullYear()
  let nextBirthday = new Date(currentYear, birthMonth - 1, birthDay)
  if (nextBirthday < now) nextBirthday = new Date(currentYear + 1, birthMonth - 1, birthDay)
  return Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function AgeCalculator() {
  const { user } = useAuth()
  const [dob, setDob] = useState("1990-01-15")

  const ageInfo = useMemo(() => {
    if (!dob) return null
    const birth = new Date(dob)
    if (isNaN(birth.getTime())) return null
    const now = new Date()

    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }

    const totalMonths = years * 12 + months
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalHours = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60))
    const totalMinutes = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60))

    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate())
    const nextBirthdayDays = daysUntilBirthday(birth.getMonth() + 1, birth.getDate())

    return { years, months, days, totalMonths, totalDays, totalWeeks, totalHours, totalMinutes, zodiac, nextBirthdayDays }
  }, [dob])

  const handleSave = async () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return }
    if (!ageInfo) { toast({ title: "Invalid date", variant: "destructive" }); return }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "age",
        inputs: { dob },
        outputs: { years: ageInfo.years, months: ageInfo.months, days: ageInfo.days },
      })
      toast({ title: "Saved!", variant: "success" })
    } catch { toast({ title: "Error", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Age Calculator</h2>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full sm:w-64" />
        </div>
      </div>

      {ageInfo && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CalculatorResult title="Exact Age" value={`${ageInfo.years}y ${ageInfo.months}m ${ageInfo.days}d`} highlight />
            <CalculatorResult title="Next Birthday" value={`${ageInfo.nextBirthdayDays} days`} description={ageInfo.nextBirthdayDays === 0 ? "Today!" : "until your next birthday"} />
            <CalculatorResult title="Zodiac Sign" value={ageInfo.zodiac} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fun Facts</h3>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {[
                { label: "Months", value: formatNumber(ageInfo.totalMonths, 0) },
                { label: "Weeks", value: formatNumber(ageInfo.totalWeeks, 0) },
                { label: "Days", value: formatNumber(ageInfo.totalDays, 0) },
                { label: "Hours", value: formatNumber(ageInfo.totalHours, 0) },
                { label: "Minutes", value: formatNumber(ageInfo.totalMinutes, 0) },
              ].map((f) => (
                <div key={f.label} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-lg font-bold gradient-text">{f.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save Result</Button>
      </div>
    </div>
  )
}