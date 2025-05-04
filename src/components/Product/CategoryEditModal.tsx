"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

interface CategoryEditModalProps {
    categoryId: string
    categoryName: string
    isOpen: boolean
    onClose: () => void
    onEdit: (id: string, name: string) => void
}

export default function CategoryEditModal({
    categoryId,
    categoryName,
    isOpen,
    onClose,
    onEdit,
}: CategoryEditModalProps) {
    const [name, setName] = useState(categoryName)

    // Reset name when modal opens with a new category
    useEffect(() => {
        setName(categoryName)
    }, [categoryName, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error("Nome da categoria é obrigatório")
            return
        }

        onEdit(categoryId, name.trim())
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder="Nome da categoria"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 