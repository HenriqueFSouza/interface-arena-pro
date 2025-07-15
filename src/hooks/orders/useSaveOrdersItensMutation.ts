import { Order, OrderItem } from "@/@types/order"
import { queryClient } from "@/providers/query-provider"
import { ordersService } from "@/services/orders"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { ORDER_QUERY_KEY } from "./useOrders"

export const useSaveOrdersItensMutation = () => {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (params: { orderId: string, items: Omit<OrderItem, 'id' | 'product'>[] }) =>
            ordersService.saveOrderItems(params.orderId, params.items),
        onMutate: (variables) => {
            const { orderId, items } = variables
            const previousItems = queryClient.getQueryData<Order[]>([ORDER_QUERY_KEY])
            const updatedOrders = previousItems?.map((order) => order.id === orderId ? { ...order, items } : order)

            queryClient.setQueryData([ORDER_QUERY_KEY], updatedOrders?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

            return { updatedOrders, previousItems, orderId }

        },
        onSuccess: (data, _variables, context) => {
            queryClient.setQueryData([ORDER_QUERY_KEY], (old: Order[]) => {
                return old.map((order) => order.id === context?.orderId ? data : order)
            })
            toast.success('Item adicionado ao pedido')
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData([ORDER_QUERY_KEY], context?.previousItems)
            toast.error('Erro ao adicionar item ao pedido')
        }
    })

    return { saveOrderItems: mutateAsync, isPending }
}
