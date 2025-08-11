"use client";

import { UnitMeasure } from "@/@types/stock";
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
import { useStock } from "@/hooks/useStock";
import {
  createStockItemSchema,
  CreateStockItemSchema,
} from "@/schemas/create-stock-item-schema";
import { formatToBRLCurrency, removeNonNumeric } from "@/utils/formaters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export function NewItemDialog() {
  const [open, setOpen] = useState(false);

  const { createItem } = useStock();

  const form = useForm<CreateStockItemSchema>({
    resolver: zodResolver(createStockItemSchema),
    defaultValues: {
      name: "",
      unitMeasure: undefined,
      quantity: 0,
      totalPrice: 0,
      expenseId: undefined,
    },
  });

  async function onSubmit(values: CreateStockItemSchema) {
    await createItem(
      {
        name: values.name,
        unitMeasure: values.unitMeasure,
        quantity: values.quantity,
        totalPrice: values.totalPrice / 100,
        expenseId: values.expenseId,
        unitPrice: values.totalPrice / 100 / values.quantity,
      },
      {
        onSuccess: () => {
          toast.success("Item adicionado com sucesso!");
          form.reset();
          setOpen(false);
        },
        onError: () => {
          toast.error("Erro ao adicionar item. Tente novamente.");
        },
      }
    );
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo item ao estoque</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo item. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <FormField
                control={form.control}
                name="unitMeasure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade de Medida</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UnitMeasure.UNIT}>
                          Unidade
                        </SelectItem>
                        <SelectItem value={UnitMeasure.KILOGRAM}>
                          Quilo
                        </SelectItem>
                        <SelectItem value={UnitMeasure.LITER}>Litro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque Atual</FormLabel>
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
                        label="Despesa"
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
