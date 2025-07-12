import { Order, OrderStatus } from "@/@types/order"
import { queryClient } from "@/providers/query-provider"
import { ordersService } from "@/services/orders"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { ORDER_QUERY_KEY } from "./useOrders"

export const useCreateOrderMutation = () => {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ordersService.createOrder,
        onMutate: async (newOrder) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [ORDER_QUERY_KEY] })

            // Snapshot the previous value
            const previousOrders = queryClient.getQueryData<Order[]>([ORDER_QUERY_KEY])

            // Optimistically update to the new value
            const optimisticOrder: Order = {
                id: `temp-${Date.now()}`, // Temporary ID
                status: OrderStatus.OPEN,
                note: null,
                ownerId: '', // Will be set by the server
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                clients: [{
                    id: `temp-client-${Date.now()}`,
                    name: newOrder.clientInfo.name,
                    phone: newOrder.clientInfo.phone || '',
                    orderId: `temp-${Date.now()}`,
                    note: null,
                    clientId: `temp-client-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }],
                items: []
            }

            queryClient.setQueryData([ORDER_QUERY_KEY], (old: Order[] = []) => [
                ...old,
                optimisticOrder
            ])

            return { previousOrders, optimisticOrder }
        },
        onSuccess: (data, _variables, context) => {
            // Replace the optimistic order with the real one
            queryClient.setQueryData([ORDER_QUERY_KEY], (old: Order[] = []) => {
                return old.map((order) =>
                    order.id === context?.optimisticOrder.id ? data : order
                )
            })
            toast.success('Comanda criada com sucesso')
        },
        onError: (error, variables, context) => {
            // Rollback to the previous value
            queryClient.setQueryData([ORDER_QUERY_KEY], context?.previousOrders)
            toast.error('Erro ao criar comanda')
        }
    })

    return { createOrder: mutateAsync, isPending }
} 