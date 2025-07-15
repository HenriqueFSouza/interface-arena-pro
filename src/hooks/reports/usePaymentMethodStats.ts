import { ReportPeriod } from '@/services/reports';
import { useMemo } from 'react';
import { useSalesReport } from './useSalesReport';

export function usePaymentMethodStats(period: ReportPeriod, startDate?: string, endDate?: string) {
    const { data: salesData, isLoading, error } = useSalesReport(period, startDate, endDate);

    const paymentMethodStats = useMemo(() => {
        return salesData?.paymentMethodStats || [];
    }, [salesData]);

    return {
        paymentMethodStats,
        isLoading,
        error,
    };
} 