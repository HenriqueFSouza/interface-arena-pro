import { api } from "@/lib/api";

export type ReportPeriod = "current" | "month" | "3months" | "6months" | "year";

export interface SalesReportData {
  monthlyStats: Array<{
    month: string;
    totalSales: number;
    totalOrders: number;
  }>;
  paymentMethodStats: Array<{
    method: "CASH" | "CARD" | "PIX";
    totalAmount: number;
    orderCount: number;
  }>;
  dayOfWeekStats: Array<{
    dayOfWeek: string;
    averageSales: number;
    orderCount: number;
    dayOccurrences: number;
  }>;
  topProducts: Array<{
    productId: string;
    imageUrl?: string;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
  totalOrders: number;
  totalProfit: number;
  averageOrderValue: number;
}

export interface SoldProduct {
  productId: string;
  productName: string;
  imageUrl?: string;
  quantitySold: number;
  price: number;
  productCost: number;
  revenue: number;
  profit: number;
}

export interface SoldProductsResponse {
  products: SoldProduct[];
  totalProducts: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export const reportsService = {
  async getSalesReport(
    period: ReportPeriod,
    startDate?: string,
    endDate?: string
  ): Promise<SalesReportData> {
    const params = new URLSearchParams({ period });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await api.get(`/reports/sales?${params.toString()}`);
    return response.data;
  },

  async getSoldProducts(
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 20
  ): Promise<SoldProductsResponse> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(
      `/reports/sold-products?${params.toString()}`
    );
    return response.data;
  },

  async downloadSoldProductsPdf(
    startDate: string,
    endDate: string
  ): Promise<void> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    try {
      const response = await api.get(
        `/reports/sold-products/pdf?${params.toString()}`,
        {
          responseType: "blob",
          timeout: 120000, // 2 minutes timeout for PDF generation
        }
      );

      // Check if response is actually a PDF
      if (
        response.data.type &&
        response.data.type.includes("application/json")
      ) {
        // If we got JSON instead of PDF, it's likely an error response
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result as string);
            throw new Error(errorData.error || "Erro desconhecido");
          } catch (parseError) {
            throw new Error("Erro ao processar resposta do servidor");
          }
        };
        reader.readAsText(response.data);
        return;
      }

      // Validate PDF content
      if (!response.data || response.data.size === 0) {
        throw new Error("PDF gerado está vazio");
      }

      // Create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create temporary download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `produtos-vendidos-${startDate}-${endDate}.pdf`;
      link.style.display = "none";

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup with delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error: any) {
      console.error("Error downloading PDF:", error);

      // Handle different types of errors
      if (error.response?.status === 404) {
        throw new Error("Nenhum produto encontrado para o período selecionado");
      } else if (error.response?.status === 400) {
        throw new Error("Período de datas inválido");
      } else if (error.response?.status >= 500) {
        throw new Error(
          "Erro interno do servidor. Tente novamente em alguns momentos."
        );
      } else if (
        error.code === "ECONNABORTED" ||
        error.message.includes("timeout")
      ) {
        throw new Error(
          "Tempo limite excedido. O relatório pode estar muito grande. Tente um período menor."
        );
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "Erro ao baixar o PDF. Verifique sua conexão e tente novamente."
        );
      }
    }
  },
};
