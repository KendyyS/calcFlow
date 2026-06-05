"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite as checkIsFavorite,
} from "@/services/firestore-service"

interface UseFavoritesReturn {
  favorites: string[]
  toggleFavorite: (calculatorId: string) => Promise<void>
  isFavorite: (calculatorId: string) => Promise<boolean>
  loading: boolean
}

export function useFavorites(
  userId: string | undefined
): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      const t = setTimeout(() => {
        setFavorites([])
        setLoading(false)
      })
      return () => clearTimeout(t)
    }
    getFavorites(userId)
      .then((data) => {
        setFavorites(data)
        setLoading(false)
      })
      .catch(() => {
        setFavorites([])
        setLoading(false)
      })
  }, [userId])

  const toggleFavorite = useCallback(
    async (calculatorId: string) => {
      if (!userId) return
      const currentlyFav = favorites.includes(calculatorId)
      if (currentlyFav) {
        await removeFavorite(userId, calculatorId)
        setFavorites((prev) => prev.filter((id) => id !== calculatorId))
      } else {
        await addFavorite(userId, calculatorId)
        setFavorites((prev) => [calculatorId, ...prev])
      }
    },
    [userId, favorites]
  )

  const isFavoriteFn = useCallback(
    async (calculatorId: string) => {
      if (!userId) return false
      return checkIsFavorite(userId, calculatorId)
    },
    [userId]
  )

  return { favorites, toggleFavorite, isFavorite: isFavoriteFn, loading }
}