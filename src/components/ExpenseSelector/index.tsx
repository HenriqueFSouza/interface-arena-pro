import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { useExpenses } from "@/hooks/useExpenses"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { Label } from "../ui/label"

type ExpenseSelectorProps = {
    value?: string
    label: string
    onChange: (value: { id: string, name: string }) => void
}

export function ExpenseSelector({ value, onChange, label }: ExpenseSelectorProps) {
    const [open, setOpen] = useState(false)
    const [isCreatingLocal, setIsCreatingLocal] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)

    const { expenses, isLoading, search, setSearch, createExpense, isCreating } = useExpenses()

    const handleCreateExpense = async () => {
        if (!search.trim()) return

        try {
            setIsCreatingLocal(true)
            const expense = await createExpense({ name: search.trim() })
            onChange({ id: expense.id, name: expense.name })
            setOpen(false)
            toast.success("Despesa criada com sucesso!")
        } catch {
            toast.error("Erro ao criar despesa!")
        } finally {
            setIsCreatingLocal(false)
        }
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <Label>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? expenses.find((expense) => expense.id === value)?.name
                            : "Selecione uma despesa..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-full bg-white p-2"
                    align="start"
                    style={{
                        width: triggerRef.current?.offsetWidth,
                    }}
                    shouldRenderPortal={false}
                >
                    <Command shouldFilter>
                        <CommandInput
                            placeholder="Digite o nome da despesa..."
                            onValueChange={(value) => {
                                setSearch(value)
                            }}
                        />

                        <CommandList className="mt-3">
                            <CommandEmpty>
                                <div className="text-center">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-6">
                                            <Spinner size={20} />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="py-6 text-sm text-muted-foreground">
                                                Nenhuma despesa encontrada
                                            </p>
                                            {search.trim() && (
                                                <Button
                                                    variant="link"
                                                    className="w-full items-center justify-center px-2 text-sm font-normal text-blue-600"
                                                    onClick={handleCreateExpense}
                                                    disabled={isCreating || isCreatingLocal}
                                                >
                                                    {isCreating || isCreatingLocal ? (
                                                        <Spinner className="mr-2" />
                                                    ) : (
                                                        <PlusCircle className="mr-2 h-4 w-4" />
                                                    )}
                                                    {isCreating || isCreatingLocal
                                                        ? "Criando despesa..."
                                                        : `Adicionar despesa "${search.trim()}"`}
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CommandEmpty>

                            <CommandGroup>
                                {expenses.map((expense) => (
                                    <CommandItem
                                        className="cursor-pointer"
                                        key={expense.id}
                                        value={expense.name}
                                        onSelect={() => {
                                            onChange({ id: expense.id, name: expense.name });
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === expense.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {expense.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
} 