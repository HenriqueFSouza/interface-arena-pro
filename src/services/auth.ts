import { api } from '@/lib/api'

interface LoginCredentials {
  email: string
  password: string
}

interface User {
  id: string
  name: string
  email: string
  // ... outros campos do perfil
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials)
    return response
  },

  async logout() {
    await api.post('/auth/logout')
  },

  async validateToken(): Promise<boolean> {
    try {
      await api.get('/auth/me')
      return true
    } catch {
      return false
    }
  }
} 