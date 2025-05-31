import { stockService } from "@/services/stock"
import { useStockInventoryStore } from "@/stores/stock-inventory-store"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useStock } from "./useStock"
import { useStockHistory } from "./useStockHistory"

export function useStockInventory() {
    const {
        isInventoryMode,
        setIsInventoryMode,
        inventoryChanges,
        setItemQuantity,
        removeItemChange,
        getItemQuantity,
        hasChanges,
        clearChanges,
        resetInventory,
        getInventoryData
    } = useStockInventoryStore()

    const { invalidateAndRefetch: invalidateStock } = useStock()
    const { invalidateHistory } = useStockHistory()

    const updateInventory = useMutation({
        mutationFn: stockService.updateByInventory,
        onSuccess: () => {
            invalidateStock()
            invalidateHistory()
            resetInventory()
            toast.success('Inventário atualizado com sucesso!')
        },
        onError: () => {
            toast.error('Erro ao atualizar inventário!')
        }
    })

    const handleStartInventory = () => {
        clearChanges()
        setIsInventoryMode(true)
    }

    const handleCancelInventory = () => {
        resetInventory()
    }

    const handleSaveInventory = async () => {
        if (!hasChanges()) {
            toast.error('Nenhuma alteração para salvar')
            return
        }

        const inventoryData = getInventoryData()
        updateInventory.mutate({ items: inventoryData })
    }

    const isItemChanged = (itemId: string, originalQuantity: number) => {
        const currentQuantity = getItemQuantity(itemId)
        return currentQuantity !== undefined && currentQuantity !== originalQuantity
    }

    return {
        isInventoryMode,
        inventoryChanges,
        hasChanges: hasChanges(),
        isPending: updateInventory.isPending,
        setItemQuantity,
        removeItemChange,
        getItemQuantity,
        isItemChanged,
        handleStartInventory,
        handleCancelInventory,
        handleSaveInventory
    }
}