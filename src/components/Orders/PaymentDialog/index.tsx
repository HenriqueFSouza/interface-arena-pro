import { Order } from "@/@types/order";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/hooks/useOrders";
import { usePayments } from "@/hooks/usePayments";
import { CreatePaymentRequest, PaymentMethod } from "@/services/payments";
import { formatToBRL } from "@/utils/currency-formaters";
import { getPaymentMethodIcon, getPaymentMethodLabel } from "@/utils/payments";
import { Banknote, CreditCard, QrCode, Trash2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

interface PaymentDialogProps {
    order?: Order;
}

export default function PaymentDialog({ order }: PaymentDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>("CASH");
    const [newPaymentAmount, setNewPaymentAmount] = useState("");

    const {
        payments: existingPayments,
        isLoading,
        isPending,
        addPayment,
        removePayment,
        refetch
    } = usePayments(isOpen ? order?.id : undefined);

    const { closeOrder } = useOrders();

    const totalAmount = useMemo(() => {
        if (!order) return 0;
        return order.items.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        );
    }, [order]);

    const totalPaid = useMemo(() => {
        return existingPayments.reduce((acc, payment) => acc + Number(payment.amount), 0);
    }, [existingPayments]);

    const remainingAmount = useMemo(() => {
        return totalAmount - totalPaid;
    }, [totalAmount, totalPaid]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && order?.id) {
            refetch();
        }
    };

    const handleAddPayment = async () => {
        const amount = parseFloat(newPaymentAmount);

        if (isNaN(amount) || amount <= 0 || amount > remainingAmount || !order?.id) {
            return;
        }

        const newPayment: CreatePaymentRequest = {
            method: newPaymentMethod,
            amount: amount,
            orderClientId: order.clients[0].id
        };

        await addPayment(newPayment);

        setNewPaymentAmount("");
        setNewPaymentMethod("CASH");
    };

    const handleRemovePayment = async (paymentId: string) => {
        await removePayment(paymentId);
    };

    const handleFinishPayment = async () => {
        if (!order?.id) return;

        if (remainingAmount > 0) {
            setShowConfirmation(true);
            return;
        }

        await closeOrder(order.id);
        setIsOpen(false);
    };

    const handleConfirmCloseOrder = async () => {
        if (!order?.id) return;

        await closeOrder(order.id);
        setShowConfirmation(false);
        setIsOpen(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTitle asChild className="text-center">Pagamento</DialogTitle>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-blue-500 font-bold hover:bg-blue-500/15 hover:text-blue-500 absolute top-2 right-2 gap-2">
                        <CreditCard className="w-4 h-4" />
                        Pagar
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
                    <div className="flex flex-1 gap-4 overflow-hidden">
                        {/* Left Panel - Order Items (Read Only) */}
                        <div className="w-1/2 flex flex-col">
                            <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>

                            <ScrollArea className="flex-1 border rounded-md p-4">
                                {order?.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity} x {formatToBRL(item.product.price)}
                                            </p>
                                        </div>
                                        <p className="font-semibold">
                                            {formatToBRL(item.product.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </ScrollArea>

                            <div className="mt-4 p-4 border rounded-md bg-muted/30">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>{formatToBRL(totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Payment Methods */}
                        <div className="w-1/2 flex flex-col">
                            <h3 className="text-lg font-semibold mb-2">Formas de Pagamento</h3>

                            <div className="border rounded-md flex-1 overflow-hidden flex flex-col">
                                <div className="p-4">
                                    <div className="flex flex-1 gap-3">
                                        <div>
                                            <Label htmlFor="payment-method" className="mb-2 block">Método</Label>
                                            <Select
                                                value={newPaymentMethod}
                                                onValueChange={(value) => setNewPaymentMethod(value as PaymentMethod)}
                                            >
                                                <SelectTrigger className="[&_span]:flex [&_span]:items-center">
                                                    <SelectValue placeholder="Selecione o método" />
                                                </SelectTrigger>
                                                <SelectContent className="[&_span]:flex [&_span]:items-center">
                                                    <SelectItem value="CASH" className="flex items-center gap-2">
                                                        <Banknote className="w-4 h-4 mr-2" /> Dinheiro
                                                    </SelectItem>
                                                    <SelectItem value="CARD" className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4 mr-2" /> Cartão
                                                    </SelectItem>
                                                    <SelectItem value="PIX" className="flex items-center gap-2">
                                                        <QrCode className="w-4 h-4 mr-2" /> PIX
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="w-full">
                                            <Label htmlFor="payment-amount" className="mb-2 block">Valor</Label>
                                            <div className="flex gap-3">
                                                <Input
                                                    id="payment-amount"
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    max={remainingAmount}
                                                    value={newPaymentAmount}
                                                    onChange={(e) => setNewPaymentAmount(e.target.value)}
                                                    placeholder={`Máx: ${formatToBRL(remainingAmount)}`}
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={handleAddPayment}
                                                    disabled={!newPaymentAmount || parseFloat(newPaymentAmount) <= 0 || parseFloat(newPaymentAmount) > remainingAmount}
                                                >
                                                    Adicionar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden flex flex-col">
                                    <h4 className="px-4 py-2 font-medium text-sm border-b">Pagamentos</h4>

                                    <ScrollArea className="flex-1">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center h-[150px] text-muted-foreground">
                                                Carregando pagamentos...
                                            </div>
                                        ) : existingPayments.length === 0 ? (
                                            <div className="flex items-center justify-center h-[150px] text-muted-foreground">
                                                Nenhum pagamento adicionado
                                            </div>
                                        ) : (
                                            <div className="p-3 space-y-2">
                                                {existingPayments.map((payment) => (
                                                    <div key={payment.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                        <div className="flex items-center gap-2">
                                                            {getPaymentMethodIcon(payment.method as PaymentMethod)}
                                                            <span>{getPaymentMethodLabel(payment.method as PaymentMethod)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium">{formatToBRL(Number(payment.amount))}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive"
                                                                onClick={() => handleRemovePayment(payment.id)}
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            </div>

                            <div className="mt-4 p-4 border rounded-md bg-muted/30 space-y-2">
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span>{formatToBRL(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Pago:</span>
                                    <span>{formatToBRL(totalPaid)}</span>
                                </div>
                                <Separator />
                                <div className={`flex justify-between font-bold ${remainingAmount > 0 ? 'text-destructive' : 'text-primary'}`}>
                                    <span>Restante:</span>
                                    <span>{formatToBRL(remainingAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleFinishPayment}
                            disabled={isPending}
                            className="gap-2"
                        >
                            <Wallet className="w-4 h-4" />
                            {isPending ? 'Processando...' : 'Fechar Comanda'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog for closing order with unpaid amount */}
            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar fechamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Este pedido ainda possui um valor em aberto de <strong>{formatToBRL(remainingAmount)}</strong>.
                            Tem certeza que deseja fechar a comanda sem concluir o pagamento total?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCloseOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Fechar mesmo assim
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
