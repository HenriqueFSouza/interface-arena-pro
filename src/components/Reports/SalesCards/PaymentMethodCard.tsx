'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentMethodStats } from "@/hooks/reports/usePaymentMethodStats";
import { ReportPeriod } from "@/services/reports";
import { formatToBRL } from "@/utils/formaters";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PaymentMethodCardProps {
    period: ReportPeriod;
}

const paymentMethodLabels = {
    CASH: 'Dinheiro',
    CARD: 'Cartão',
    PIX: 'PIX',
};

export function PaymentMethodCard({ period }: PaymentMethodCardProps) {
    const { paymentMethodStats, isLoading } = usePaymentMethodStats(period);

    const chartData = paymentMethodStats.map(stat => ({
        method: paymentMethodLabels[stat.method],
        totalAmount: stat.totalAmount,
        orderCount: stat.orderCount,
    }));

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vendas por Forma de Pagamento</CardTitle>
                <CardDescription>
                    Total de vendas por método de pagamento
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="method"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => formatToBRL(value)}
                        />
                        <Tooltip
                            formatter={(value: number) => [formatToBRL(value), 'Total']}
                            labelFormatter={(label) => `${label}`}
                        />
                        <Bar
                            dataKey="totalAmount"
                            fill="#1D7D5C"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                {/* Summary below chart */}
                <div className="mt-4 space-y-2">
                    {paymentMethodStats.map((stat) => (
                        <div key={stat.method} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                                {paymentMethodLabels[stat.method]}
                            </span>
                            <div className="flex gap-4">
                                <span>{stat.orderCount} pedidos</span>
                                <span className="font-medium">{formatToBRL(stat.totalAmount)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 