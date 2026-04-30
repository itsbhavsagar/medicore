import { initializeApp, type FirebaseOptions } from 'firebase/app'
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import type { AuthUser } from '../types'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

const REQUIRED_CONFIG_FIELDS: Array<keyof FirebaseOptions> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
]

export const isFirebaseConfigured = REQUIRED_CONFIG_FIELDS.every((field) =>
  Boolean(firebaseConfig[field]),
)

const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null
const googleProvider = new GoogleAuthProvider()

export const firebaseUnavailableMessage =
  'Firebase authentication is not configured. Add your Vite Firebase environment variables to enable sign-in.'

const deriveNameFromEmail = (email: string) => {
  const localPart = email.split('@')[0] ?? 'MediCore User'

  return localPart
    .split(/[._-]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export const mapFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email ?? '',
  name: user.displayName?.trim() || deriveNameFromEmail(user.email ?? ''),
})

export const subscribeToAuthChanges = (
  callback: (user: AuthUser | null) => void,
) => {
  if (!firebaseAuth) {
    callback(null)

    return () => undefined
  }

  return onAuthStateChanged(firebaseAuth, (user) => {
    callback(user ? mapFirebaseUser(user) : null)
  })
}

export const loginWithEmailPassword = async (email: string, password: string) => {
  if (!firebaseAuth) {
    throw new Error(firebaseUnavailableMessage)
  }

  await setPersistence(firebaseAuth, browserLocalPersistence)
  const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password)

  return mapFirebaseUser(credentials.user)
}

export const loginWithGoogle = async () => {
  if (!firebaseAuth) {
    throw new Error(firebaseUnavailableMessage)
  }

  await setPersistence(firebaseAuth, browserLocalPersistence)
  const credentials = await signInWithPopup(firebaseAuth, googleProvider)

  return mapFirebaseUser(credentials.user)
}

export const logoutFromFirebase = async () => {
  if (!firebaseAuth) {
    return
  }

  await signOut(firebaseAuth)
}
