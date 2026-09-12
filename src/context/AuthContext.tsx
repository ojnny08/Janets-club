import { useEffect, useState } from 'react'
import { type User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { ADMIN_EMAIL, auth } from '../lib/firebase'
import { AuthContext, type AuthContextValue } from './useAuth'

const ERROR_MESSAGES: Record<string, string> = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/invalid-email': 'That email address is not valid.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
}

const FALLBACK_MESSAGE = 'Sign in failed. Please try again.'

function messageFor(error: unknown) {
    if (error instanceof FirebaseError) return ERROR_MESSAGES[error.code] ?? FALLBACK_MESSAGE
    return FALLBACK_MESSAGE
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setError(null)
            return true
        } catch (err) {
            setError(messageFor(err))
            return false
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (err) {
            setError(messageFor(err))
        }
    }

    const clearError = () => setError(null)

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => {
            setUser(u)
            setIsAdmin(u?.email === ADMIN_EMAIL)
            setLoading(false)
        })
    }, [])

    const value: AuthContextValue = { user, isAdmin, loading, error, login, logout, clearError }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
