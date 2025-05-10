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
import { OrderPaymentProvider, useOrderPayment } from "@/contexts/OrderPaymentContext";
import { useOrders } from "@/hooks/useOrders";
import { PaymentMethod } from "@/services/payments";
import { formatToBRL } from "@/utils/formaters";
import { getPaymentMethodIcon, getPaymentMethodLabel } from "@/utils/payments";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Banknote, CircleDollarSign, CreditCard, QrCode, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DiscountSection } from "./DiscountSection";

interface PaymentDialogProps {
    order?: Order;
    onClose: () => void;
}

function PaymentDialogContent({ order, onClose }: PaymentDialogProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>("CASH");
    const [newPaymentAmount, setNewPaymentAmount] = useState("");

    const {
        payments,
        isLoading,
        isPending,
        totalAmount,
        discountAmount,
        totalPaid,
        remainingAmount,
        newRemainingAmount,
        addPayment,
        removePayment,
    } = useOrderPayment();

    const { closeOrder } = useOrders();

    const handleAddPayment = async () => {
        const amount = parseFloat(newPaymentAmount);

        if (isNaN(amount) || amount <= 0 || amount > remainingAmount || !order?.id) {
            return;
        }

        const newPayment = {
            method: newPaymentMethod,
            amount: amount,
            orderClientId: order.clients[0].orderClientId || undefined
        };

        try {
            await addPayment(newPayment);
            setNewPaymentAmount("");
            setNewPaymentMethod("CASH");
            toast.success("Pagamento adicionado com sucesso");
        } catch (error) {
            toast.error("Erro ao adicionar pagamento");
        }

    };

    const handleRemovePayment = async (paymentId: string) => {
        try {
            await removePayment(paymentId);
            toast.success("Pagamento removido com sucesso");
        } catch (error) {
            toast.error("Erro ao remover pagamento");
        }
    };

    const handleFinishPayment = async () => {
        if (!order?.id) return;

        if (remainingAmount > 0) {
            setShowConfirmation(true);
            return;
        }

        try {
            await closeOrder(order.id);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmCloseOrder = async () => {
        if (!order?.id) return;

        try {
            await closeOrder(order.id);
            setShowConfirmation(false);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="flex flex-1 gap-4 overflow-hidden">
                {/* Left Panel - Payment Methods */}
                <div className="w-1/2 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">Formas de Pagamento</h3>

                    <div className="border rounded-md flex-1 overflow-hidden flex flex-col">
                        <div className="p-4">
                            <DiscountSection />
                            <div className="mt-4 flex flex-1 gap-3">
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
                                ) : payments.length === 0 ? (
                                    <div className="flex items-center justify-center h-[150px] text-muted-foreground">
                                        Nenhum pagamento adicionado
                                    </div>
                                ) : (
                                    <div className="p-3 space-y-2">
                                        {payments.map((payment) => (
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
                </div>

                {/* Right Panel - Order Items (Read Only) */}
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

                    <div className="mt-4 p-4 border rounded-md bg-muted/30 space-y-2">
                        <div className="flex justify-between">
                            <span>Total:</span>
                            <span>{formatToBRL(totalAmount)}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Desconto:</span>
                                <span>{"- " + formatToBRL(discountAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Total Pago:</span>
                            <span>{formatToBRL(totalPaid)}</span>
                        </div>
                        <Separator />
                        <div className={`flex justify-between font-bold ${newRemainingAmount > 0 ? 'text-destructive' : 'text-primary'}`}>
                            <span>Restante:</span>
                            <span>{formatToBRL(newRemainingAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
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

            <AlertDialog open={showConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar fechamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Este pedido ainda possui um valor em aberto de <strong>{formatToBRL(remainingAmount)}</strong>.
                            Tem certeza que deseja fechar a comanda sem concluir o pagamento total?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowConfirmation(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCloseOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Fechar mesmo assim
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default function PaymentDialog({ order }: PaymentDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-blue-500 font-bold hover:bg-blue-500/15 hover:text-blue-500 absolute p-2 top-2 right-2 gap-2">
                    <CircleDollarSign className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
                <VisuallyHidden>
                    <DialogTitle className="text-center">Pagamento</DialogTitle>
                </VisuallyHidden>
                <OrderPaymentProvider order={order} isOpen={isOpen}>
                    <PaymentDialogContent order={order} onClose={() => setIsOpen(false)} />
                </OrderPaymentProvider>
            </DialogContent>
        </Dialog>
    );
}
