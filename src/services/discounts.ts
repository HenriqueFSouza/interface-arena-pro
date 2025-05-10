import { api } from "@/lib/api";

export interface Discount {
    id: string;
    orderId: string;
    value: number;
    percentage: number;
    reason: string;
    createdAt: string;
}

export interface CreateDiscountRequest {
    value: number;
    percentage: number;
    reason: string;
}

export const discountService = {
    getOrderDiscounts: async (orderId: string) => {
        const response = await api.get<Discount[]>(`/discounts/order/${orderId}`);
        return response.data;
    },

    createDiscount: async (orderId: string, data: CreateDiscountRequest) => {
        const response = await api.post<Discount>(`/discounts/${orderId}`, data);
        return response.data;
    },

    deleteDiscount: async (discountId: string) => {
        await api.delete(`/discounts/${discountId}`);
    }
}; 