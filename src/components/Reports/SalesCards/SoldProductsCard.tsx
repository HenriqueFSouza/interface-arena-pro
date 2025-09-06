"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSoldProducts } from "@/hooks/reports/useSoldProducts";
import { cn } from "@/lib/utils";
import { reportsService } from "@/services/reports";
import { formatToBRL } from "@/utils/formaters";
import { CalendarIcon, Download, Loader2, Package } from "lucide-react";
import { memo, useMemo, useState } from "react";
import toast from "react-hot-toast";

// Helper function to get last week's dates
function getLastWeekDates() {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const startDate = lastWeek.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  return { startDate, endDate };
}

// Memoized product image component for performance
const ProductImage = memo(
  ({ imageUrl, productName }: { imageUrl?: string; productName: string }) => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={productName}
          className="h-10 w-10 rounded object-cover"
          loading="lazy"
        />
      );
    }

    return (
      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
        <Package className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }
);

ProductImage.displayName = "ProductImage";

// Memoized table skeleton for loading state
const TableSkeleton = memo(() => (
  <div className="border rounded-md overflow-hidden">
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[280px] w-[300px]">Produto</TableHead>
            <TableHead className="text-center min-w-[100px]">
              Qtd. Vendida
            </TableHead>
            <TableHead className="text-right min-w-[100px]">Preço</TableHead>
            <TableHead className="text-right min-w-[100px]">Custo</TableHead>
            <TableHead className="text-right min-w-[100px]">Receita</TableHead>
            <TableHead className="text-right min-w-[120px]">
              Lucro Líquido
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-16 mx-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
));

TableSkeleton.displayName = "TableSkeleton";

export function SoldProductsCard() {
  const { startDate: defaultStartDate, endDate: defaultEndDate } =
    getLastWeekDates();

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [localStartDate, setLocalStartDate] = useState(defaultStartDate);
  const [localEndDate, setLocalEndDate] = useState(defaultEndDate);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const {
    products,
    totalProducts,
    hasNextPage,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
  } = useSoldProducts({ startDate, endDate });

  // Apply date filter when inputs change
  const handleDateChange = () => {
    if (localStartDate && localEndDate) {
      setStartDate(localStartDate);
      setEndDate(localEndDate);
    }
  };

  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!localStartDate || !localEndDate) {
      toast.error("Por favor, selecione um período válido");
      return;
    }

    // Validate date range
    const startDateObj = new Date(localStartDate);
    const endDateObj = new Date(localEndDate);

    if (startDateObj > endDateObj) {
      toast.error("A data inicial não pode ser maior que a data final");
      return;
    }

    // Check if date range is too large (more than 1 year)
    const daysDifference =
      Math.abs(endDateObj.getTime() - startDateObj.getTime()) /
      (1000 * 3600 * 24);
    if (daysDifference > 365) {
      const confirmLargeRange = confirm(
        "O período selecionado é muito grande (mais de 1 ano). Isso pode resultar em um arquivo PDF muito grande e tempo de processamento longo. Deseja continuar?"
      );
      if (!confirmLargeRange) {
        return;
      }
    }

    setIsGeneratingPdf(true);
    try {
      await reportsService.downloadSoldProductsPdf(
        localStartDate,
        localEndDate
      );

      // Optional success feedback (you can remove this if you prefer silent download)
      // toast.success("PDF gerado com sucesso!");
    } catch (error: any) {
      console.error("Error downloading PDF:", error);

      // Show user-friendly error message
      const errorMessage =
        error.message || "Erro ao gerar o PDF. Tente novamente.";
      alert(errorMessage);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Memoize summary calculations for performance
  const summaryData = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
    const totalProfit = products.reduce((sum, p) => sum + p.profit, 0);
    const totalQuantitySold = products.reduce(
      (sum, p) => sum + p.quantitySold,
      0
    );

    return {
      totalRevenue,
      totalProfit,
      totalQuantitySold,
      isProfitable: totalProfit >= 0,
    };
  }, [products]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produtos Vendidos</CardTitle>
          <CardDescription>
            Análise detalhada de produtos vendidos com custos e lucros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-8">
            Erro ao carregar dados. Tente novamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Vendidos</CardTitle>
        <CardDescription>
          Análise detalhada de produtos vendidos com custos e lucros
        </CardDescription>

        {/* Date Range Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Data Inicial
            </Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <Label htmlFor="endDate" className="text-sm font-medium">
              Data Final
            </Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={handleDateChange}
              variant="outline"
              disabled={!localStartDate || !localEndDate}
              className="w-full sm:w-auto"
            >
              Aplicar
            </Button>
            <Button
              onClick={handleDownloadPdf}
              variant="default"
              disabled={
                !localStartDate || !localEndDate || isGeneratingPdf || isLoading
              }
              className="w-full sm:w-auto"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <div>Nenhum produto vendido no período selecionado</div>
          </div>
        ) : (
          <>
            {/* Products Table */}
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[280px] w-[300px]">
                        Produto
                      </TableHead>
                      <TableHead className="text-center min-w-[100px]">
                        Qtd. Vendida
                      </TableHead>
                      <TableHead className="text-right min-w-[100px]">
                        Preço
                      </TableHead>
                      <TableHead className="text-right min-w-[100px]">
                        Custo
                      </TableHead>
                      <TableHead className="text-right min-w-[100px]">
                        Receita
                      </TableHead>
                      <TableHead className="text-right min-w-[120px]">
                        Lucro Líquido
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.productId}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ProductImage
                              imageUrl={product.imageUrl}
                              productName={product.productName}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">
                                {product.productName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {product.quantitySold}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatToBRL(product.price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatToBRL(product.productCost)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          {formatToBRL(product.revenue)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "font-semibold",
                              product.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            {formatToBRL(product.profit)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  disabled={isLoadingMore}
                  className="min-w-[200px]"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    "Carregar mais produtos"
                  )}
                </Button>
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 pt-6 border-t bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Total de Produtos
                  </div>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Qtd. Total Vendida
                  </div>
                  <div className="text-2xl font-bold">
                    {summaryData.totalQuantitySold}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Receita Total
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {formatToBRL(summaryData.totalRevenue)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Lucro Total
                  </div>
                  <div
                    className={cn(
                      "text-xl font-bold",
                      summaryData.isProfitable
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {formatToBRL(summaryData.totalProfit)}
                  </div>
                </div>
              </div>

              {/* Additional info */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Exibindo {products.length} de {totalProducts} produtos
                {hasNextPage && " • Clique em 'Carregar mais' para ver todos"}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
