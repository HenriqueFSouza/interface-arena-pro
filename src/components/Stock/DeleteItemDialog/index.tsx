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
import { useStock } from "@/hooks/useStock"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

interface DeleteItemDialogProps {
    itemId: string
    itemName: string
}

export function DeleteItemDialog({ itemId, itemName }: DeleteItemDialogProps) {
    const [open, setOpen] = useState(false)
    const { removeItem } = useStock()

    const handleDelete = () => {
        removeItem(itemId, {
            onSuccess: () => {
                setOpen(false)
                toast.success("Item excluído com sucesso!")
            },
            onError: () => {
                toast.error("Erro ao excluir item!")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                    <Trash2 className="size-4 text-destructive" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar exclusão</DialogTitle>
                    <DialogDescription>
                        Você tem certeza que deseja excluir o item <strong>&quot;{itemName}&quot;</strong>? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
