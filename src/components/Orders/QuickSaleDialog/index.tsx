"use client"

import PrintOptions from "@/components/Print/print-options";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { OrderPaymentProvider } from "@/contexts/OrderPaymentContext";
import { useCashRegister } from "@/hooks/useCashRegister";
import { usePrinter } from "@/hooks/usePrinter";
import { QuickSaleStep, useQuickSale } from "@/hooks/useQuickSale";
import { useSalesStore } from "@/stores/sales-store";
import { formatToBRL } from "@/utils/formaters";
import { ArrowLeft, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CartItens } from "../CartSummary";
import CategoryFilter from "../CategoryFilter";
import OrderProductsList from "../OrderProductsList";
import PaymentContent from "../PaymentDialog/PaymentContent";

export default function QuickSaleDialog() {
    const [open, setOpen] = useState(false);
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const [printOrderTicket, setPrintOrderTicket] = useState(false)
    const [printTicket, setPrintTicket] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { isOpen: isCashRegisterOpen, cashRegister } = useCashRegister();
    const { printOrder } = usePrinter()

    const {
        cartItems,
        clearCart,
    } = useSalesStore();

    const {
        currentStep,
        tempOrder,
        totalPrice,
        hasItems,
        isCreatingOrder,
        isDeletingOrder,
        proceedToPayment,
        cancelQuickSale,
        goBackToProducts,
        closeQuickSaleOrder,
    } = useQuickSale(cashRegister?.id);

    const handleClose = () => {
        if (tempOrder) {
            setShowCancelConfirmation(true);
        } else {
            clearCart();
            setOpen(false);
        }
    };

    const handleConfirmCancel = async () => {
        try {
            setShowCancelConfirmation(false);

            await new Promise(resolve => setTimeout(resolve, 100));

            await cancelQuickSale();

            setOpen(false);
        } catch (error) {
            setShowCancelConfirmation(false);
            setOpen(false);
            console.error('Error canceling quick sale:', error);
        }
    };

    const handlePaymentComplete = () => {
        closeQuickSaleOrder(tempOrder?.id!);
        setOpen(false);
        if (printOrderTicket) {
            printOrder({ order: tempOrder!, options: { shouldCallFallback: true } })
        }
        if (printTicket) {
            printOrder({ order: tempOrder!, template: 'ticket' })
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            handleClose();
        } else {
            setOpen(newOpen);
        }
    };

    useEffect(() => {
        return () => {
            setShowCancelConfirmation(false);
            setOpen(false);
        };
    }, []);

    const isProductsStep = currentStep === QuickSaleStep.PRODUCTS

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button disabled={!isCashRegisterOpen} variant="outline" className="border-primary text-primary hover:bg-gray-200 hover:text-primary">
                        <Zap className="mr-2 h-4 w-4" />
                        Venda Rápida
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {isProductsStep && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={goBackToProducts}
                                    className="p-1"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}
                            Venda Rápida - {currentStep === QuickSaleStep.PRODUCTS ? 'Selecionar Produtos' : 'Pagamento'}
                        </DialogTitle>
                        <DialogDescription>
                            {isProductsStep
                                ? 'Adicione produtos ao carrinho e prossiga para o pagamento.'
                                : 'Finalize o pagamento da venda rápida.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    {isProductsStep ? (
                        <div className="flex flex-1 overflow-hidden">
                            {/* Left side: Products */}
                            <div className="w-2/3 overflow-auto">
                                <div className="mb-4">
                                    <CategoryFilter
                                        selectedCategory={selectedCategory}
                                        onSelectCategory={setSelectedCategory}
                                    />
                                </div>
                                <OrderProductsList categoryOverride={selectedCategory} />
                            </div>

                            {/* Right side: Cart items */}
                            <div className="w-1/3 border-l pl-4 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-medium">Carrinho</h3>
                                    {cartItems.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive h-8"
                                            onClick={clearCart}
                                        >
                                            Limpar
                                        </Button>
                                    )}
                                </div>

                                <CartItens />

                                <PrintOptions
                                    className="p-0 [&>label]:text-xs [&>button]:size-4 [&>button]:mr-0"
                                    handlePrintOrder={setPrintOrderTicket}
                                    handlePrintTicket={setPrintTicket}
                                    printOrderTicket={printOrderTicket}
                                    printTicket={printTicket}
                                />

                                <div className="pt-3 mt-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-medium">Total</span>
                                        <span className="text-lg font-bold">{formatToBRL(totalPrice)}</span>
                                    </div>
                                    <Button
                                        onClick={proceedToPayment}
                                        className="w-full"
                                        disabled={!hasItems || isCreatingOrder}
                                    >
                                        {isCreatingOrder ? "Criando..." : "Prosseguir para Pagamento"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden">
                            {tempOrder && (
                                <OrderPaymentProvider order={tempOrder} isOpen={open}>
                                    <PaymentContent
                                        order={tempOrder}
                                        onFinishPayment={handlePaymentComplete}
                                        isFinishDisabled={isDeletingOrder}
                                        finishButtonText="Finalizar Venda Rápida"
                                    />
                                </OrderPaymentProvider>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog
                open={showCancelConfirmation}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowCancelConfirmation(false);
                    }
                }}
            >
                <AlertDialogContent
                    onEscapeKeyDown={(e) => {
                        e.preventDefault();
                        setShowCancelConfirmation(false);
                    }}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Venda Rápida</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você tem uma venda em andamento. Ao cancelar, você perderá todos os itens selecionados.
                            Tem certeza que deseja cancelar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowCancelConfirmation(false)}>
                            Continuar Venda
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmCancel}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeletingOrder}
                        >
                            {isDeletingOrder ? "Cancelando..." : "Sim, Cancelar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
} 