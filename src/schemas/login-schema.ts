import * as z from "zod"

export const loginSchema = z.object({
  email: z.string()
    .min(1, "O email é obrigatório")
    .email("Digite um email válido"),
  password: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(50, "A senha deve ter no máximo 50 caracteres")
})

export type LoginFormData = z.infer<typeof loginSchema> 