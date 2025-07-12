"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useDeleteOrderMutation } from "@/hooks/orders/useDeleteOrderMutation"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface DeleteOrderDialogProps {
    orderId: string
    clientName: string
    onSuccess?: () => void
}

export default function DeleteOrderDialog({ orderId, clientName, onSuccess }: DeleteOrderDialogProps) {
    const [open, setOpen] = useState(false)
    const { deleteOrder, isPending } = useDeleteOrderMutation()

    const handleDelete = () => {
        deleteOrder(orderId)
        setOpen(false)
        if (onSuccess) onSuccess()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full mt-2 border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir comanda
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir comanda</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir a comanda de <strong>{clientName}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground pt-2">
                    Esta ação não pode ser desfeita. Todos os itens e pagamentos associados a esta comanda serão excluídos permanentemente.
                </p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Excluindo..." : "Excluir comanda"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 