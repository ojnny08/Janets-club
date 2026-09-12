import { createContext, useContext } from 'react'
import { type User } from 'firebase/auth'

export type AuthContextValue = {
    user: User | null
    isAdmin: boolean
    loading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
