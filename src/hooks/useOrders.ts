'use client'

import { OrderItem } from "@/@types/order"
import { ordersService } from "@/services/orders"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

export const useOrders = () => {
    const queryClient = useQueryClient()

    const { data, isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: () => ordersService.getOrders(),
    })

    const createOrder = useMutation({
        mutationFn: ordersService.createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            refetch()
            toast.success('Comanda criada com sucesso')
        },
        onError: () => {
            toast.error('Erro ao criar comanda')
        }
    })

    const addOrderItem = useMutation({
        mutationFn: (params: { orderId: string, items: Omit<OrderItem, 'id' | 'product'>[] }) =>
            ordersService.addOrderItem(params.orderId, params.items),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            refetch()
            toast.success('Item adicionado ao pedido')
        },
        onError: () => {
            toast.error('Erro ao adicionar item ao pedido')
        }
    })

    const closeOrder = useMutation({
        mutationFn: ordersService.closeOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            refetch()
            toast.success('Comanda finalizada com sucesso')
        },
        onError: () => {
            toast.error('Erro ao finalizar comanda')
        }
    })

    const deleteOrder = useMutation({
        mutationFn: ordersService.deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            refetch()
            toast.success('Comanda excluída com sucesso')
        },
        onError: () => {
            toast.error('Erro ao excluir comanda')
        }
    })

    return {
        orders: data ?? [],
        isLoading: isLoading || isFetching,
        isPending: createOrder.isPending || addOrderItem.isPending || closeOrder.isPending || deleteOrder.isPending,
        createOrder: createOrder.mutate,
        addOrderItem: addOrderItem.mutate,
        closeOrder: closeOrder.mutate,
        deleteOrder: deleteOrder.mutate,
        error,
    }
}

