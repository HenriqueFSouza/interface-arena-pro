import { api } from '@/lib/api';

export type PaymentMethod = "CASH" | "CARD" | "PIX";

export interface Payment {
    id: string;
    orderId: string;
    method: PaymentMethod;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePaymentRequest {
    method: PaymentMethod;
    amount: number;
    orderClientId: string;
}

export const paymentsService = {
    async getOrderPayments(orderId: string): Promise<Payment[]> {
        const response = await api.get(`/payments/${orderId}`);
        return response.data;
    },

    async addPayment(orderId: string, data: CreatePaymentRequest): Promise<Payment> {
        const response = await api.post(`/payments/${orderId}`, data);
        return response.data;
    },

    async removePayment(paymentId: string): Promise<void> {
        await api.delete(`/payments/${paymentId}`);
    },
};
