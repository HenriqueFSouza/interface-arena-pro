import { z } from 'zod'

export const newOrderSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    phone: z.string().min(14, 'Telefone inválido').max(15, 'Telefone inválido'),
})

export type NewOrderFormData = z.infer<typeof newOrderSchema> 