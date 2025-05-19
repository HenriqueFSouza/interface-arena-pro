import { CashRegisterOriginType } from "@/@types/cash-register"
import { ExpenseSelector } from "@/components/ExpenseSelector"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCashRegister } from "@/hooks/useCashRegister"
import { MinusCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

type WithdrawMoneyForm = {
    amount: number
    expense: {
        id: string
        name: string
    }
}

export function WithdrawMoneyDialog() {
    const { isLoading, addTransaction, invalidateCashRegister } = useCashRegister()
    const [dialogOpen, setDialogOpen] = useState(false)
    const { register, handleSubmit, setValue, watch } = useForm<WithdrawMoneyForm>()

    const expense = watch("expense")

    const handleWithdrawMoney = async (data: WithdrawMoneyForm) => {
        addTransaction({
            originType: CashRegisterOriginType.EXPENSE,
            amount: -data.amount,
            reason: expense.name,
            originId: expense.id,
        }, {
            onSuccess: () => {
                setDialogOpen(false)
                invalidateCashRegister()
                toast.success("Dinheiro retirado com sucesso!")
            },
            onError: () => {
                toast.error("Erro ao retirar dinheiro!")
            }
        })
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                    <MinusCircle className="mr-2 h-4 w-4" />
                    Retirar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Retirar Dinheiro</DialogTitle>
                    <DialogDescription>
                        Informe o valor e selecione a despesa para retirar dinheiro do caixa.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleWithdrawMoney)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="withdraw-amount">Valor</Label>
                        <Input
                            id="withdraw-amount"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            {...register("amount", {
                                required: true,
                                valueAsNumber: true,
                                min: 0.01
                            })}
                        />
                    </div>
                    <ExpenseSelector
                        label="Despesa"
                        value={expense?.id}
                        onChange={(value) => setValue("expense", value)}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Retirar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 