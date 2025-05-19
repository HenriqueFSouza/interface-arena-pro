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
import { useState } from "react"
import { toast } from "react-hot-toast"

export function OpenCashRegisterDialog() {
    const [open, setOpen] = useState(false)
    const [initialAmount, setInitialAmount] = useState("")
    const { openCashRegister, isLoading } = useCashRegister()

    function handleOpenCashRegister(e: React.FormEvent) {
        e.preventDefault()
        const amount = parseFloat(initialAmount.replace(',', '.'))

        if (isNaN(amount)) {
            toast.error('Valor inválido')
            return
        }

        openCashRegister(
            amount,
            {
                onSuccess: () => {
                    toast.success('Caixa aberto com sucesso')
                    setOpen(false)
                },
                onError: () => {
                    toast.error('Erro ao abrir caixa')
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-[300px]">
                    Abrir Caixa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Abrir Caixa</DialogTitle>
                    <DialogDescription>
                        Informe o valor inicial do fundo de caixa para começar as operações.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleOpenCashRegister}>
                    <div className="grid gap-4 p-2 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-right">
                                Fundo de caixa
                            </Label>
                            <Input
                                id="amount"
                                type="text"
                                placeholder="0,00"
                                value={initialAmount}
                                onChange={(e) => setInitialAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Abrindo..." : "Abrir Caixa"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
