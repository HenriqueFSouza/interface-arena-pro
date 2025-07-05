import { cashRegisterService, UpdatePaymentMethodsRequest } from "@/services/cash-register";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCashRegister } from "./useCashRegister";

const QUERY_KEY = 'cash-register-sales'

export function useCashRegisterSales(cashRegisterId?: string) {
    const queryClient = useQueryClient()
    const { invalidateCashRegister } = useCashRegister()

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => cashRegisterService.getSalesSummary(cashRegisterId!),
        enabled: !!cashRegisterId,
    })

    const invalidateCashRegisterSales = () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        refetch()
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

