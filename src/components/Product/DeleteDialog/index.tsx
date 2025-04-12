import { Product } from "@/@types/product";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { productService } from "@/services/product";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";


export default function DeleteDialog({ product, open, onOpenChange, onDelete }: { product: Product, open: boolean, onOpenChange: (open: boolean) => void, onDelete?: () => void }) {


    const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
        mutationFn: () => productService.deleteProduct(product.id),
        onSuccess: () => {
            toast.success("Produto excluído com sucesso")
            onDelete?.()
            onOpenChange(false)
        },
        onError: () => {
            toast.error("Erro ao excluir produto. Tente novamente.")
        }
    })

    const handleDelete = () => {
        deleteProduct()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir produto</DialogTitle>
                    <DialogDescription className="py-4 text-md text-center text-muted-foreground leading-6">
                        Tem certeza que deseja excluir o produto
                        <span className="font-bold block">{product.name}?</span>
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Excluindo..." : "Excluir"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
