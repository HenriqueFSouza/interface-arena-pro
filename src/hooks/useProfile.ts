import { useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile'
import { UpdateProfileData } from '@/@types/profile'
import { useAuth } from '@/providers/auth-provider'

export function useUpdateProfile() {
    const queryClient = useQueryClient()
    const { refetchUser } = useAuth()

    return useMutation({
        mutationFn: (data: UpdateProfileData) => profileService.updateProfile(data),
        onSuccess: async () => {
            await refetchUser()
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        }
    })
}
