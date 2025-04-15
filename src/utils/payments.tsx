import { PaymentMethod } from "@/services/payments";
import { Banknote, CreditCard, QrCode } from "lucide-react";

export const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
        case "CASH":
            return <Banknote className="w-4 h-4" />;
        case "CARD":
            return <CreditCard className="w-4 h-4" />;
        case "PIX":
            return <QrCode className="w-4 h-4" />;
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