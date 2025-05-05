import { categoriesService } from '@/services/product-categories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCategories = () => {
    const queryClient = useQueryClient()

    const {
        data: categories = [],
        isLoading,
        error,
        refetch,
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

    const updateCategory = useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            categoriesService.updateCategory(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
        }
    })

    const deleteCategory = useMutation({
        mutationFn: (id: string) => categoriesService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
        }
    })

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
        refetch()
    }

    return {
        categories,
        isLoading,
        error,
        createCategory: createCategory.mutate,
        updateCategory: updateCategory.mutate,
        deleteCategory: deleteCategory.mutate,
        invalidateCategories
    }
}

export const useCategoryProducts = () => {
    const queryClient = useQueryClient()

    const {
        data: categories = [],
        isLoading,
        isRefetching,
        error,
        refetch,
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

    const updateCategory = useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            categoriesService.updateCategory(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
    })

    const deleteCategory = useMutation({
        mutationFn: (id: string) => categoriesService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
    })

    const invalidateCategories = () => {
        queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        refetch()
    }

    return {
        categories,
        isLoading: isLoading || isRefetching,
        error,
        createCategory: createCategory.mutate,
        updateCategory: updateCategory.mutate,
        deleteCategory: deleteCategory.mutate,
        invalidateCategories
    }
} 