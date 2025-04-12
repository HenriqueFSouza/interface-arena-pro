import { Product } from '@/@types/product';
import { productService } from '@/services/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCategories } from './useCategories';

interface UseProductsOptions {
    categoryId?: string | null;
    search?: string;
}

export const useProducts = (options: UseProductsOptions = {}) => {
    const queryClient = useQueryClient()
    const { categories } = useCategories()
    const { categoryId, search } = options

    const params: { categoryId?: string; search?: string } = {}
    if (categoryId) params.categoryId = categoryId
    if (search) params.search = search

    const queryKey = ['products', params]

    const {
        data: products = [],
        isLoading,
        error,
    } = useQuery({
        queryKey,
        queryFn: async () => {
            const addParams = Object.keys(params).length > 0 ? params : undefined
            return await productService.getAllProducts(addParams)
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: categories.length > 0
    })

    const createProduct = useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
        }
    })

    const updateProduct = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Omit<Product, 'id'> }) =>
            productService.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
        }
    })

    const deleteProduct = useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
        }
    })

    const invalidateProducts = () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['categories-with-products'] })
    }

    return {
        products,
        isLoading,
        error,
        createProduct: createProduct.mutate,
        updateProduct: updateProduct.mutate,
        deleteProduct: deleteProduct.mutate,
        invalidateProducts
    }
} 