import { Product } from "@/@types/product"
import { api } from "@/lib/api"

export const productService = {
    async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
        const response = await api.post<Product>('/products', data)
        return response.data
    }
}

