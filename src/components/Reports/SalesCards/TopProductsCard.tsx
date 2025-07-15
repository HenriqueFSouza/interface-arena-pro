'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopProducts } from "@/hooks/reports/useTopProducts";
import { cn } from "@/lib/utils";
import { ReportPeriod } from "@/services/reports";
import { formatToBRL } from "@/utils/formaters";
import { TrendingUp } from "lucide-react";

interface TopProductsCardProps {
    period: ReportPeriod;
}

export function TopProductsCard({ period }: TopProductsCardProps) {
    const { topProducts, isLoading } = useTopProducts(period);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 rounded" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="text-right space-y-1">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (topProducts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
                    <CardDescription>
                        Produtos com maior volume de vendas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        Nenhum produto vendido no período selecionado
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
                <CardDescription>
                    Produtos com maior volume de vendas
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {topProducts.map((product, index) => (
                        <div key={product.productId} className={cn("flex items-center justify-between border-b border-border pb-2",
                            index === topProducts.length - 1 && "border-b-0")}>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center font-medium">
                                    {index + 1}º
                                </div>
                                <div className="flex items-center gap-2">
                                    {product.imageUrl && (
                                        <img src={product.imageUrl} alt={product.productName} className="size-10 rounded-full" />
                                    )}
                                    <div className="font-medium">{product.productName}</div>
                                    <div className="text-muted-foreground">
                                        {product.totalSold} unidades
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-normal text-lg">
                                    {formatToBRL(product.revenue)}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    Receita
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total vendido</span>
                        <span className="font-medium">
                            {topProducts.reduce((sum, product) => sum + product.totalSold, 0)} unidades
                        </span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-muted-foreground">Receita total</span>
                        <span className="font-bold text-xl">
                            {formatToBRL(topProducts.reduce((sum, product) => sum + product.revenue, 0))}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 