import { api } from '@/lib/api'
import { Profile, UpdateProfileData } from '@/@types/profile'

export const profileService = {
    async getProfile(): Promise<Profile> {
        const response = await api.get<Profile>('/auth/me')
        return response.data
    },

    async updateProfile(data: UpdateProfileData): Promise<Profile> {
        const response = await api.put<Profile>('/profiles/me', data)
        return response.data
    }
}
