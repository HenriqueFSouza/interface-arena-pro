import { UnitMeasure } from "@/@types/stock";
import { z } from "zod";

export const createStockItemSchema = z.object({
    name: z.string().min(3, {
        message: "O nome deve ter pelo menos 3 caracteres.",
    }),
    unitMeasure: z.enum([UnitMeasure.UNIT, UnitMeasure.KILOGRAM, UnitMeasure.LITER], {
        required_error: "Selecione uma unidade de medida.",
    }),
    quantity: z.coerce.number().min(0, {
        message: "O estoque não pode ser negativo.",
    }),
    totalPrice: z.coerce.number().min(0.01, {
        message: "O valor gasto deve ser maior que zero.",
    }),
    expenseId: z.string().optional(),
})

export type CreateStockItemSchema = z.infer<typeof createStockItemSchema>
