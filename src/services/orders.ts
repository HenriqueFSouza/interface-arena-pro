import { Order, OrderItem } from '@/@types/order';
import { api } from '@/lib/api';
export interface CreateOrderRequest {
    clientInfo: {
        name: string;
        phone: string;
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

    async addOrderItem(orderId: string, items: Omit<OrderItem, 'id' | 'product'>[]): Promise<OrderItem[]> {
        const response = await api.post(`/orders/${orderId}/items`, {
            items
        })
        return response.data
    }
} 