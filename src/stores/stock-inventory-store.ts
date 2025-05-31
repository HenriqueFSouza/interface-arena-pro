"use client"

import { UpdateStockByInventoryDTO } from "@/@types/stock"
import { create } from "zustand"

interface StockInventoryStore {
    isInventoryMode: boolean
    setIsInventoryMode: (isMode: boolean) => void

    inventoryChanges: Map<string, number>
    setItemQuantity: (itemId: string, quantity: number) => void
    removeItemChange: (itemId: string) => void

    getItemQuantity: (itemId: string) => number | undefined
    hasChanges: () => boolean
    clearChanges: () => void
    resetInventory: () => void

    getInventoryData: () => UpdateStockByInventoryDTO[]
}

export const useStockInventoryStore = create<StockInventoryStore>((set, get) => ({
    isInventoryMode: false,
    setIsInventoryMode: (isMode) => set({ isInventoryMode: isMode }),

    inventoryChanges: new Map(),
    setItemQuantity: (itemId, quantity) => {
        const { inventoryChanges } = get()
        const newChanges = new Map(inventoryChanges)
        newChanges.set(itemId, quantity)
        set({ inventoryChanges: newChanges })
    },

    removeItemChange: (itemId) => {
        const { inventoryChanges } = get()
        const newChanges = new Map(inventoryChanges)
        newChanges.delete(itemId)
        set({ inventoryChanges: newChanges })
    },

    getItemQuantity: (itemId) => {
        const { inventoryChanges } = get()
        return inventoryChanges.get(itemId)
    },

    hasChanges: () => {
        const { inventoryChanges } = get()
        return inventoryChanges.size > 0
    },

    clearChanges: () => set({ inventoryChanges: new Map() }),

    resetInventory: () => set({
        isInventoryMode: false,
        inventoryChanges: new Map()
    }),

    getInventoryData: () => {
        const { inventoryChanges } = get()
        return Array.from(inventoryChanges.entries()).map(([id, quantity]) => ({
            id,
            quantity
        }))
    }
})) 