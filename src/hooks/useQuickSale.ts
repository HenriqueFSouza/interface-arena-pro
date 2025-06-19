import { Order } from "@/@types/order";
import { useCashRegister } from "@/hooks/useCashRegister";
import { useCashRegisterSales } from "@/hooks/useCashRegisterSales";
import { ordersService } from "@/services/orders";
import { useSalesStore } from "@/stores/sales-store";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export enum QuickSaleStep {
    PRODUCTS = 'products',
    PAYMENT = 'payment'
}

export const useQuickSale = () => {
    const [currentStep, setCurrentStep] = useState<QuickSaleStep>(QuickSaleStep.PRODUCTS);
    const [tempOrder, setTempOrder] = useState<Order | null>(null);
    const { cartItems, clearCart, getTotalPrice } = useSalesStore();
    const { invalidateCashRegister } = useCashRegister();
    const { invalidateCashRegisterSales } = useCashRegisterSales();

    const createTempOrder = useMutation({
        mutationFn: () => ordersService.createOrder({
            clientInfo: {
                name: "Venda Rápida",
                phone: undefined
            },
            items: cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }))
        }),
        onSuccess: (order) => {
            setTempOrder(order);
            setCurrentStep(QuickSaleStep.PAYMENT);
        },
        onError: () => {
            toast.error('Erro ao criar ordem para venda rápida');
        }
    });

    const deleteTempOrder = useMutation({
        mutationFn: (orderId: string) => ordersService.deleteOrder(orderId),
        onSuccess: () => {
            setTempOrder(null);
            setCurrentStep(QuickSaleStep.PRODUCTS);
            clearCart();
        },
        onError: () => {
            toast.error('Erro ao cancelar venda');
        }
    });

    // Quick sale specific close order without cache invalidation for orders list
    const closeQuickSaleOrder = useMutation({
        mutationFn: ordersService.closeOrder,
        onSuccess: () => {
            // Only invalidate cash register related caches, not orders list for performance
            setTempOrder(null);
            setCurrentStep(QuickSaleStep.PRODUCTS);
            clearCart();
            toast.success('Venda rápida finalizada com sucesso');
            invalidateCashRegister();
            invalidateCashRegisterSales();
        },
        onError: () => {
            toast.error('Erro ao finalizar venda rápida');
        }
    });

    const proceedToPayment = async () => {
        if (cartItems.length === 0) {
            toast.error('Adicione pelo menos um produto');
            return;
        }

        await createTempOrder.mutateAsync();
    };

    const cancelQuickSale = async () => {
        if (tempOrder) {
            await deleteTempOrder.mutateAsync(tempOrder.id);
            toast.success('Venda rápida cancelada com sucesso');
        } else {
            // If no temp order exists, just clear cart and reset
            clearCart();
            setCurrentStep(QuickSaleStep.PRODUCTS);
        }
    };

    const goBackToProducts = () => {
        setCurrentStep(QuickSaleStep.PRODUCTS);
    };

    return {
        currentStep,
        tempOrder,
        totalPrice: getTotalPrice(),
        hasItems: cartItems.length > 0,
        isCreatingOrder: createTempOrder.isPending,
        isDeletingOrder: deleteTempOrder.isPending,
        isClosingOrder: closeQuickSaleOrder.isPending,
        proceedToPayment,
        cancelQuickSale,
        goBackToProducts,
        closeQuickSaleOrder: closeQuickSaleOrder.mutate,
    };
}; 