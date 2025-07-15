'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDayOfWeekStats } from "@/hooks/reports/useDayOfWeekStats";
import { ReportPeriod } from "@/services/reports";
import { formatDayOfWeek, formatToBRL } from "@/utils/formaters";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DayOfWeekCardProps {
    period: ReportPeriod;
}

const dayLabels = {
    'Sunday': 'Dom',
    'Monday': 'Seg',
    'Tuesday': 'Ter',
    'Wednesday': 'Qua',
    'Thursday': 'Qui',
    'Friday': 'Sex',
    'Saturday': 'Sáb',
};

export function DayOfWeekCard({ period }: DayOfWeekCardProps) {
    const { dayOfWeekStats, isLoading } = useDayOfWeekStats(period);

    const chartData = dayOfWeekStats.map(stat => ({
        day: dayLabels[stat.dayOfWeek as keyof typeof dayLabels] || stat.dayOfWeek,
        averageSales: stat.averageSales,
        orderCount: stat.orderCount,
        dayOccurrences: stat.dayOccurrences,
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
    console.log({
        chartData: chartData.reduce((best, current) =>
            current.averageSales > best.averageSales ? current : best
        ).day
    });
    return (
        <Card>
            <CardHeader>
                <CardTitle>Vendas por Dia da Semana</CardTitle>
                <CardDescription>
                    Média de vendas por dia da semana no período
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => formatToBRL(value)}
                        />
                        <Tooltip
                            formatter={(value: number, name: string, props: any) => [
                                formatToBRL(value),
                                `Média por ${props.payload.day} (${props.payload.dayOccurrences} dias)`
                            ]}
                            labelFormatter={(label) => `${label}`}
                        />
                        <Bar
                            dataKey="averageSales"
                            fill="#24946E"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                {/* Best performing day */}
                {chartData.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Melhor dia da semana</div>
                        <div className="font-medium">
                            {formatDayOfWeek(chartData.reduce((best, current) =>
                                current.averageSales > best.averageSales ? current : best
                            ).day)} - {formatToBRL(
                                chartData.reduce((best, current) =>
                                    current.averageSales > best.averageSales ? current : best
                                ).averageSales
                            )} por dia
                        </div>
                    </div>
                )}

                {/* Additional info */}
                <div className="mt-2 text-xs text-muted-foreground">
                    * Valores são a média de vendas por ocorrência de cada dia da semana no período selecionado
                </div>
            </CardContent>
        </Card>
    );
} 