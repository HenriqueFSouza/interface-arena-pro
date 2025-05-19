import { api } from "@/lib/api"

export type Expense = {
    id: string
    name: string
    createdAt: string
}

export type CreateExpenseDTO = {
    name: string
}

export const expenseService = {
    async list(query?: string) {
        const url = query ? `/expenses?query=${query}` : "/expenses"
        const { data } = await api.get<Expense[]>(url)
        return data
    },

    async create(expense: CreateExpenseDTO) {
        const { data } = await api.post<Expense>("/expenses", expense)
        return data
    }
}
