"use client";

import { Bill, BillRecurrence } from "@/@types/bill";
import { ExpenseSelector } from "@/components/ExpenseSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBills } from "@/hooks/useBills";
import { createBillSchema, CreateBillSchema } from "@/schemas/bill-schema";
import { formatToBRLCurrency, removeNonNumeric } from "@/utils/formaters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface EditBillDialogProps {
  bill: Bill;
}

export function EditBillDialog({ bill }: EditBillDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateBill } = useBills();

  const form = useForm<CreateBillSchema>({
    resolver: zodResolver(createBillSchema),
    defaultValues: {
      name: bill.name,
      amount: Number(bill.amount) * 100,
      dueDate: bill.dueDate.split("T")[0],
      notes: bill.notes || "",
      recurrence: bill.recurrence,
      expenseId: bill.expenseId || undefined,
    },
  });

  async function onSubmit(values: CreateBillSchema) {
    try {
      await updateBill({
        id: bill.id,
        data: {
          name: values.name,
          amount: values.amount / 100,
          dueDate: values.dueDate,
          notes: values.notes,
          recurrence: values.recurrence,
          expenseId: values.expenseId,
        },
      });

      toast.success("Conta atualizada com sucesso!");
      setOpen(false);
    } catch {
      toast.error("Erro ao atualizar conta. Tente novamente.");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar conta</DialogTitle>
          <DialogDescription>
            Altere os dados da conta. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nome da conta</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Conta de luz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => {
                  const { onChange, value, ...rest } = field;
                  const formatedValue = formatToBRLCurrency(value);
                  return (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input
                          value={formatedValue}
                          onChange={(e) =>
                            onChange(removeNonNumeric(e.target.value))
                          }
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de vencimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recorrência</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || BillRecurrence.NONE}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BillRecurrence.NONE}>
                          Sem recorrência
                        </SelectItem>
                        <SelectItem value={BillRecurrence.WEEKLY}>
                          Semanal
                        </SelectItem>
                        <SelectItem value={BillRecurrence.MONTHLY}>
                          Mensal
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expenseId"
                render={({ field }) => (
                  <FormItem>
                    <ExpenseSelector
                      label="Categoria"
                      value={field.value}
                      onChange={(expense) => field.onChange(expense.id)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Observações sobre a conta..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
