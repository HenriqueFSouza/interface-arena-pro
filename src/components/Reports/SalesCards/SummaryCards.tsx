'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSalesReport } from "@/hooks/reports/useSalesReport";
import { ReportPeriod } from "@/services/reports";
import { formatToBRL } from "@/utils/formaters";
import { DollarSign, Package, TrendingUp } from "lucide-react";

interface SummaryCardsProps {
    period: ReportPeriod;
}

export function SummaryCards({ period }: SummaryCardsProps) {
    const { data, isLoading } = useSalesReport(period);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Total de Pedidos",
            value: data?.totalOrders || 0,
            icon: Package,
            formatter: (value: number) => value.toString(),
        },
        {
            title: "Faturamento Total",
            value: data?.totalProfit || 0,
            icon: TrendingUp,
            formatter: formatToBRL,
        },
        {
            title: "Ticket Médio",
            value: data?.averageOrderValue || 0,
            icon: DollarSign,
            formatter: formatToBRL,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {card.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {card.formatter(card.value)}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
} 