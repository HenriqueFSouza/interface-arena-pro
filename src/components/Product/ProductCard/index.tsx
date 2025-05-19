import type { Product } from "@/@types/product"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useSalesStore } from "@/stores/sales-store"
import { formatToBRL } from "@/utils/formaters"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import DeleteDialog from "../DeleteDialog"

interface ProductCardProps {
    product: Product
    className?: string
    isEditable?: boolean
    onDelete?: () => void
    onSelect?: () => void
}

export default function ProductCard({ product, onDelete, className, isEditable, onSelect }: ProductCardProps) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const { newCartItems } = useSalesStore()

    const handleEdit = () => {
        isEditable && router.push(`/products/${product.id}`)
    }

    const isProductSelectedInNewItems = useMemo(() => newCartItems.find(item => item.product.id === product.id), [newCartItems, product.id])

    return (
        <div className="relative">
            {/* New Item Quantity Counter Badge */}
            {isProductSelectedInNewItems && onSelect && (
                <Badge className="absolute -top-1 -right-2 z-50 bg-blue-500 hover:bg-blue-600 px-2">{
                    isProductSelectedInNewItems.quantity
                }</Badge>
            )}

            {/* Card */}
            <Card className={cn(
                "relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 z-10",
                className
            )}
                onClick={onSelect}
            >
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
            </Card>
            {onDelete && (
                <DeleteDialog product={product} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onDelete={onDelete} />
            )}
        </div>
    )
}
