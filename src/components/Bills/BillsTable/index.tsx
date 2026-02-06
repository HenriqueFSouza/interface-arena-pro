"use client";

import { Bill, BillRecurrence, BillStatus } from "@/@types/bill";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBills } from "@/hooks/useBills";
import { formatToBRL } from "@/utils/formaters";
import { Ban, Check, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { BillStatusBadge } from "../BillStatusBadge";
import { DeleteBillDialog } from "../DeleteBillDialog";
import { EditBillDialog } from "../EditBillDialog";

interface BillsTableProps {
  bills: Bill[];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

function getRecurrenceLabel(recurrence: BillRecurrence): string | null {
  const labels = {
    [BillRecurrence.NONE]: null,
    [BillRecurrence.WEEKLY]: "Semanal",
    [BillRecurrence.MONTHLY]: "Mensal",
  };
  return labels[recurrence];
}

export function BillsTable({ bills }: BillsTableProps) {
  const { payBill, isPaying, cancelBill, isCancelling } = useBills();

  const handlePayBill = async (bill: Bill) => {
    try {
      await payBill(bill.id);
      const message =
        bill.recurrence !== BillRecurrence.NONE
          ? "Conta paga! Próxima ocorrência criada automaticamente."
          : "Conta marcada como paga!";
      toast.success(message);
    } catch {
      toast.error("Erro ao marcar conta como paga.");
    }
  };

  const handleCancelBill = async (bill: Bill) => {
    try {
      await cancelBill(bill.id);
      toast.success("Conta cancelada!");
    } catch {
      toast.error("Erro ao cancelar conta.");
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recorrência</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell className="font-medium">
                {bill.name}
                {bill.notes && (
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {bill.notes}
                  </p>
                )}
              </TableCell>
              <TableCell>{bill.expense?.name || "-"}</TableCell>
              <TableCell className="font-medium">
                {formatToBRL(bill.amount)}
              </TableCell>
              <TableCell>{formatDate(bill.dueDate)}</TableCell>
              <TableCell>
                <BillStatusBadge status={bill.status} dueDate={bill.dueDate} />
              </TableCell>
              <TableCell>
                {getRecurrenceLabel(bill.recurrence) ? (
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <RefreshCw className="h-3 w-3" />
                    {getRecurrenceLabel(bill.recurrence)}
                  </span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  {bill.status === BillStatus.PENDING && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handlePayBill(bill)}
                              disabled={isPaying}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Marcar como paga</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => handleCancelBill(bill)}
                              disabled={isCancelling}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Cancelar conta</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <EditBillDialog bill={bill} />
                    </>
                  )}

                  <DeleteBillDialog billId={bill.id} billName={bill.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {bills.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhuma conta encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
