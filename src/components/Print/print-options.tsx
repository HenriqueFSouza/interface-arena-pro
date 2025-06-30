import { cn } from "@/lib/utils"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

interface PrintOptionsProps {
    handlePrintOrder: (checked: boolean) => void
    handlePrintTicket: (checked: boolean) => void
    printOrderTicket: boolean
    printTicket: boolean
    className?: string
}

export default function PrintOptions({ handlePrintOrder, handlePrintTicket, printOrderTicket, printTicket, className }: PrintOptionsProps) {
    return (
        <div className={cn("px-4 pt-2 flex items-center gap-2 [&>label]:font-semibold", className)}>
            <Checkbox
                id="print-order"
                className="mr-1"
                checked={printOrderTicket}
                onCheckedChange={(checked) => {
                    handlePrintOrder(checked === 'indeterminate' ? false : checked)
                    handlePrintTicket(false)
                }}
            />
            <Label htmlFor="print-order">
                Imprimir comanda
            </Label>
            <Checkbox
                id="print-ticket"
                className="mr-1 ml-auto"
                checked={printTicket}
                onCheckedChange={(checked) => {
                    handlePrintTicket(checked === 'indeterminate' ? false : checked)
                    handlePrintOrder(false)
                }}
            />
            <Label htmlFor="print-ticket">
                Imprimir fichas
            </Label>
        </div>
    )
}