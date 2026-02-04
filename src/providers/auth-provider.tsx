'use client'

import { authService } from '@/services/auth'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export interface User {
    id: string
    name: string
    email: string
    phone: string
    profileImage: string | null
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    logout: () => Promise<void>
    refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get<User>('/auth/me')
            setUser(response.data)
        } catch {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const refetchUser = useCallback(async () => {
        await fetchUser()
    }, [fetchUser])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const logout = async () => {
        await authService.logout()
        setUser(null)
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, logout, refetchUser }}>
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