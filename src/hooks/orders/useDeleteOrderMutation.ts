import { Order } from "@/@types/order"
import { queryClient } from "@/providers/query-provider"
import { ordersService } from "@/services/orders"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { ORDER_QUERY_KEY } from "./useOrders"

export const useDeleteOrderMutation = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: ordersService.deleteOrder,
        onMutate: async (orderId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [ORDER_QUERY_KEY] })

            // Snapshot the previous value
            const previousOrders = queryClient.getQueryData<Order[]>([ORDER_QUERY_KEY])

            // Optimistically remove the order from the list
            queryClient.setQueryData([ORDER_QUERY_KEY], (old: Order[] = []) => {
                return old.filter((order) => order.id !== orderId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            })

            return { previousOrders, orderId }
        },
        onSuccess: (data, orderId, context) => {
            // The optimistic update should be sufficient
            // The order is already removed from the cache
            toast.success('Comanda excluída com sucesso')
        },
        onError: (error, variables, context) => {
            // Rollback to the previous value
            queryClient.setQueryData([ORDER_QUERY_KEY], context?.previousOrders)
            toast.error('Erro ao excluir comanda')
        }
    })

    return { deleteOrder: mutate, isPending }
} 