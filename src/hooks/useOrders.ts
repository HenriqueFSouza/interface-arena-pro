'use client'

import { OrderItem } from "@/@types/order"
import { useCashRegister } from "@/hooks/useCashRegister"
import { useCashRegisterSales } from "@/hooks/useCashRegisterSales"
import { ordersService } from "@/services/orders"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { toast } from "react-hot-toast"

export const useOrders = () => {
    const queryClient = useQueryClient()
    const { invalidateCashRegister } = useCashRegister()
    const { invalidateCashRegisterSales } = useCashRegisterSales()

    const [search, setSearch] = useState('')

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

    const saveOrderItems = useMutation({
        mutationFn: (params: { orderId: string, items: Omit<OrderItem, 'id' | 'product'>[] }) =>
            ordersService.saveOrderItems(params.orderId, params.items),
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
            invalidateCashRegister()
            invalidateCashRegisterSales()
            toast.success('Comanda finalizada com sucesso')
        },
        onError: () => {
            toast.error('Erro ao finalizar comanda')
        }
    })

    const removeOrderItem = useMutation({
        mutationFn: (params: { orderId: string, itemId: string }) =>
            ordersService.removeOrderItem(params.orderId, params.itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            refetch()
            toast.success('Item removido do pedido')
        },
        onError: () => {
            toast.error('Erro ao remover item do pedido')
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

    const filteredOrders = data?.filter((order) =>
        order.clients[0].name.toLowerCase().includes(search.toLowerCase())
    )

    const openOrdersSubTotal = useMemo(() => data?.reduce((acc, order) => acc + order.items.reduce((acc, item) => acc + item.product?.price * item.quantity, 0), 0), [data])


    return {
        orders: filteredOrders ?? [],
        isLoading: isLoading || isFetching,
        isPending: createOrder.isPending || saveOrderItems.isPending || closeOrder.isPending || deleteOrder.isPending || removeOrderItem.isPending,
        search,
        error,
        openOrdersSubTotal: openOrdersSubTotal ?? 0,
        setSearch,
        createOrder: createOrder.mutate,
        saveOrderItems: saveOrderItems.mutate,
        closeOrder: closeOrder.mutate,
        deleteOrder: deleteOrder.mutate,
        removeOrderItem: removeOrderItem.mutate,
    }
}

