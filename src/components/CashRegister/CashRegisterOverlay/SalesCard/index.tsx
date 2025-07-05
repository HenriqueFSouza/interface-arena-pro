import { PaymentMethod } from "@/@types/payment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCashRegisterSales } from "@/hooks/useCashRegisterSales";
import { formatDateTime, formatToBRL } from "@/utils/formaters";
import { getPaymentMethodIcon } from "@/utils/payments";
import { Dot, Loader2 } from "lucide-react";
import EditSalesDialog from "../EditSalesDialog";

export function SalesCard({ cashRegisterId }: { cashRegisterId?: string }) {
    const { cashRegisterSales, isLoading } = useCashRegisterSales(cashRegisterId)

    const calculateTotalAmount = (payments: { paymentMethod: PaymentMethod; amount: string }[]) => {
        return payments.reduce((total, payment) => total + Number(payment.amount), 0);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vendas Realizadas</CardTitle>
                <CardDescription>Pagamentos recebidos</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="size-4 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cashRegisterSales?.map((sale) => (
                            <div key={sale.orderId} className="flex items-center justify-between border-b pb-2">
                                <div className="flex flex-1 gap-2 overflow-hidden">

                                    {/*Edit payment method */}
                                    <EditSalesDialog sale={sale} cashRegisterId={cashRegisterId!} />

                                    <div className="flex flex-col min-w-fit">
                                        <p className="font-medium text-sm">{sale.clientName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDateTime(sale.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 mt-1 no-scrollbar overflow-x-scroll max-w-full">
                                        {sale.payments.map((payment, index) => (
                                            <div key={index} className="flex items-center gap-1">
                                                <Badge key={index} variant="outline" className="text-[11px] p-2">
                                                    <span>{getPaymentMethodIcon(payment.paymentMethod)}</span>
                                                    <Dot className="size-3" />
                                                    <span>{formatToBRL(payment.amount)}</span>
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <span className="font-bold text-green-600 ml-4">
                                    + {formatToBRL(calculateTotalAmount(sale.payments))}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}