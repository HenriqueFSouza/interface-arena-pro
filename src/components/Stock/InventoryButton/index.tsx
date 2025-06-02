"use client"

import { Button } from "@/components/ui/button"
import { useStock } from "@/hooks/useStock"
import { useStockInventory } from "@/hooks/useStockInventory"
import { ClipboardList, Loader2, Save, X } from "lucide-react"

export function InventoryButton() {
    const {
        isInventoryMode,
        hasChanges,
        isPending,
        handleStartInventory,
        handleCancelInventory,
        handleSaveInventory
    } = useStockInventory()

    const { items, isLoading: isStockLoading } = useStock()

    const isEnabled = items.length > 0 && !isStockLoading

    if (isInventoryMode) {
        return (
            <div className="flex gap-2">
                <Button
                    onClick={handleSaveInventory}
                    disabled={!hasChanges || isPending || !isEnabled}
                    className="flex items-center gap-2 bg-blue-500 animate-pulse hover:bg-blue-600"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Salvar Inventário
                </Button>

                <Button
                    variant="outline"
                    onClick={handleCancelInventory}
                    disabled={isPending}
                    className="flex items-center gap-2"
                >
                    <X className="h-4 w-4" />
                    Cancelar
                </Button>
            </div>
        )
    }

    return (
        <Button
            onClick={handleStartInventory}
            disabled={!isEnabled}
            variant="outline"
            className="flex items-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        >
            <ClipboardList className="h-4 w-4" />
            Realizar Inventário
        </Button>
    )
} 