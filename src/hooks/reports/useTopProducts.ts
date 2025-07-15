import { ReportPeriod } from '@/services/reports';
import { useMemo } from 'react';
import { useSalesReport } from './useSalesReport';

export function useTopProducts(period: ReportPeriod, startDate?: string, endDate?: string) {
    const { data: salesData, isLoading, error } = useSalesReport(period, startDate, endDate);

    const topProducts = useMemo(() => {
        return salesData?.topProducts || [];
    }, [salesData]);

    return {
        topProducts,
        isLoading,
        error,
    };
} 