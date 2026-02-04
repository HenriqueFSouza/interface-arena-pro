import { z } from 'zod'

export const profileSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(1, 'Telefone é obrigatório'),
    profileImage: z.string().nullable().optional(),
})

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type PasswordFormData = z.infer<typeof passwordSchema>
