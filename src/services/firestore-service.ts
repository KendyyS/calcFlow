import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit as limitFn,
  serverTimestamp,
} from "firebase/firestore"
import { getDbInstance } from "@/lib/firebase"
import type {
  UserProfile,
  CalculationResultInput,
  CalculationResult,
  RecentCalculator,
  CalculatorId,
} from "@/types"

function getDb() {
  return getDbInstance()
}

function getUserDocRef(uid: string) {
  return doc(getDb(), "users", uid)
}

function getFavoritesCollectionRef(userId: string) {
  return collection(getDb(), "users", userId, "favorites")
}

function getFavoriteDocRef(userId: string, calculatorId: string) {
  return doc(getDb(), "users", userId, "favorites", calculatorId)
}

function getRecentsCollectionRef(userId: string) {
  return collection(getDb(), "users", userId, "recents")
}

function getCalculationsCollectionRef(uid: string) {
  return collection(getDb(), "users", uid, "calculations")
}

export async function createUserProfile(
  uid: string,
  data: { name: string; email: string }
): Promise<void> {
  const userProfile: UserProfile = {
    uid,
    name: data.name,
    email: data.email,
    createdAt: new Date(),
    plan: "free",
  }
  await setDoc(getUserDocRef(uid), userProfile)
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snap = await getDoc(getUserDocRef(uid))
  if (!snap.exists()) return null
  const data = snap.data() as Omit<UserProfile, "createdAt"> & {
    createdAt: { toDate: () => Date } | Date
  }
  return {
    ...data,
    createdAt:
      data.createdAt instanceof Date
        ? data.createdAt
        : data.createdAt.toDate(),
  } as UserProfile
}

export async function addFavorite(
  userId: string,
  calculatorId: string
): Promise<void> {
  await setDoc(getFavoriteDocRef(userId, calculatorId), {
    userId,
    calculatorId,
    addedAt: serverTimestamp(),
  })
}

export async function removeFavorite(
  userId: string,
  calculatorId: string
): Promise<void> {
  await deleteDoc(getFavoriteDocRef(userId, calculatorId))
}

export async function getFavorites(userId: string): Promise<string[]> {
  const q = query(
    getFavoritesCollectionRef(userId),
    orderBy("addedAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.data().calculatorId as string)
}

export async function isFavorite(
  userId: string,
  calculatorId: string
): Promise<boolean> {
  const snap = await getDoc(getFavoriteDocRef(userId, calculatorId))
  return snap.exists()
}

export async function addRecent(
  userId: string,
  calculatorId: string
): Promise<void> {
  const recentsRef = getRecentsCollectionRef(userId)
  const q = query(
    recentsRef,
    where("calculatorId", "==", calculatorId as CalculatorId)
  )
  const snap = await getDocs(q)
  const deletePromises = snap.docs.map((d) => deleteDoc(d.ref))
  await Promise.all(deletePromises)
  await addDoc(recentsRef, {
    userId,
    calculatorId,
    timestamp: serverTimestamp(),
  })
}

export async function getRecents(
  userId: string,
  limitCount?: number
): Promise<RecentCalculator[]> {
  const baseQuery = query(
    getRecentsCollectionRef(userId),
    orderBy("timestamp", "desc")
  )
  const q =
    limitCount !== undefined
      ? query(baseQuery, limitFn(limitCount))
      : baseQuery
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      ...data,
      timestamp:
        data.timestamp instanceof Date
          ? data.timestamp
          : data.timestamp.toDate(),
    } as RecentCalculator
  })
}

export async function saveCalculationResult(
  uid: string,
  data: CalculationResultInput
): Promise<string> {
  const docRef = await addDoc(getCalculationsCollectionRef(uid), {
    ...data,
    userId: uid,
    savedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getSavedCalculations(
  uid: string
): Promise<CalculationResult[]> {
  const q = query(
    getCalculationsCollectionRef(uid),
    orderBy("savedAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      ...data,
      savedAt:
        data.savedAt instanceof Date
          ? data.savedAt
          : data.savedAt.toDate(),
    } as CalculationResult
  })
}