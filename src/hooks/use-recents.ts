"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getRecents,
  addRecent as addRecentService,
} from "@/services/firestore-service"
import type { RecentCalculator } from "@/types"

interface UseRecentsReturn {
  recents: RecentCalculator[]
  addRecent: (calculatorId: string) => Promise<void>
  loading: boolean
}

export function useRecents(
  userId: string | undefined
): UseRecentsReturn {
  const [recents, setRecents] = useState<RecentCalculator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      const t = setTimeout(() => {
        setRecents([])
        setLoading(false)
      })
      return () => clearTimeout(t)
    }
    getRecents(userId, 20)
      .then((data) => {
        setRecents(data)
        setLoading(false)
      })
      .catch(() => {
        setRecents([])
        setLoading(false)
      })
  }, [userId])

  const addRecent = useCallback(
    async (calculatorId: string) => {
      if (!userId) return
      await addRecentService(userId, calculatorId)
      const updated = await getRecents(userId, 20)
      setRecents(updated)
    },
    [userId]
  )

  return { recents, addRecent, loading }
}