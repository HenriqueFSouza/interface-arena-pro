import { expenseService } from "@/services/expense-service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export function useExpenses() {
    const [search, setSearch] = useState("")
    const queryClient = useQueryClient()

    const { data: expenses = [], isLoading, isFetching, refetch } = useQuery({
        queryKey: ["expenses", search],
        queryFn: () => expenseService.list(),
        staleTime: 1000 * 60 * 20 // 20 minutes
    })

    const { mutateAsync: createExpense, isPending: isCreating } = useMutation({
        mutationFn: expenseService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] })
            refetch()
        }
    })

    return {
        expenses,
        isLoading: isLoading || isFetching,
        search,
        setSearch,
        createExpense,
        isCreating
    }
} 