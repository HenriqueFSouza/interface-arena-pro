import { Order, OrderItem } from '@/@types/order';
import { api } from '@/lib/api';
export interface CreateOrderRequest {
    clientInfo: {
        name: string;
        phone?: string;
    }
    items?: Array<{
        productId: string;
        quantity: number;
    }>
}

export const ordersService = {
    async createOrder(data: CreateOrderRequest): Promise<Order> {
        const response = await api.post('/orders', data)
        return response.data
    },

    async getOrders(): Promise<Order[]> {
        const response = await api.get('/orders')
        return response.data
    },

    async saveOrderItems(orderId: string, items: Omit<OrderItem, 'id' | 'product'>[]): Promise<OrderItem[]> {
        const response = await api.post(`/orders/${orderId}/items`, {
            items
        })
        return response.data
    },

    async closeOrder(orderId: string): Promise<void> {
        const response = await api.put(`/orders/${orderId}/close`)
        return response.data
    },

    async deleteOrder(orderId: string): Promise<void> {
        const response = await api.delete(`/orders/${orderId}`)
        return response.data
    },

    async removeOrderItem(orderId: string, itemId: string): Promise<void> {
        const response = await api.delete(`/orders/${orderId}/items/${itemId}`)
        return response.data
    }
} 
