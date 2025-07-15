'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useSalesReport } from "@/hooks/reports/useSalesReport";
import { ReportPeriod } from "@/services/reports";
import { formatToBRL } from "@/utils/formaters";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PeriodSelector } from "./PeriodSelector";

export function SalesChart() {
    const [period, setPeriod] = useState<ReportPeriod>('3months');
    const { data, isLoading, error } = useSalesReport(period);

    const formatMonthLabel = (month: string) => {
        const date = new Date(month + '-02');
        return date.toLocaleDateString('pt-BR', {
            month: 'short',
            year: 'numeric'
        });
    };

    const chartData = data?.monthlyStats.map(stat => ({
        ...stat,
        monthLabel: formatMonthLabel(stat.month),
    })) || [];

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Vendas por Período</CardTitle>
                    <CardDescription>Erro ao carregar dados de vendas</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Vendas por Período</CardTitle>
                    <CardDescription>
                        Acompanhe o desempenho das suas vendas ao longo do tempo
                    </CardDescription>
                </div>
                <PeriodSelector value={period} onChange={setPeriod} />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <Spinner />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="monthLabel"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => formatToBRL(value)}
                            />
                            <Tooltip
                                formatter={(value: number) => [formatToBRL(value), 'Vendas']}
                                labelFormatter={(label) => `Período: ${label}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalSales"
                                stroke="#1D7D5C"
                                strokeWidth={2}
                                dot={{ fill: '#1D7D5C', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#1D7D5C', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
} 