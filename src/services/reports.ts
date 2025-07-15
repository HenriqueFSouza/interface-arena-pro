import { api } from '@/lib/api';

export type ReportPeriod = 'current' | 'month' | '3months' | '6months' | 'year';

export interface SalesReportData {
    monthlyStats: Array<{
        month: string;
        totalSales: number;
        totalOrders: number;
    }>;
    paymentMethodStats: Array<{
        method: 'CASH' | 'CARD' | 'PIX';
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

export const reportsService = {
    async getSalesReport(period: ReportPeriod, startDate?: string, endDate?: string): Promise<SalesReportData> {
        const params = new URLSearchParams({ period });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await api.get(`/reports/sales?${params.toString()}`);
        return response.data;
    }
}; 