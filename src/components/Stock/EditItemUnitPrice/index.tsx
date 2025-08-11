"use client";

import { StockItem } from "@/@types/stock";
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
  EditStockItemUnitPriceSchema,
  editStockItemUnitPriceSchema,
} from "@/schemas/edit-stock-item-schema";
import {
  formatToBRL,
  formatToBRLCurrency,
  removeNonNumeric,
} from "@/utils/formaters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface EditItemUnitPriceProps {
  item: StockItem;
}

export function EditItemUnitPrice({ item }: EditItemUnitPriceProps) {
  const [open, setOpen] = useState(false);
  const { updateUnitPrice, invalidateAndRefetch } = useStock();
  const { invalidateStockHistory } = useStockHistory();

  const form = useForm<EditStockItemUnitPriceSchema>({
    resolver: zodResolver(editStockItemUnitPriceSchema),
    mode: "onSubmit",
  });

  async function onSubmit(values: EditStockItemUnitPriceSchema) {
    const unitPrice = values.unitPrice / 100;
    updateUnitPrice(
      {
        id: item.id,
        data: {
          unitPrice,
          totalPrice: unitPrice * item.quantity,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          invalidateAndRefetch();
          invalidateStockHistory();
          toast.success("Preço unitário atualizado com sucesso!");
        },
        onError: () => {
          toast.error("Erro ao atualizar o preço unitário!");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar preço unitário</DialogTitle>
          <DialogDescription>
            Altere o preço unitário do item. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Preço unitário atual:{" "}
              <span className="font-bold">{formatToBRL(item.unitPrice)}</span>
            </p>

            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => {
                const { onChange, value, ...rest } = field;
                const formatedValue = formatToBRLCurrency(value);
                return (
                  <FormItem>
                    <FormLabel>Novo preço unitário (R$)</FormLabel>
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
