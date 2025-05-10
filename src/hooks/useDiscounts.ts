import { CreateDiscountRequest, discountService } from "@/services/discounts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDiscounts(orderId?: string) {
    const queryClient = useQueryClient();
    const queryKey = ['discounts', orderId];

    const {
        data: discounts = [],
        isLoading,
        refetch
    } = useQuery({
        queryKey,
        queryFn: () => orderId ? discountService.getOrderDiscounts(orderId) : Promise.resolve([]),
        enabled: !!orderId
    });

    const addDiscount = useMutation({
        mutationFn: (data: CreateDiscountRequest) => {
            if (!orderId) throw new Error('Order ID is required');
            return discountService.createDiscount(orderId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            refetch();
        }
    });

    const removeDiscount = useMutation({
        mutationFn: discountService.deleteDiscount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            refetch();
        }
    });

    return {
        discounts,
        isLoading,
        isAddingDiscount: addDiscount.isPending,
        isRemovingDiscount: removeDiscount.isPending,
        addDiscount: addDiscount.mutate,
        removeDiscount: removeDiscount.mutate,
        refetch,
    };
} 