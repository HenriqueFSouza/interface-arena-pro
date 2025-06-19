import { Order } from "@/@types/order";
import { PaymentMethod } from "@/@types/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrderPayment } from "@/contexts/OrderPaymentContext";
import { formatToBRL } from "@/utils/formaters";
import { getPaymentMethodIcon, getPaymentMethodLabel } from "@/utils/payments";
import { Banknote, CreditCard, QrCode, Trash2, Wallet } from "lucide-react";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";
import { DiscountSection } from "./DiscountSection";

interface PaymentContentProps {
    order?: Order;
    onFinishPayment: () => void;
    isFinishDisabled?: boolean;
    finishButtonText?: string;
    showFooter?: boolean;
    footerContent?: ReactNode;
}

export default function PaymentContent({
    order,
    onFinishPayment,
    isFinishDisabled = false,
    finishButtonText = "Finalizar Pagamento",
    showFooter = true,
    footerContent,
}: PaymentContentProps) {
    const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
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
            setNewPaymentMethod(PaymentMethod.CASH);
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

    return (
        <div className="h-full flex flex-1 gap-4 overflow-hidden">
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

                {showFooter && (
                    <div className="mt-4">
                        {footerContent || (
                            <Button
                                onClick={onFinishPayment}
                                disabled={isPending || isFinishDisabled || newRemainingAmount > 0}
                                className="w-full gap-2"
                            >
                                <Wallet className="w-4 h-4" />
                                {isPending ? 'Processando...' : finishButtonText}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 