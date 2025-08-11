"use client";

import { StockItem } from "@/@types/stock";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStockInventory } from "@/hooks/useStockInventory";
import { cn } from "@/lib/utils";
import { getUnitMeasureLabel } from "@/utils";
import { formatToBRL } from "@/utils/formaters";
import { History } from "lucide-react";
import { useState } from "react";
import { DeleteItemDialog } from "../DeleteItemDialog";
import { EditItemDialog } from "../EditItemDialog";
import { EditItemUnitPrice } from "../EditItemUnitPrice";
import { HistoryDialog } from "../HistoryDialog";
import { QuantityInput } from "../QuantityInput";

interface StockTableProps {
  items: StockItem[];
}

export function StockTable({ items }: StockTableProps) {
  const { isInventoryMode, isPending } = useStockInventory();
  const [historyDialog, setHistoryDialog] = useState<{
    itemId: string;
    itemName: string;
  } | null>(null);

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria de Despesa</TableHead>
              <TableHead>Quantidade Atual</TableHead>
              <TableHead>Valor Unitário</TableHead>
              <TableHead>Valor em Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const isPositiveQuantity = item.quantity > 0;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.expense?.name || "-"}</TableCell>
                  <TableCell>
                    {isInventoryMode ? (
                      <div className="flex items-center gap-2">
                        <QuantityInput
                          itemId={item.id}
                          initialQuantity={item.quantity}
                          disabled={isPending}
                        />
                        <span className="text-sm text-muted-foreground">
                          {getUnitMeasureLabel(item.unitMeasure)}
                        </span>
                      </div>
                    ) : (
                      <span
                        className={cn(
                          "font-medium",
                          !isPositiveQuantity && "text-orange-500"
                        )}
                      >
                        {item.quantity} {getUnitMeasureLabel(item.unitMeasure)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatToBRL(item.unitPrice)}
                    <EditItemUnitPrice item={item} />
                  </TableCell>
                  <TableCell>
                    {isPositiveQuantity
                      ? formatToBRL(item.quantity * item.unitPrice)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {!isInventoryMode && (
                        <>
                          <EditItemDialog item={item} />

                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            onClick={() =>
                              setHistoryDialog({
                                itemId: item.id,
                                itemName: item.name,
                              })
                            }
                          >
                            <History className="h-4 w-4" />
                          </Button>

                          <DeleteItemDialog
                            itemId={item.id}
                            itemName={item.name}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog global - só um na tabela */}
      {historyDialog && (
        <HistoryDialog
          itemId={historyDialog.itemId}
          itemName={historyDialog.itemName}
          open={!!historyDialog}
          onOpenChange={(open) => !open && setHistoryDialog(null)}
        />
      )}
    </>
  );
}
