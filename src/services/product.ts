import { Product } from "@/@types/product";
import { api } from "@/lib/api";

export const productService = {
    async getAllProducts(params?: { categoryId?: string; search?: string }): Promise<Product[]> {
        const response = await api.get<Product[]>('/products', { params })
        return response.data
    },

    async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
        const response = await api.post<Product>('/products', data)
        return response.data
    },

    async getProductById(id: string): Promise<Product> {
        const response = await api.get<Product>(`/products/${id}`)
        return response.data
    },

    async updateProduct(id: string, data: Omit<Product, 'id'>): Promise<Product> {
        const response = await api.put<Product>(`/products/${id}`, data)
        return response.data
    },

    async deleteProduct(id: string): Promise<void> {
        await api.delete(`/products/${id}`)
    }
}

