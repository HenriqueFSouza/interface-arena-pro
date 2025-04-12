'use client'

import { OrderItem } from "@/@types/order"
import { ordersService } from "@/services/orders"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

export const useOrders = () => {
    const queryClient = useQueryClient()

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: () => ordersService.getOrders(),
    })


    const createOrder = useMutation({
        mutationFn: ordersService.createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
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

    return {
        orders: data ?? [],
        isLoading,
        isPending: createOrder.isPending || addOrderItem.isPending,
        createOrder: createOrder.mutate,
        addOrderItem: addOrderItem.mutate,
        error,
    }
}

