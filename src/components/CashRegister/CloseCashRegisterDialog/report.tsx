import { PaymentMethod } from "@/@types/payment"
import { Button } from "@/components/ui/button"
import { usePrinter } from "@/hooks/usePrinter"
import { useCashRegisterStore } from "@/stores/cash-register-store"
import { formatDateTime, formatToBRL } from "@/utils/formaters"
import { ReceiptTemplates } from "@/utils/printerUtils"
import { Download, Printer } from "lucide-react"

export function CloseCashRegisterReport() {
    const { currentCashRegister, getCashAmount, getCardAmount, getPixAmount, getTotalSold } = useCashRegisterStore()
    const { printCashRegisterReport, isPrinting } = usePrinter()

    const registeredPayments = currentCashRegister?.registeredPayments
    const cashRegisteredPayments = registeredPayments?.filter((payment) => payment.paymentMethod === PaymentMethod.CASH).reduce((acc, payment) => acc + payment.amount, 0) || 0
    const cardRegisteredPayments = registeredPayments?.filter((payment) => payment.paymentMethod === PaymentMethod.CARD).reduce((acc, payment) => acc + payment.amount, 0) || 0
    const pixRegisteredPayments = registeredPayments?.filter((payment) => payment.paymentMethod === PaymentMethod.PIX).reduce((acc, payment) => acc + payment.amount, 0) || 0

    if (!currentCashRegister) return null

    const renderPaymentMethodRow = (method: PaymentMethod, systemAmount: number, registeredAmount: number) => {
        const difference = registeredAmount - systemAmount;
        const methodName = method === PaymentMethod.CASH ? "Dinheiro" : method === PaymentMethod.CARD ? "Cartão" : "PIX";

        return (
            <div key={method} className="grid grid-cols-[1fr,repeat(3,100px)] gap-4 items-center">
                <div className="font-medium">{methodName}</div>
                <div className="text-right">{formatToBRL(systemAmount)}</div>
                <div className="text-right">{formatToBRL(registeredAmount)}</div>
                <div className={`text-right font-medium ${difference === 0 ? 'text-gray-600' : difference > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatToBRL(difference)}
                </div>
            </div>
        );
    };

    const totalSystemAmount = getTotalSold();
    const totalRegisteredAmount = cashRegisteredPayments + cardRegisteredPayments + pixRegisteredPayments;
    const totalDifference = totalRegisteredAmount - totalSystemAmount;

    const receiptHTML = ReceiptTemplates.cashRegisterReport({
        createdAt: currentCashRegister.createdAt,
        openedAmount: currentCashRegister.openedAmount,
        cashRegisteredPayments,
        cashSystemAmount: getCashAmount(),
        cardRegisteredPayments,
        cardSystemAmount: getCardAmount(),
        pixRegisteredPayments,
        pixSystemAmount: getPixAmount(),
        totalSystemAmount,
        totalRegisteredAmount,
        totalDifference,
    })
    const handlePrint = async (download?: boolean) => {
        try {
            await printCashRegisterReport(receiptHTML, { shouldCallFallback: true, download });
            console.log('Cash register report printed successfully');
        } catch (error) {
            console.error('Failed to print cash register report:', error);
        }
    }

    return (
        <div className="relative space-y-6">
            <div className="mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="font-medium">Abertura:</span>
                        <span className="ml-2">{formatDateTime(currentCashRegister.createdAt)}</span>
                    </div>
                    <div>
                        <span className="font-medium">Valor Inicial:</span>
                        <span className="ml-2">{formatToBRL(currentCashRegister.openedAmount)}</span>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
                <div className="grid grid-cols-[1fr,repeat(3,100px)] gap-4 mb-4 text-sm">
                    <div />
                    <div className="text-right font-semibold">Sistema</div>
                    <div className="text-right font-semibold">Registrado</div>
                    <div className="text-right font-semibold">Diferença</div>
                </div>

                <div className="space-y-4">
                    {renderPaymentMethodRow(PaymentMethod.CASH, getCashAmount(), cashRegisteredPayments)}
                    {renderPaymentMethodRow(PaymentMethod.CARD, getCardAmount(), cardRegisteredPayments)}
                    {renderPaymentMethodRow(PaymentMethod.PIX, getPixAmount(), pixRegisteredPayments)}
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="grid grid-cols-[1fr,repeat(3,100px)] gap-4 items-center">
                    <div className="font-semibold">Total</div>
                    <div className="text-right">{formatToBRL(totalSystemAmount)}</div>
                    <div className="text-right">{formatToBRL(totalRegisteredAmount)}</div>
                    <div className={`text-right font-semibold ${totalDifference === 0 ? 'text-gray-600' : totalDifference > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {formatToBRL(totalDifference)}
                    </div>
                </div>
            </div>

            <Button
                type="button"
                onClick={() => handlePrint()}
                className="w-full"
                variant="outline"
                disabled={isPrinting}
            >
                <Printer className="h-4 w-4 mr-2" />
                {isPrinting ? 'Imprimindo...' : 'Imprimir Relatório'}
            </Button>
            <Button
                type="button"
                onClick={() => handlePrint(true)}
                className="w-full"
                disabled={isPrinting}
            >
                <Download className="h-4 w-4 mr-2" />
                {isPrinting ? 'Salvando...' : 'Salvar Relatório'}
            </Button>
        </div>
    )
}

