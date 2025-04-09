import type { Product } from "@/@types/product"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatToBRL } from "@/utils/currency-formaters"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import DeleteDialog from "../DeleteDialog"

interface ProductCardProps {
    product: Product
    onDelete?: () => void
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleEdit = () => {
        router.push(`/products/${product.id}`)
    }

    return (
        <>
            <Card className="w-fit overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative">
                <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-7 p-0 bg-white/80 backdrop-blur-sm">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEdit}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div
                    className="h-28 aspect-square relative cursor-pointer"
                    onClick={handleEdit}
                >
                    <Image
                        src='https://piaapkoirennmamfzhzp.supabase.co/storage/v1/object/public/images/r_qhVy7tkpNn6WYrhrSck/IMG_0966-n7j.jpeg'
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <CardFooter className="p-2 flex flex-col items-start cursor-pointer overflow-hidden" onClick={handleEdit}>
                    <h3 className="text-sm">{product.name}</h3>

                    <p className="text-sm font-bold">{formatToBRL(product.price)}</p>
                    {/* <p className="text-sm text-muted-foreground">{product.category}</p> */}
                </CardFooter>
            </Card>

            <DeleteDialog product={product} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onDelete={onDelete} />
        </>
    )
}
