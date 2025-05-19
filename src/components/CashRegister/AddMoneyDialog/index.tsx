import { CashRegisterOriginType } from "@/@types/cash-register"
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
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

type AddMoneyForm = {
    amount: number
    reason: string
}

export function AddMoneyDialog() {
    const { isLoading, addTransaction, invalidateCashRegister } = useCashRegister()
    const [dialogOpen, setDialogOpen] = useState(false)

    const { register, handleSubmit } = useForm<AddMoneyForm>()

    const handleAddMoney = (data: AddMoneyForm) => {
        if (!data.amount || !data.reason) return

        addTransaction({
            originType: CashRegisterOriginType.INCREMENT,
            amount: data.amount,
            reason: data.reason,
            originId: null,
        }, {
            onSuccess: () => {
                setDialogOpen(false)
                invalidateCashRegister()
                toast.success("Reforço adicionado com sucesso!")
            },
            onError: () => {
                toast.error("Erro ao adicionar reforço! Tente novamente.")
            }
        })
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="flex-1 text-blue-600 border-blue-600 hover:border-blue-600 hover:text-blue-600" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Dinheiro</DialogTitle>
                    <DialogDescription>
                        Informe o valor e o motivo para adicionar dinheiro ao caixa.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleAddMoney)} className="grid gap-4 py-4 pb-2">
                    <div className="grid gap-2">
                        <Label htmlFor="add-amount">Valor</Label>
                        <Input
                            id="add-amount"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            required
                            {...register("amount", {
                                valueAsNumber: true
                            })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="add-reason">Motivo</Label>
                        <Input
                            id="add-reason"
                            placeholder="Motivo para adicionar dinheiro"
                            required
                            {...register("reason")}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                            Adicionar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 