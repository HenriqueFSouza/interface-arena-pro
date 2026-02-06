"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useBills } from "@/hooks/useBills";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface DeleteBillDialogProps {
  billId: string;
  billName: string;
}

export function DeleteBillDialog({ billId, billName }: DeleteBillDialogProps) {
  const [open, setOpen] = useState(false);
  const { deleteBill, isDeleting } = useBills();

  async function handleDelete() {
    try {
      await deleteBill(billId);
      toast.success("Conta excluída com sucesso!");
      setOpen(false);
    } catch {
      toast.error("Erro ao excluir conta. Tente novamente.");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir conta</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a conta &ldquo;{billName}&rdquo;? Esta ação
            não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
