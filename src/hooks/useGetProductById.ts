import { productService } from "@/services/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const getProductByIdQueryKey = ['product']

export function useGetProductById(id?: string) {
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: [...getProductByIdQueryKey, id],
        queryFn: () => productService.getProductById(id ?? ''),
        enabled: !!id
    })

    const invalidate = useCallback((id: string) => {
        queryClient.invalidateQueries({ queryKey: [...getProductByIdQueryKey, id] })
    }, [queryClient])

    return { data, isLoading, error, invalidate }
}
