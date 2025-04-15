'use client'

import { CreatePaymentRequest, paymentsService } from "@/services/payments"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

export const usePayments = (orderId?: string) => {
    const queryClient = useQueryClient()

    const {
        data: payments,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['orderPayments', orderId],
        queryFn: () => orderId ? paymentsService.getOrderPayments(orderId) : Promise.resolve([]),
        enabled: !!orderId,
    })

    const addPayment = useMutation({
        mutationFn: (data: CreatePaymentRequest) =>
            paymentsService.addPayment(orderId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderPayments', orderId] })
            toast.success('Pagamento adicionado com sucesso')
            refetch()
        },
        onError: () => {
            toast.error('Erro ao adicionar pagamento')
        }
    })

    const removePayment = useMutation({
        mutationFn: (paymentId: string) =>
            paymentsService.removePayment(paymentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderPayments', orderId] })
            toast.success('Pagamento removido com sucesso')
            refetch()
        },
        onError: () => {
            toast.error('Erro ao remover pagamento')
        }
    })

    return {
        payments: payments || [],
        isLoading,
        isPending: addPayment.isPending || removePayment.isPending,
        addPayment: addPayment.mutate,
        removePayment: removePayment.mutate,
        refetch
    }
} 