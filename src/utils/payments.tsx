import { PaymentMethod } from "@/@types/payment";
import { cn } from "@/lib/utils";
import { Banknote, CreditCard, QrCode } from "lucide-react";

export const getPaymentMethodIcon = (method: PaymentMethod, className?: string) => {
    switch (method) {
        case "CASH":
            return <Banknote className={cn("w-4 h-4", className)} />;
        case "CARD":
            return <CreditCard className={cn("w-4 h-4", className)} />;
        case "PIX":
            return <QrCode className={cn("w-4 h-4", className)} />;
    }
};

export const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
        case "CASH":
            return "Dinheiro";
        case "CARD":
            return "Cartão";
        case "PIX":
            return "PIX";
    }
};