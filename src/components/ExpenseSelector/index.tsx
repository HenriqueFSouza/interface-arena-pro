import { Combobox } from "@/components/ui/combobox"
import { useExpenses } from "@/hooks/useExpenses"
import { useCallback } from "react"
import toast from "react-hot-toast"

type ExpenseSelectorProps = {
    value?: string
    label: string
    onChange: (value: { id: string, name: string }) => void
}

export function ExpenseSelector({ value, onChange, label }: ExpenseSelectorProps) {
    const { expenses, isLoading, createExpense, isCreating } = useExpenses()

    const handleCreateExpense = useCallback(async (name: string) => {
        try {
            const expense = await createExpense({ name })
            toast.success("Despesa criada com sucesso!")
            return { id: expense.id, name: expense.name }
        } catch {
            toast.error("Erro ao criar despesa!")
            throw new Error("Failed to create expense")
        }
    }, [createExpense])

    return (
        <Combobox
            value={value}
            label={label}
            placeholder="Selecione uma despesa..."
            searchPlaceholder="Digite o nome da despesa..."
            emptyMessage="Nenhuma despesa encontrada"
            options={expenses}
            isLoading={isLoading}
            onChange={onChange}
            onCreate={handleCreateExpense}
            isCreating={isCreating}
            createButtonText={(name) => `Adicionar despesa "${name}"`}
            creatingText="Criando despesa..."
        />
    )
} 