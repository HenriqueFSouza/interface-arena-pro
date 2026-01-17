import { BillRecurrence } from "@/@types/bill";
import { z } from "zod";

export const createBillSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  amount: z.coerce.number().min(0.01, {
    message: "O valor deve ser maior que zero.",
  }),
  dueDate: z.string().min(1, {
    message: "Selecione uma data de vencimento.",
  }),
  notes: z.string().optional(),
  recurrence: z
    .enum([BillRecurrence.NONE, BillRecurrence.WEEKLY, BillRecurrence.MONTHLY])
    .optional(),
  expenseId: z.string().optional(),
});

export type CreateBillSchema = z.infer<typeof createBillSchema>;

export const updateBillSchema = createBillSchema.partial();

export type UpdateBillSchema = z.infer<typeof updateBillSchema>;
