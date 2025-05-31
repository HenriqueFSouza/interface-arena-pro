"use client"

import { StockItem } from "@/@types/stock"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useStockInventory } from "@/hooks/useStockInventory"
import { cn } from "@/lib/utils"
import { getUnitMeasureLabel } from "@/utils"
import { formatToBRL } from "@/utils/formaters"
import { DeleteItemDialog } from "../DeleteItemDialog"
import { EditItemDialog } from "../EditItemDialog"
import { HistoryDialog } from "../HistoryDialog"
import { QuantityInput } from "../QuantityInput"

interface StockTableProps {
    items: StockItem[]
}

export function StockTable({ items }: StockTableProps) {
    const { isInventoryMode, isPending } = useStockInventory()

    return (
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
                        const unitPrice = item.totalAmountSpent / item.totalQuantityPurchased
                        const isPositiveQuantity = item.quantity > 0
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
                                        <span className={cn(
                                            "font-medium",
                                            !isPositiveQuantity && "text-orange-500"
                                        )}>
                                            {item.quantity} {getUnitMeasureLabel(item.unitMeasure)}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {formatToBRL(unitPrice)}
                                </TableCell>
                                <TableCell>
                                    {isPositiveQuantity ? formatToBRL(item.quantity * unitPrice) : "N/A"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-1">
                                        {!isInventoryMode && (
                                            <>
                                                <EditItemDialog
                                                    item={item}
                                                />

                                                <HistoryDialog
                                                    itemId={item.id}
                                                    itemName={item.name}
                                                />

                                                <DeleteItemDialog
                                                    itemId={item.id}
                                                    itemName={item.name}
                                                />
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
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
    )
}
