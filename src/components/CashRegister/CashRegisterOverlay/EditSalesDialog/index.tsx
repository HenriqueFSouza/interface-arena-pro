import { CashRegisterSales } from "@/@types/cash-register"
import { PaymentMethod } from "@/@types/payment"
import { PaymentIcon } from "@/components/PaymentIcon"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCashRegisterSales } from "@/hooks/useCashRegisterSales"
import { formatToBRL } from "@/utils/formaters"
import { getPaymentMethodIcon } from "@/utils/payments"
import { Loader2, Pencil } from "lucide-react"
import { useMemo, useState } from "react"

interface EditSalesDialogProps {
    sale: CashRegisterSales
    cashRegisterId: string
}

export default function EditSalesDialog({ sale, cashRegisterId }: EditSalesDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Pencil className="size-4 " />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Venda</DialogTitle>
                </DialogHeader>
                <EditSalesContent sale={sale} cashRegisterId={cashRegisterId} onClose={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}

function EditSalesContent({ sale, cashRegisterId, onClose }: { sale: CashRegisterSales, cashRegisterId: string, onClose: () => void }) {
    const [paymentMethods, setPaymentMethods] = useState<{ paymentId: string, paymentMethod: PaymentMethod }[]>([])
    const { updatePaymentsMutation } = useCashRegisterSales(cashRegisterId)

    const handlePaymentMethodChange = (paymentId: string, newMethod: PaymentMethod) => {
        setPaymentMethods((prev) => {
            const existingPayment = prev.find(payment => payment.paymentId == paymentId)
            if (!existingPayment) {
                return [...prev, { paymentId, paymentMethod: newMethod }]
            }
            existingPayment.paymentMethod = newMethod
            return [...prev]
        })
    }

    const handleSave = async () => {
        if (paymentMethods.length > 0) {
            await updatePaymentsMutation(
                { payments: paymentMethods, transactionId: sale.id },
                {
                    onSuccess: () => {
                        onClose()
                    }
                }
            )
        }
    }

    const hasChanges = paymentMethods.length > 0

    const payments = useMemo(() => {
        return sale.payments
    }, [sale.payments])

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
                Cliente: {sale.clientName}
            </div>
            <div className="space-y-2">
                <h4 className="font-medium">Pagamentos</h4>
                {payments.map(({ id, paymentMethod, amount }) => {
                    const newPaymentMethod = paymentMethods.find(payment => payment.paymentId == id)?.paymentMethod
                    return (
                        <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                                <PaymentIcon method={paymentMethod} />
                                <span className="font-medium">{formatToBRL(amount)}</span>
                            </div>
                            <Select
                                value={newPaymentMethod || paymentMethod}
                                onValueChange={(value) => handlePaymentMethodChange(id, value as PaymentMethod)}
                            >
                                <SelectTrigger className="w-1/2 [&_span]:flex [&_span]:items-center [&_span]:gap-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="[&_span]:flex [&_span]:items-center [&_span]:gap-2">
                                    <SelectItem value={PaymentMethod.CASH}>
                                        {getPaymentMethodIcon(PaymentMethod.CASH, 'size-5')} Dinheiro
                                    </SelectItem>
                                    <SelectItem value={PaymentMethod.CARD}>
                                        {getPaymentMethodIcon(PaymentMethod.CARD, 'size-5')} Cartão
                                    </SelectItem>
                                    <SelectItem value={PaymentMethod.PIX}>
                                        {getPaymentMethodIcon(PaymentMethod.PIX, 'size-5')} PIX
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )
                })}
            </div>
            {hasChanges && (
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        {!hasChanges ? (
                            <>
                                <Loader2 className="size-4 animate-spin mr-2" />
                                Salvando...
                            </>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}