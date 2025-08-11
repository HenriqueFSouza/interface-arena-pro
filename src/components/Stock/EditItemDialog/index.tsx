"use client";

import { StockItem } from "@/@types/stock";
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
import { useStock } from "@/hooks/useStock";
import { useStockHistory } from "@/hooks/useStockHistory";
import {
  editStockItemSchema,
  EditStockItemSchema,
} from "@/schemas/edit-stock-item-schema";
import { formatToBRLCurrency, removeNonNumeric } from "@/utils/formaters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface EditItemDialogProps {
  item: StockItem;
}

export function EditItemDialog({ item }: EditItemDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateItem } = useStock();
  const { invalidateStockHistory } = useStockHistory();

  const defaultValues = {
    name: item.name,
    quantity: undefined,
    totalPrice: undefined,
    expenseId: item.expense?.id,
  };

  const form = useForm<EditStockItemSchema>({
    resolver: zodResolver(editStockItemSchema),
    mode: "onSubmit",
    defaultValues,
  });

  async function onSubmit(values: EditStockItemSchema) {
    updateItem(
      {
        id: item.id,
        data: {
          ...values,
          unitPrice:
            values.totalPrice && values.quantity
              ? values.totalPrice / 100 / values.quantity
              : undefined,
          totalPrice: values.totalPrice && values.totalPrice / 100,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          invalidateStockHistory();
          toast.success("Item atualizado com sucesso!");
        },
        onError: () => {
          toast.error("Erro ao atualizar o item!");
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset(defaultValues);
        } else {
          // When opening, ensure we have the latest item values
          form.reset(defaultValues);
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar item do estoque</DialogTitle>
          <DialogDescription>
            Altere os dados do item. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => {
                  const { onChange, value, ...rest } = field;
                  const formatedValue = formatToBRLCurrency(value);
                  return (
                    <FormItem>
                      <FormLabel>Valor Gasto (R$)</FormLabel>
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

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="expenseId"
                  render={({ field }) => (
                    <FormItem>
                      <ExpenseSelector
                        label="Despesa (Opcional)"
                        value={field.value}
                        onChange={(expense) => field.onChange(expense.id)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
