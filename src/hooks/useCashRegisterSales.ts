import { cashRegisterService } from "@/services/cash-register";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = 'cash-register-sales'

export function useCashRegisterSales(cashRegisterId?: string) {
    const queryClient = useQueryClient()

    const { data, isLoading, error, isStale, refetch } = useQuery({
        queryKey: [QUERY_KEY, cashRegisterId],
        queryFn: () => cashRegisterService.getSalesSummary(cashRegisterId!),
        enabled: !!cashRegisterId
    })

    const invalidateCashRegisterSales = () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY, cashRegisterId] })
    }

    return {
        cashRegisterSales: data,
        isLoading,
        error,
        isStale,
        refetch,
        invalidateCashRegisterSales
    }
}

