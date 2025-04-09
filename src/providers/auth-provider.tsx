'use client'

import { createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'

interface AuthContextType {
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const logout = async () => {
        await authService.logout()
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 