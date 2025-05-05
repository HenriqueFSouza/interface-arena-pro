import { Category } from '@/@types/category'
import { api } from '@/lib/api'

export const categoriesService = {
    async getAllCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/product-categories')
        return response.data
    },

    async getCategoryById(id: string): Promise<Category> {
        const response = await api.get<Category>(`/product-categories/${id}`)
        return response.data
    },

    async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
        const response = await api.post<Category>('/product-categories', data)
        return response.data
    },

    async updateCategory(id: string, name: string): Promise<Category> {
        const response = await api.put<Category>(`/product-categories/${id}`, { name })
        return response.data
    },

    async deleteCategory(id: string): Promise<void> {
        await api.delete(`/product-categories/${id}`)
    }
} 