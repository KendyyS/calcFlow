import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
  type Unsubscribe,
} from "firebase/auth"
import { getAuthInstance } from "@/lib/firebase"
import { createUserProfile, getUserProfile } from "./firestore-service"

function getAuth() {
  return getAuthInstance()
}

export function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(getAuth(), email, password)
}

export async function registerWithEmail(
  email: string,
  password: string,
  name: string
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(getAuth(), email, password)
  await createUserProfile(credential.user.uid, {
    name,
    email,
  })
  return credential
}

export async function loginWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: "select_account" })
  const credential = await signInWithPopup(getAuth(), provider)
  const existingProfile = await getUserProfile(credential.user.uid)
  if (!existingProfile) {
    await createUserProfile(credential.user.uid, {
      name: credential.user.displayName || "User",
      email: credential.user.email || "",
    })
  }
  return credential
}

export function logout(): Promise<void> {
  return signOut(getAuth())
}

export function getCurrentUser(): User | null {
  return getAuth().currentUser
}

export function onAuthChange(
  callback: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(getAuth(), callback)
}