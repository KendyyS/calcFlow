"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { User, UserCredential } from "firebase/auth"
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle as googleLogin,
  logout as authLogout,
  onAuthChange,
} from "@/services/auth-service"
import { getUserProfile } from "@/services/firestore-service"
import type { UserProfile } from "@/types"

interface AuthContextValue {
  user: User | null
  loading: boolean
  profile: UserProfile | null
  login: (email: string, password: string) => Promise<UserCredential>
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<UserCredential>
  loginWithGoogle: () => Promise<UserCredential>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const p = await getUserProfile(firebaseUser.uid)
          setProfile(p)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null)
      try {
        const cred = await loginWithEmail(email, password)
        return cred
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Login failed"
        setError(msg)
        throw err
      }
    },
    []
  )

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setError(null)
      try {
        const cred = await registerWithEmail(email, password, name)
        return cred
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Registration failed"
        setError(msg)
        throw err
      }
    },
    []
  )

  const loginWithGoogle = useCallback(async () => {
    setError(null)
    try {
      const cred = await googleLogin()
      return cred
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Google login failed"
      setError(msg)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    try {
      await authLogout()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Logout failed"
      setError(msg)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        login,
        register,
        loginWithGoogle,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}