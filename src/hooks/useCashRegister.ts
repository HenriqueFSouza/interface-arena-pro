import { cashRegisterService } from "@/services/cash-register"
import { useCashRegisterStore } from "@/stores/cash-register-store"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const CASH_REGISTER_QUERY_KEY = 'cash-register'

export function useCashRegister() {
    const queryClient = useQueryClient()
    const { setCurrentCashRegister, setIsOverlayOpen } = useCashRegisterStore()

    const { data: cashRegister = null, isLoading, refetch } = useQuery({
        queryKey: [CASH_REGISTER_QUERY_KEY],
        queryFn: cashRegisterService.getCashRegister
    })

    const isOpen = !!cashRegister && !cashRegister?.closedAt

    const openCashRegister = useMutation({
        mutationFn: cashRegisterService.openCashRegister,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CASH_REGISTER_QUERY_KEY] })
        }
    })

    const addTransaction = useMutation({
        mutationFn: cashRegisterService.addTransaction,
    })

    const invalidateCashRegister = () => {
        queryClient.invalidateQueries({ queryKey: [CASH_REGISTER_QUERY_KEY] })
        refetch().then((result) => {
            setCurrentCashRegister(result.data ?? null)
        })
    }

    const registerPayments = useMutation({
        mutationFn: cashRegisterService.registerPayments,
        onSuccess: () => {
            invalidateCashRegister()
        }
    })

    const closeCashRegister = useMutation({
        mutationFn: cashRegisterService.closeCashRegister,
        onSuccess: () => {
            setIsOverlayOpen(false)
            invalidateCashRegister()
        }
    })


    return {
        cashRegister,
        isLoading,
        isOpen,
        openCashRegister: openCashRegister.mutate,
        addTransaction: addTransaction.mutate,
        closeCashRegister: closeCashRegister.mutate,
        registerPayments: registerPayments.mutate,
        invalidateCashRegister,
    }
} 