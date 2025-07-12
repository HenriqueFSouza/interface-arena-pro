import { Order } from "@/@types/order"
import { queryClient } from "@/providers/query-provider"
import { ordersService } from "@/services/orders"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { ORDER_QUERY_KEY } from "./useOrders"

export const useCloseOrderMutation = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: ordersService.closeOrder,
        onMutate: async (orderId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [ORDER_QUERY_KEY] })

            // Snapshot the previous value
            const previousOrders = queryClient.getQueryData<Order[]>([ORDER_QUERY_KEY])

            // Optimistically update the order status
            queryClient.setQueryData([ORDER_QUERY_KEY], (old: Order[] = []) => {
                return old.filter((order) => order.id !== orderId)
            })

            return { previousOrders, orderId }
        },
        onSuccess: () => {
            // Invalidate cash register sales to update the cash register
            queryClient.invalidateQueries({ queryKey: ['cash-register-sales'] })
            queryClient.invalidateQueries({ queryKey: ['cash-register'] })

            toast.success('Comanda finalizada com sucesso')
        },
        onError: (error, variables, context) => {
            // Rollback to the previous value
            queryClient.setQueryData([ORDER_QUERY_KEY], context?.previousOrders)
            toast.error('Erro ao finalizar comanda')
        }
    })

    return { closeOrder: mutate, isPending }
} 