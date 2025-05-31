export enum UnitMeasure {
    UNIT = 'UNIT',
    KILOGRAM = 'KILOGRAM',
    LITER = 'LITER',
}

export enum StockHistoryType {
    INCOMING = 'INCOMING',
    OUTGOING = 'OUTGOING',
    ADJUSTMENT = 'ADJUSTMENT',
    INVENTORY = 'INVENTORY',
}

export interface StockItem {
    id: string
    name: string
    unitMeasure: UnitMeasure
    quantity: number
    unitPrice: number
    totalAmountSpent: number
    totalQuantityPurchased: number
    expense?: {
        id: string
        name: string
    }
}

export interface CreateStockItemDTO {
    name: string
    unitMeasure: UnitMeasure
    quantity: number
    totalPrice: number
    unitPrice: number
    expenseId?: string
}

export interface UpdateStockItemDTO {
    name?: string
    quantity?: number
    totalPrice?: number
    unitPrice?: number
    expenseId?: string
}

export interface UpdateStockByInventoryDTO {
    id: string
    quantity: number
}

export interface StockHistoryEntry {
    id: string
    createdAt: string
    type: StockHistoryType
    initialQuantity: number
    quantity: number
    unitPrice: number
    finalQuantity: number
    description?: string
    stock: Pick<StockItem, 'unitMeasure'>
}