export enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    PIX = "PIX"
}

export interface Payment {
    id: string;
    orderId: string;
    method: PaymentMethod;
    amount: number;
    createdAt: string;
    updatedAt: string;
}