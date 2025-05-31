import { StockHistoryEntry } from "@/@types/stock"
import { stockService } from "@/services/stock"
import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"

export const STOCK_HISTORY_QUERY_KEY = 'stock-history'

export function useStockHistory(stockId: string, options?: Partial<UseQueryOptions<StockHistoryEntry[]>>) {
    const queryClient = useQueryClient()

    const { data: history = [], isLoading, refetch } = useQuery<StockHistoryEntry[]>({
        queryKey: [STOCK_HISTORY_QUERY_KEY, stockId],
        queryFn: () => stockService.getHistory(stockId),
        enabled: !!stockId,
        ...options,
    })

    const invalidateStockHistory = () => {
        queryClient.invalidateQueries({ queryKey: [STOCK_HISTORY_QUERY_KEY, stockId] })
        refetch()
    }

    return {
        history,
        isLoading,
        invalidateStockHistory,
    }
} 