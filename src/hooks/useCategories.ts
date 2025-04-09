import { categoriesService } from '@/services/product-categories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCategories = () => {
    const queryClient = useQueryClient()

    const {
        data: categories = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: categoriesService.getAllCategories,
        staleTime: 20,
    })

    const createCategory = useMutation({
        mutationFn: categoriesService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
    })

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
    }

    return {
        categories,
        isLoading,
        error,
        createCategory: createCategory.mutate,
        invalidateCategories
    }
} 