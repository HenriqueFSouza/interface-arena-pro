import { Order } from "@/@types/order";
import { useDiscounts } from "@/hooks/useDiscounts";
import { usePayments } from "@/hooks/usePayments";
import { CreateDiscountRequest, Discount } from "@/services/discounts";
import { CreatePaymentRequest, Payment } from "@/services/payments";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface OrderPaymentContextData {
    payments: Payment[];
    discounts: Discount[];
    isLoading: boolean;
    isPending: boolean;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    totalPaid: number;
    remainingAmount: number;
    existingDiscountsTotal: number;
    paymentIsCompleted: boolean;
    newRemainingAmount: number;
    addPayment: (payment: CreatePaymentRequest) => Promise<void>;
    removePayment: (id: string) => Promise<void>;
    addDiscount: (discount: CreateDiscountRequest) => Promise<void>;
    removeDiscount: (id: string) => Promise<void>;
    updateTempDiscountAmount: (amount: number) => void;
    refetch: () => Promise<void>;
}

interface OrderPaymentProviderProps {
    children: React.ReactNode;
    order?: Order;
    isOpen: boolean;
}

const OrderPaymentContext = createContext({} as OrderPaymentContextData);

export function OrderPaymentProvider({ children, order, isOpen }: OrderPaymentProviderProps) {
    const [tempDiscountAmount, setTempDiscountAmount] = useState<number | null>(null);

    const {
        payments,
        isLoading: isLoadingPayments,
        isPending,
        addPayment,
        removePayment,
        refetch: refetchPayments
    } = usePayments(isOpen ? order?.id : undefined);

    const {
        discounts,
        isLoading: isLoadingDiscounts,
        addDiscount,
        removeDiscount,
        refetch: refetchDiscounts
    } = useDiscounts(isOpen ? order?.id : undefined);

    // For feature needs
    const refetch = useCallback(async () => {
        await Promise.all([refetchPayments(), refetchDiscounts()]);
    }, [refetchPayments, refetchDiscounts]);

    const totalAmount = useMemo(() =>
        order?.items.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        ) || 0,
        [order?.items]
    );

    const totalPaid = useMemo(() =>
        payments.reduce((acc, payment) => acc + Number(payment.amount), 0),
        [payments]
    );

    const existingDiscountsTotal = useMemo(() =>
        discounts.reduce((total, discount) => total + discount.value, 0),
        [discounts]
    );

    const remainingAmount = useMemo(() => {
        const finalAmount = totalAmount - existingDiscountsTotal;
        return finalAmount - totalPaid;
    }, [totalAmount, existingDiscountsTotal, payments]);

    const calculations = useMemo(() => {
        const discountAmount = tempDiscountAmount ?? existingDiscountsTotal;
        const finalAmount = totalAmount - discountAmount;
        const newRemainingAmount = finalAmount - totalPaid;

        return {
            totalAmount,
            discountAmount,
            finalAmount,
            totalPaid,
            newRemainingAmount,
            existingDiscountsTotal
        };
    }, [totalAmount, tempDiscountAmount, existingDiscountsTotal, payments]);

    const updateTempDiscountAmount = useCallback((amount: number) => {
        setTempDiscountAmount(amount);
    }, []);

    const paymentIsCompleted = useMemo(() => {
        return totalPaid >= totalAmount - existingDiscountsTotal;
    }, [totalPaid, totalAmount, existingDiscountsTotal]);

    const contextValue: OrderPaymentContextData = useMemo(() => ({
        payments,
        discounts,
        isLoading: isLoadingPayments || isLoadingDiscounts,
        isPending,
        remainingAmount,
        paymentIsCompleted,
        ...calculations,
        addPayment: async (payment) => {
            await addPayment(payment);
        },
        removePayment: async (id) => {
            await removePayment(id);
        },
        addDiscount: async (discount) => {
            await addDiscount(discount);
            setTempDiscountAmount(null);
        },
        removeDiscount: async (id) => {
            await removeDiscount(id);
            setTempDiscountAmount(null);
        },
        updateTempDiscountAmount,
        refetch
    }), [
        payments,
        discounts,
        isLoadingPayments,
        isLoadingDiscounts,
        isPending,
        calculations,
        addPayment,
        removePayment,
        addDiscount,
        removeDiscount,
        updateTempDiscountAmount,
        refetch
    ]);

    return (
        <OrderPaymentContext.Provider value={contextValue}>
            {children}
        </OrderPaymentContext.Provider>
    );
}

export const useOrderPayment = () => {
    const context = useContext(OrderPaymentContext);

    if (!context) {
        throw new Error('useOrderPayment must be used within an OrderPaymentProvider');
    }

    return context;
} 