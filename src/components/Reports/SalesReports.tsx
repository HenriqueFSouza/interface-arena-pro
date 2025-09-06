"use client";

import { ReportPeriod } from "@/services/reports";
import { useState } from "react";
import { DayOfWeekCard } from "./SalesCards/DayOfWeekCard";
import { PaymentMethodCard } from "./SalesCards/PaymentMethodCard";
import { SoldProductsCard } from "./SalesCards/SoldProductsCard";
import { SummaryCards } from "./SalesCards/SummaryCards";
import { SalesChart } from "./SalesChart";
import { PeriodSelector } from "./SalesChart/PeriodSelector";

export function SalesReports() {
  const [period, setPeriod] = useState<ReportPeriod>("current");

  return (
    <div className="space-y-6">
      {/* Line Chart */}
      <SalesChart />

      <div className="flex justify-end">
        <PeriodSelector value={period} onChange={setPeriod} isCards />
      </div>

      {/* Summary Cards Row */}
      <SummaryCards period={period} />

      {/* Analytics Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodCard period={period} />
        <DayOfWeekCard period={period} />
      </div>

      {/* Sold Products */}
      <SoldProductsCard />
    </div>
  );
}
