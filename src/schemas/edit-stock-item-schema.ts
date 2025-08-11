import { z } from "zod";

export const editStockItemSchema = z
  .object({
    name: z.string().min(3, {
      message: "O nome deve ter pelo menos 3 caracteres.",
    }),
    quantity: z.coerce
      .number()
      .min(0, {
        message: "O estoque não pode ser negativo.",
      })
      .optional(),
    totalPrice: z.coerce
      .number()
      .min(0, {
        message: "O valor gasto deve ser maior que zero.",
      })
      .optional(),
    expenseId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.quantity && !data.totalPrice) {
        return false;
      }
      return true;
    },
    {
      message: "O valor gasto deve ser informado.",
      path: ["totalPrice"],
    }
  )
  .refine(
    (data) => {
      if (!data.quantity && data.totalPrice) {
        return false;
      }
      return true;
    },
    {
      message: "A quantidade deve ser informada.",
      path: ["quantity"],
    }
  );

export type EditStockItemSchema = z.infer<typeof editStockItemSchema>;

export const editStockItemUnitPriceSchema = z.object({
  unitPrice: z.coerce.number().min(0, {
    message: "O valor unitário deve ser maior que zero.",
  }),
});

export type EditStockItemUnitPriceSchema = z.infer<
  typeof editStockItemUnitPriceSchema
>;
