"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, AlertTriangle } from "lucide-react"

interface CategoryDeleteModalProps {
    categoryId: string
    categoryName: string
    hasProducts: boolean
    isOpen: boolean
    onClose: () => void
    onDelete: (id: string) => void
}

export default function CategoryDeleteModal({
    categoryId,
    categoryName,
    hasProducts,
    isOpen,
    onClose,
    onDelete,
}: CategoryDeleteModalProps) {
    const handleDelete = () => {
        if (!hasProducts) {
            onDelete(categoryId)
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {hasProducts ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        )}
                        {hasProducts ? "Não é possível excluir" : "Confirmar exclusão"}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="py-4 text-center text-base leading-8">
                    {hasProducts ? (
                        <>
                            A categoria <span className="font-bold block">{categoryName}</span> possui produtos associados.
                            Remova todos os produtos desta categoria antes de excluí-la.
                        </>
                    ) : (
                        <>
                            Tem certeza que deseja excluir a categoria: <span className="font-bold block">{categoryName}</span>
                            Esta ação não pode ser desfeita.
                        </>
                    )}
                </DialogDescription>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        {hasProducts ? "Entendi" : "Cancelar"}
                    </Button>

                    {!hasProducts && (
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 