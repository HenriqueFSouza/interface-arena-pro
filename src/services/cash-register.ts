import { CashRegister, CashRegisterOriginType, CashRegisterSales } from "@/@types/cash-register";
import { PaymentMethod } from "@/@types/payment";
import { api } from "@/lib/api";

export interface AddTransactionRequest {
    originType: CashRegisterOriginType
    amount: number
    reason: string
    originId: string | null
}

export interface CloseCashRegisterRequest {
    registeredPayments: {
        paymentMethod: PaymentMethod
        amount: number
    }[]
}

export interface RegisterPaymentRequest {
    currentCashRegisterId: string
    registeredPayments: {
        paymentMethod: PaymentMethod
        amount: number
    }[]
}

export const cashRegisterService = {
    async getCashRegister(): Promise<CashRegister> {
        const response = await api.get('/cash-register/current');
        return response.data;
    },

    async openCashRegister(amount: number): Promise<CashRegister> {
        const response = await api.post('/cash-register/open', { amount });
        return response.data;
    },

    async registerPayments(data: RegisterPaymentRequest): Promise<CashRegister> {
        const response = await api.post(`/cash-register/register-payments/${data.currentCashRegisterId}`, data);
        return response.data;
    },

    async closeCashRegister(cashRegisterId: string): Promise<CashRegister> {
        const response = await api.post(`/cash-register/close/${cashRegisterId}`);
        return response.data;
    },

    async addTransaction(data: AddTransactionRequest): Promise<CashRegister> {
        const response = await api.post('/cash-register/transactions', data);
        return response.data;
    },

    async getCashRegisterReport(cashRegisterId: string): Promise<CashRegister> {
        const response = await api.get(`/cash-register/report/${cashRegisterId}`);
        return response.data;
    },

    async getSalesSummary(cashRegisterId: string): Promise<CashRegisterSales[]> {
        const response = await api.get(`/cash-register/sales/${cashRegisterId}`);
        return response.data;
    },
};

