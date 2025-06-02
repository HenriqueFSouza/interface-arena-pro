import { z } from "zod";

export const newProductSchema = z.object({
    name: z.string().min(2, {
        message: "O nome do produto deve ter pelo menos 2 caracteres.",
    }),
    price: z.number(),
    categoryId: z.string().min(1, {
        message: "Selecione uma categoria.",
    }),
    imageUrl: z.string().optional().nullable(),
    stockProduct: z.array(z.object({
        stockId: z.string(),
        quantity: z.number(),
    })).optional(),
}).refine((data) => {
    if (data.stockProduct) {
        return data.stockProduct.every((stockProduct) => stockProduct.quantity > 0 && stockProduct.stockId);
    }
    return true;
}, {
    message: "Todos os itens de estoque devem ter uma quantidade maior que 0 e um item de estoque selecionado.",
    path: ["stockProduct"]
})

export type NewProductFormData = z.infer<typeof newProductSchema>
