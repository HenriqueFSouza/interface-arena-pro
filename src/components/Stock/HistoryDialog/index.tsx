"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useStockHistory } from "@/hooks/useStockHistory"
import { getHistoryTypeLabel, getUnitMeasureLabel } from "@/utils"
import { formatDateTime, formatToBRL } from "@/utils/formaters"
import { History } from "lucide-react"
import { useState } from "react"
interface HistoryDialogProps {
    itemId: string
    itemName: string
}

export function HistoryDialog({ itemId, itemName }: HistoryDialogProps) {
    const [open, setOpen] = useState(false)
    const { history, isLoading } = useStockHistory(itemId, {
        enabled: !!itemId && open,
    })

    const getAmountRange = (initial: number, final: number) => {
        const amount = final - initial

        return amount > 0 ? `+ ${amount}` : `- ${amount.toString().replace("-", "")}`
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                >
                    <History className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Histórico de Movimentação - {itemName}</DialogTitle>
                </DialogHeader>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Saldo Inicial</TableHead>
                                <TableHead className="text-right">Variação</TableHead>
                                <TableHead className="text-right">Saldo Final</TableHead>
                                <TableHead className="text-right">Valor Unitário</TableHead>
                                <TableHead>Observação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24">
                                        <div className="flex items-center justify-center">
                                            <Spinner className="h-6 w-6" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {history.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                {formatDateTime(entry.createdAt)}
                                            </TableCell>
                                            <TableCell>{getHistoryTypeLabel(entry.type)}</TableCell>
                                            <TableCell className="text-right">{entry.initialQuantity} {getUnitMeasureLabel(entry.stock.unitMeasure)}</TableCell>
                                            <TableCell className="text-center">
                                                {getAmountRange(entry.initialQuantity, entry.finalQuantity)}
                                            </TableCell>
                                            <TableCell className="text-right">{entry.finalQuantity} {getUnitMeasureLabel(entry.stock.unitMeasure)}</TableCell>
                                            <TableCell className="text-right">{formatToBRL(entry.unitPrice) || "-"}</TableCell>
                                            <TableCell>{entry.description || "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                    {history.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                Nenhum histórico encontrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            Fechar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 