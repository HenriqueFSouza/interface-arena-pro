import { z } from "zod";

export const newProductSchema = z.object({
    name: z.string().min(2, {
        message: "O nome do produto deve ter pelo menos 2 caracteres.",
    }),
    price: z.number(),
    categoryId: z.string().min(1, {
        message: "Selecione uma categoria.",
    }),
    image: z.string().optional(),
})