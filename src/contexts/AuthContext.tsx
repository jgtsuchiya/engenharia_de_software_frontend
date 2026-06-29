import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/user'

interface AuthContextType {
    user?: User | null
    token?: string | null
    isAuthenticated: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        let user;
        if (storedUser){

            try{
                user = JSON.parse(storedUser) as User;
            }catch{
                user = null
            }
            if (storedToken && user) {
                return { user, token: storedToken}
            }
        }

        return null;
    })

    const values = useMemo(() => {
        function login(newToken: string, newUser: User) {
            setAuth({ user: newUser, token: newToken })
            localStorage.setItem('token', newToken)
            localStorage.setItem('user', JSON.stringify(newUser))
        }

        function logout() {
            setAuth(null)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }

        return { user: auth?.user, token: auth?.token, isAuthenticated: !!auth?.token, login, logout }
    }, [auth?.token, auth?.user])




    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
    return ctx
}
