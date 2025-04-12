import { Client } from "./client"

export enum OrderStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    ARCHIVED = 'ARCHIVED',
}

export type OrderItem = {
    id: string
    quantity: number
    productId: string
    orderClientId: string
    product: {
        id: string
        name: string
        price: number
        categoryId: string
    }
}

export interface Order {
    id: string
    status: OrderStatus
    note: string | null
    ownerId: string
    createdAt: string
    updatedAt: string
    clients: Client[]
    items: OrderItem[]
}
