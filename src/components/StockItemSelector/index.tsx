import { Button } from "@/components/ui/button";
import { useStock } from "@/hooks/useStock";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { StockItemRow, StockItemRowData } from "./StockItemRow";

type StockItemSelectorProps = {
    value?: { stockId: string, quantity: number }[]
    onChange: (value: { stockId: string, quantity: number }[]) => void
}

export function StockItemSelector({ value = [], onChange }: StockItemSelectorProps) {
    const { items, isLoading } = useStock();

    const rowsData = useMemo(() => value, [value]);

    const handleAddRow = () => {
        onChange([...value, { stockId: '', quantity: 0 }]);
    }

    const handleRemoveRow = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    }

    const handleRowChange = (index: number, data: StockItemRowData) => {
        const newRowsData = [...rowsData];
        newRowsData[index] = data;
        onChange(newRowsData);
    }

    return (
        <div className="space-y-4">

            <div className="space-y-3">
                {rowsData.map((rowData, index) => (
                    <StockItemRow
                        key={index}
                        data={rowData}
                        stockOptions={items}
                        isLoading={isLoading}
                        onChange={(data) => handleRowChange(index, data)}
                        onRemove={() => handleRemoveRow(index)}
                    />
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-gray-300 border-2"
                onClick={handleAddRow}
                disabled={isLoading}
            >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item do Estoque
            </Button>
        </div>
    );
}

