import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/user'

interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser) as User)
        }
    }, [])

    function login(newToken: string, newUser: User) {
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    function logout() {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
    return ctx
}
