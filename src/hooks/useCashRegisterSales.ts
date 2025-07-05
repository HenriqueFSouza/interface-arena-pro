import { queryClient } from "@/providers/query-provider";
import { cashRegisterService, UpdatePaymentMethodsRequest } from "@/services/cash-register";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCashRegister } from "./useCashRegister";

const QUERY_KEY = 'cash-register-sales'

export function useCashRegisterSales(cashRegisterId?: string) {
    const { invalidateCashRegister } = useCashRegister()

    const { data, isLoading, error } = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => cashRegisterService.getSalesSummary(cashRegisterId!),
        enabled: !!cashRegisterId,
        refetchOnWindowFocus: true
    })

    const invalidateCashRegisterSales = () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    }

    const updatePaymentsMutation = useMutation({
        mutationFn: async (data: UpdatePaymentMethodsRequest) => {
            await cashRegisterService.updatePaymentMethods(data)
        },
        onSuccess: () => {
            toast.success('Venda atualizada com sucesso!')
            invalidateCashRegisterSales()
            invalidateCashRegister()
        },
        onError: () => {
            toast.error('Erro ao atualizar a venda')
        }
    })

    return {
        cashRegisterSales: data,
        isLoading,
        error,
        invalidateCashRegisterSales,
        updatePaymentsMutation: updatePaymentsMutation.mutateAsync
    }
}

