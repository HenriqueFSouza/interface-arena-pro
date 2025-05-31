import { stockService } from "@/services/stock"
import { useStockInventoryStore } from "@/stores/stock-inventory-store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { STOCK_QUERY_KEY } from "./useStock"
import { STOCK_HISTORY_QUERY_KEY } from "./useStockHistory"

export function useStockInventory() {
    const queryClient = useQueryClient()
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

    const updateInventory = useMutation({
        mutationFn: stockService.updateByInventory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STOCK_QUERY_KEY, STOCK_HISTORY_QUERY_KEY] })
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