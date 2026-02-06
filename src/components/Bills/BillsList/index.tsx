"use client";

import { BillFilters as BillFiltersType, BillStatus } from "@/@types/bill";
import { useBills } from "@/hooks/useBills";
import { formatToBRL } from "@/utils/formaters";
import { useState } from "react";
import { BillFilters } from "../BillFilters";
import { BillsTable } from "../BillsTable";
import { BillsTableSkeleton } from "../BillsTableSkeleton";

export function BillsList() {
  const [filters, setFilters] = useState<BillFiltersType>({});
  const { bills, isLoading } = useBills(filters);

  if (isLoading) {
    return (
      <>
        <BillFilters filters={filters} onFiltersChange={setFilters} />
        <BillsTableSkeleton />
      </>
    );
  }

  const pendingBills = bills.filter((bill) => bill.status === BillStatus.PENDING);
  const totalPending = pendingBills.reduce(
    (sum, bill) => sum + Number(bill.amount),
    0
  );

  const overdueBills = pendingBills.filter(
    (bill) => new Date(bill.dueDate) < new Date()
  );
  const totalOverdue = overdueBills.reduce(
    (sum, bill) => sum + Number(bill.amount),
    0
  );

  return (
    <div className="flex flex-col gap-4">
      <BillFilters filters={filters} onFiltersChange={setFilters} />

      <div className="flex gap-6 text-sm">
        <p className="text-muted-foreground">
          Total pendente:{" "}
          <strong className="text-neutral-900 font-bold text-base">
            {formatToBRL(totalPending)}
          </strong>
        </p>
        {totalOverdue > 0 && (
          <p className="text-muted-foreground">
            Total vencido:{" "}
            <strong className="text-red-600 font-bold text-base">
              {formatToBRL(totalOverdue)}
            </strong>
          </p>
        )}
      </div>

      <BillsTable bills={bills} />
    </div>
  );
}
