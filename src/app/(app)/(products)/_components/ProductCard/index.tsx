import type { Product } from "@/@types/product"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-square relative">
                <Image
                    src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>
            <CardHeader className="p-4">
                <h3 className="font-medium">{product.name}</h3>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between">
                <p className="font-bold">${Number(product.price).toFixed(2)}</p>
                {/* <p className="text-sm text-muted-foreground">{product.category}</p> */}
            </CardFooter>
        </Card>
    )
}
