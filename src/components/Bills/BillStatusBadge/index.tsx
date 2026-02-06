"use client";

import { BillStatus } from "@/@types/bill";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BillStatusBadgeProps {
  status: BillStatus;
  dueDate: string;
}

export function BillStatusBadge({ status, dueDate }: BillStatusBadgeProps) {
  const isOverdue =
    status === BillStatus.PENDING && new Date(dueDate) < new Date();

  if (isOverdue) {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
        Vencida
      </Badge>
    );
  }

  const statusConfig = {
    [BillStatus.PENDING]: {
      label: "Pendente",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    },
    [BillStatus.PAID]: {
      label: "Paga",
      className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
    [BillStatus.CANCELLED]: {
      label: "Cancelada",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
    },
  };

  const config = statusConfig[status];

  return <Badge className={cn(config.className)}>{config.label}</Badge>;
}
