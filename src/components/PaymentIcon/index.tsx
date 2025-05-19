import { PaymentMethod } from "@/@types/payment"
import { cn } from "@/lib/utils"
import { getPaymentMethodIcon } from "@/utils/payments"

interface PaymentIconProps {
    method: PaymentMethod
    withLabel?: boolean
    className?: string
    labelClassName?: string
}

const labels = {
    [PaymentMethod.CASH]: "Dinheiro",
    [PaymentMethod.CARD]: "Cartão",
    [PaymentMethod.PIX]: "Pix",
}

const backgroundColors = {
    [PaymentMethod.CASH]: "bg-green-100",
    [PaymentMethod.CARD]: "bg-blue-100",
    [PaymentMethod.PIX]: "bg-purple-100",
}

const textColors = {
    [PaymentMethod.CASH]: "text-green-600",
    [PaymentMethod.CARD]: "text-blue-600",
    [PaymentMethod.PIX]: "text-purple-600",
}


export const PaymentIcon = ({ method, className, withLabel = false, labelClassName }: PaymentIconProps) => {

    const icon = getPaymentMethodIcon(method)
    const label = withLabel ? labels[method] : null

    return (
        <div className="flex items-center gap-2">
            <div className={cn("rounded-full p-2 flex items-center gap-2", backgroundColors[method], textColors[method], className)}>
                {icon}
            </div>
            {withLabel && <span className={labelClassName}>{label}</span>}
        </div>
    )
}
