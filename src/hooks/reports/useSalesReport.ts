import { ReportPeriod, reportsService } from '@/services/reports';
import { useQuery } from '@tanstack/react-query';

export const SALES_REPORT_QUERY_KEY = 'sales-report';

export function useSalesReport(period: ReportPeriod, startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: [SALES_REPORT_QUERY_KEY, period, startDate, endDate],
        queryFn: () => reportsService.getSalesReport(period, startDate, endDate),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
} 