import { ReportPeriod } from '@/services/reports';
import { useMemo } from 'react';
import { useSalesReport } from './useSalesReport';

export function useDayOfWeekStats(period: ReportPeriod, startDate?: string, endDate?: string) {
    const { data: salesData, isLoading, error } = useSalesReport(period, startDate, endDate);

    const dayOfWeekStats = useMemo(() => {
        return salesData?.dayOfWeekStats || [];
    }, [salesData]);

    return {
        dayOfWeekStats,
        isLoading,
        error,
    };
} 