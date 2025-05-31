import { Button } from "@/components/ui/button"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useCallback } from "react"

export type StockItemRowData = {
    stockId: string
    quantity: number
}

type StockItemRowProps = {
    data: StockItemRowData
    stockOptions: ComboboxOption[]
    isLoading?: boolean
    onChange: (data: StockItemRowData) => void
    onRemove: () => void
}

export function StockItemRow({
    data,
    stockOptions,
    isLoading = false,
    onChange,
    onRemove
}: StockItemRowProps) {
    const handleStockChange = useCallback((option: { id: string, name: string }) => {
        onChange({
            stockId: option.id,
            quantity: data.quantity
        })
    }, [data, onChange])

    const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = Number(e.target.value)
        onChange({
            stockId: data.stockId,
            quantity
        })
    }, [data, onChange])


    return (
        <div className="flex items-end gap-3">
            <div className="flex-1">
                <Combobox
                    value={data.stockId}
                    label="Item de Estoque"
                    placeholder="Selecione um item do estoque..."
                    searchPlaceholder="Digite o nome do item..."
                    emptyMessage="Nenhum item encontrado"
                    options={stockOptions}
                    isLoading={isLoading}
                    onChange={handleStockChange}
                />
            </div>

            <div className="w-32">
                <Input
                    label="Quantidade"
                    placeholder="0"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={data.quantity}
                    onChange={handleQuantityChange}
                    disabled={!data.stockId}
                />
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 w-10 h-10"
                onClick={onRemove}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
} 