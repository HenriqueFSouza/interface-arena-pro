import { PaymentMethod } from "@/@types/payment";

type CashRegisterRegisteredPayment = {
    paymentMethod: PaymentMethod;
    amount: number;
}

export enum CashRegisterOriginType {
    PAYMENT = "PAYMENT",
    EXPENSE = "EXPENSE",
    INCREMENT = "INCREMENT",
}

export type CashRegisterTransaction = {
    id: string;
    cashRegisterId: string;
    originId: string | null;
    originType: CashRegisterOriginType;
    amount: number | null;
    reason: string | null;
    paymentMethod?: PaymentMethod;
    createdAt: string;
}

export interface CashRegister {
    id: string;
    openedAmount: number;
    expectedAmount: number;
    closedAmount: number | null;
    ownerId: string;
    registeredPayments: CashRegisterRegisteredPayment[];
    transactions: CashRegisterTransaction[];
    createdAt: string;
    closedAt: string | null;
}

export interface CashRegisterSales {
    id: string;
    orderId: string;
    clientName: string;
    payments: {
        id: string;
        paymentMethod: PaymentMethod;
        amount: string;
    }[];
    createdAt: string;
}
