"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Save, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalculatorResult } from "@/components/calculators/calculator-result"
import { CalculatorChart } from "@/components/calculators/calculator-chart"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { formatNumber } from "@/lib/utils"
import { saveCalculationResult } from "@/services/firestore-service"

interface Course {
  id: string
  name: string
  credits: number
  grade: string
}

const GRADE_POINTS: Record<string, number> = {
  "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
}

const GRADES = Object.keys(GRADE_POINTS)

function createCourse(): Course {
  return { id: crypto.randomUUID(), name: "", credits: 3, grade: "B" }
}

export default function GpaCalculator() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([createCourse()])

  const addCourse = useCallback(() => {
    setCourses((prev) => [...prev, createCourse()])
  }, [])

  const removeCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const updateCourse = useCallback((id: string, field: keyof Course, value: string | number) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }, [])

  const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0)
  const totalGradePoints = courses.reduce((sum, c) => sum + (Number(c.credits) || 0) * (GRADE_POINTS[c.grade] || 0), 0)
  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0

  const letterGrade =
    gpa >= 3.7 ? "A" :
    gpa >= 3.3 ? "B+" :
    gpa >= 3.0 ? "B" :
    gpa >= 2.7 ? "B-" :
    gpa >= 2.3 ? "C+" :
    gpa >= 2.0 ? "C" :
    gpa >= 1.7 ? "C-" :
    gpa >= 1.3 ? "D+" :
    gpa >= 1.0 ? "D" : "F"

  const gradeDist = GRADES.map((g) => ({
    name: g,
    count: courses.filter((c) => c.grade === g).length,
  })).filter((d) => d.count > 0)

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save results", variant: "destructive" })
      return
    }
    try {
      await saveCalculationResult(user.uid, {
        calculatorId: "gpa",
        inputs: { courses },
        outputs: { gpa, totalCredits, letterGrade },
      })
      toast({ title: "Saved!", description: "GPA result saved successfully", variant: "success" })
    } catch {
      toast({ title: "Error", description: "Failed to save result", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Your Courses</h2>
          </div>
          <Button variant="outline" size="sm" onClick={addCourse}>
            <Plus className="h-4 w-4 mr-1" /> Add Course
          </Button>
        </div>
        <Separator />
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-end gap-3 p-3 rounded-lg bg-muted/30"
            >
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Course Name</Label>
                <Input
                  placeholder={`Course ${idx + 1}`}
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                />
              </div>
              <div className="w-20 space-y-1">
                <Label className="text-xs">Credits</Label>
                <Input
                  type="number"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, "credits", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="w-24 space-y-1">
                <Label className="text-xs">Grade</Label>
                <Select value={course.grade} onValueChange={(v) => updateCourse(course.id, "grade", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>{g} ({GRADE_POINTS[g]})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={() => removeCourse(course.id)} disabled={courses.length === 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CalculatorResult title="GPA" value={formatNumber(gpa, 2)} highlight description="Grade Point Average" />
        <CalculatorResult title="Total Credits" value={formatNumber(totalCredits, 1)} />
        <CalculatorResult title="Letter Grade" value={letterGrade} />
      </div>

      {gradeDist.length > 0 && (
        <CalculatorChart type="bar" data={gradeDist} xKey="name" yKeys={["count"]} title="Grade Distribution" />
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Save Result
        </Button>
      </div>
    </div>
  )
}