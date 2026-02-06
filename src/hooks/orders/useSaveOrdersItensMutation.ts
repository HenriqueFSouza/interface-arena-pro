import { Order, OrderItem } from "@/@types/order";
import { queryClient } from "@/providers/query-provider";
import { ordersService } from "@/services/orders";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ORDER_QUERY_KEY } from "./useOrders";

export const useSaveOrdersItensMutation = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (params: {
      orderId: string;
      items: Omit<OrderItem, "id" | "product">[];
      itemsWithProduct?: OrderItem[]; // Full items for optimistic update
    }) => ordersService.saveOrderItems(params.orderId, params.items),
    onMutate: async (variables) => {
      const { orderId, items, itemsWithProduct } = variables;

      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: [ORDER_QUERY_KEY] });

      // Get previous state for rollback
      const previousOrders = queryClient.getQueryData<Order[]>([
        ORDER_QUERY_KEY,
      ]);

      // Optimistic update - merge items intelligently
      queryClient.setQueryData<Order[]>([ORDER_QUERY_KEY], (old) => {
        return old?.map((order) => {
          if (order.id !== orderId) return order;

          // Create a map of existing items for fast lookup
          const itemsMap = new Map(order.items.map((i) => [i.productId, i]));

          // Update existing items or add new items with temporary IDs
          items.forEach((item, index) => {
            const existing = itemsMap.get(item.productId);
            if (existing) {
              // Update existing item (optimistic)
              itemsMap.set(item.productId, {
                ...existing,
                quantity: item.quantity,
                orderClientId: item.orderClientId || existing.orderClientId,
              });
            } else if (itemsWithProduct) {
              // Add new item with product data from cart (temporary)
              const fullItem = itemsWithProduct.find(
                (i) => i.productId === item.productId
              );
              if (fullItem) {
                itemsMap.set(item.productId, {
                  ...fullItem,
                  id: `temp-${item.productId}`, // Temporary ID
                  quantity: item.quantity,
                  orderClientId: item.orderClientId!,
                });
              }
            }
          });

          return {
            ...order,
            items: Array.from(itemsMap.values()),
            updatedAt: new Date().toISOString(),
          };
        });
      });

      return { previousOrders };
    },
    onSuccess: (response, variables) => {
      const { orderId } = variables;
      const { newItems } = response;

      // Merge newly created items from server (with real IDs)
      // Updated items are already correct via optimistic update
      if (newItems.length > 0) {
        queryClient.setQueryData<Order[]>([ORDER_QUERY_KEY], (old) => {
          return old?.map((order) => {
            if (order.id !== orderId) return order;

            // Create map of current items
            const itemsMap = new Map(order.items.map((i) => [i.productId, i]));

            // Replace temporary items with real server items
            newItems.forEach((newItem) => {
              itemsMap.set(newItem.productId, newItem);
            });

            return {
              ...order,
              items: Array.from(itemsMap.values()),
              updatedAt: new Date().toISOString(),
            };
          });
        });
      }

      // No invalidation needed - optimistic + merge is sufficient
      toast.success("Item adicionado ao pedido");
    },
    onError: (_error, _variables, context) => {
      // Rollback to previous state on error
      if (context?.previousOrders) {
        queryClient.setQueryData([ORDER_QUERY_KEY], context.previousOrders);
      }
      toast.error("Erro ao adicionar item ao pedido");
    },
  });

  return { saveOrderItems: mutateAsync, isPending };
};
