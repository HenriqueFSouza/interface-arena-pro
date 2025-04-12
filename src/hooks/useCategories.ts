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
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const createCategory = useMutation({
        mutationFn: categoriesService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
        }
    })

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
    }

    return {
        categories,
        isLoading,
        error,
        createCategory: createCategory.mutate,
        invalidateCategories
    }
}

export const useCategoryProducts = () => {
    const queryClient = useQueryClient()

    const {
        data: categories = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['categories-with-products'],
        queryFn: categoriesService.getAllCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const createCategory = useMutation({
        mutationFn: categoriesService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
    })

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
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