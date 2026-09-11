import { createContext, useContext, useEffect, useState } from "react";
import { type User, signInWithPopup, signOut, onAuthStateChanged} from 'firebase/auth'
import { ADMIN_EMAIL, auth, googleProvider} from "../lib/firebase";

type AuthContextValue = {
    user: User | null
    isAdmin: boolean
    loading: boolean
    login: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined >(undefined);

export default function AuthProvider({ children } : { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setIsAdmin(u?.email === ADMIN_EMAIL);
            setLoading(false);
        })
        return unSub
    },[])

    const value = {isAdmin, loading, logout, login, user}
    
    return <AuthContext.Provider value={value}>
        { children }
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context;
}