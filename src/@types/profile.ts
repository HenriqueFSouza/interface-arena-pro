export interface Profile {
    id: string
    name: string
    email: string
    phone: string
    profileImage: string | null
    createdAt: string
    updatedAt: string
}

export interface UpdateProfileData {
    name?: string
    email?: string
    phone?: string
    profileImage?: string | null
    currentPassword?: string
    newPassword?: string
}
