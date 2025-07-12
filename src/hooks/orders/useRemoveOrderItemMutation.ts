import { Order } from "@/@types/order"
import { queryClient } from "@/providers/query-provider"
import { ordersService } from "@/services/orders"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { ORDER_QUERY_KEY } from "./useOrders"

export const useRemoveOrderItemMutation = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: (params: { orderId: string, itemId: string }) =>
            ordersService.removeOrderItem(params.orderId, params.itemId),
        onMutate: async (params) => {
            const { orderId, itemId } = params

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [ORDER_QUERY_KEY] })

            const previousOrders = queryClient.getQueryData<Order[]>([ORDER_QUERY_KEY])

            queryClient.setQueryData([ORDER_QUERY_KEY], (old: Order[] = []) => {
                return old.map((order) =>
                    order.id === orderId
                        ? {
                            ...order,
                            items: order.items.filter((item) => item.id !== itemId),
                            updatedAt: new Date().toISOString()
                        }
                        : order
                )
            })

            return { previousOrders, orderId, itemId }
        },
        onSuccess: () => {
            toast.success('Item removido do pedido')
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData([ORDER_QUERY_KEY], context?.previousOrders)
            toast.error('Erro ao remover item do pedido')
        }
    })

    return { removeOrderItem: mutate, isPending }
} 