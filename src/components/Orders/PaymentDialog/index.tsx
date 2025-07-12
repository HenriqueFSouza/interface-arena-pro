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
import { OrderPaymentProvider, useOrderPayment } from "@/contexts/OrderPaymentContext";
import { useCloseOrderMutation } from "@/hooks/orders/useCloseOrderMutation";
import { formatToBRL } from "@/utils/formaters";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CircleDollarSign, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import PaymentContent from "./PaymentContent";
interface PaymentDialogProps {
    order?: Order;
    onClose: () => void;
}

function PaymentDialogContent({ order, onClose }: PaymentDialogProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { remainingAmount } = useOrderPayment();
    const { closeOrder } = useCloseOrderMutation();

    useEffect(() => {
        return () => {
            setShowConfirmation(false);
        };
    }, []);

    const handleFinishPayment = () => {
        if (!order?.id) return;

        if (remainingAmount > 0) {
            setShowConfirmation(true);
            return;
        }

        closeOrder(order.id);
        onClose();
    };

    const handleConfirmCloseOrder = () => {
        if (!order?.id) return;

        setShowConfirmation(false);
        closeOrder(order.id);
        onClose();
    };

    const customFooter = (
        <>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleFinishPayment}
                    className="gap-2"
                >
                    <Wallet className="w-4 h-4" />
                    Fechar Comanda
                </Button>
            </DialogFooter>

            <AlertDialog
                open={showConfirmation}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowConfirmation(false);
                    }
                }}
            >
                <AlertDialogContent
                    onEscapeKeyDown={(e) => {
                        e.preventDefault();
                        setShowConfirmation(false);
                    }}
                >
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

    return (
        <PaymentContent
            order={order}
            onFinishPayment={handleFinishPayment}
            footerContent={customFooter}
        />
    );
}

export default function PaymentDialog({ order }: Pick<PaymentDialogProps, 'order'>) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        return () => {
            setIsOpen(false);
        };
    }, []);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
