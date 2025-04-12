import type { Product } from "@/@types/product"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatToBRL } from "@/utils/currency-formaters"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { JSX, useState } from "react"
import DeleteDialog from "../DeleteDialog"

interface ProductCardProps {
    product: Product
    button?: JSX.Element
    className?: string
    isEditable?: boolean
    onDelete?: () => void
}

export default function ProductCard({ product, button, onDelete, className, isEditable }: ProductCardProps) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleEdit = () => {
        isEditable && router.push(`/products/${product.id}`)
    }

    return (
        <>
            <Card className={cn(
                "overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative",
                className
            )}>
                {onDelete && isEditable && (
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
                )}
                <div
                    className={cn("aspect-square relative", isEditable && "cursor-pointer")}
                    onClick={handleEdit}
                >
                    <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover"
                        fill
                    />
                </div>
                <CardFooter
                    className={cn("p-2 flex flex-col items-start cursor-pointer overflow-hidden", isEditable && "cursor-pointer")}
                    onClick={handleEdit}
                >
                    <h3 className="text-sm">{product.name}</h3>

                    <p className="text-sm font-bold">{formatToBRL(product.price)}</p>
                    {/* <p className="text-sm text-muted-foreground">{product.category}</p> */}
                </CardFooter>
                {button && (
                    <CardFooter className="p-2">
                        {button}
                    </CardFooter>
                )}
            </Card>
            {onDelete && (
                <DeleteDialog product={product} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onDelete={onDelete} />
            )}
        </>
    )
}
