import { CreateStockItemDTO, StockHistoryEntry, StockItem, UpdateStockByInventoryDTO, UpdateStockItemDTO } from "@/@types/stock"
import { api } from "@/lib/api"

class StockService {
    async create(data: CreateStockItemDTO) {
        const response = await api.post<StockItem>('/stock', data)
        return response.data
    }

    async findAll() {
        const response = await api.get<StockItem[]>('/stock')
        return response.data
    }

    async findOne(id: string) {
        const response = await api.get<StockItem>(`/stock/${id}`)
        return response.data
    }

    async update(id: string, data: UpdateStockItemDTO) {
        const response = await api.put<StockItem>(`/stock/${id}`, data)
        return response.data
    }

    async updateByInventory(data: { items: UpdateStockByInventoryDTO[] }) {
        const response = await api.put<StockItem>('/stock/inventory', data)
        return response.data
    }

    async remove(id: string) {
        const response = await api.delete<void>(`/stock/${id}`)
        return response.data
    }

    async getHistory(stockId: string) {
        const response = await api.get<StockHistoryEntry[]>(`/stock-history/${stockId}`)
        return response.data
    }
}

export const stockService = new StockService() 