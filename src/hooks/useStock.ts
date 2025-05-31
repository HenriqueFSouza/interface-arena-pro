import { UpdateStockItemDTO } from "@/@types/stock"
import { stockService } from "@/services/stock"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

export const STOCK_QUERY_KEY = 'stock'

export function useStock() {
    const queryClient = useQueryClient()

    const { data: items = [], isLoading, refetch } = useQuery({
        queryKey: [STOCK_QUERY_KEY],
        queryFn: stockService.findAll,
    })

    const invalidateAndRefetch = () => {
        queryClient.invalidateQueries({ queryKey: [STOCK_QUERY_KEY] })
        refetch()
    }

    const createItem = useMutation({
        mutationFn: stockService.create,
        onSuccess: () => {
            invalidateAndRefetch()
        }
    })

    const updateItem = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: UpdateStockItemDTO }) => {
            return stockService.update(id, data)
        },
        onSuccess: () => {
            invalidateAndRefetch()
        }
    })

    const removeItem = useMutation({
        mutationFn: stockService.remove,
        onSuccess: () => {
            invalidateAndRefetch()
        }
    })

    const totalValue = useMemo(() => items.reduce((acc, item) => {
        const unitPrice = item.totalAmountSpent / item.totalQuantityPurchased
        const isPositiveQuantity = item.quantity > 0
        return acc + (isPositiveQuantity ? item.quantity * unitPrice : 0)
    }, 0), [items])

    return {
        items,
        totalValue,
        isLoading,
        createItem: createItem.mutate,
        updateItem: updateItem.mutate,
        removeItem: removeItem.mutate,
    }
} 