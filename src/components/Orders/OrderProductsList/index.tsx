"use client"

import { Input } from "@/components/ui/input"
import { useProducts } from "@/hooks/useProducts"
import { useSalesStore } from "@/lib/sales-store"
import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import ProductCard from "../../Product/ProductCard"
import { Button } from "../../ui/button"
interface OrderProductsListProps {
  categoryOverride?: string | null;
}

export default function OrderProductsList({ categoryOverride }: OrderProductsListProps = {}) {
  const { selectedCategory, addToCart } = useSalesStore()
  const [inputValue, setInputValue] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Use effect to handle the debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Use categoryOverride if provided, otherwise use selectedCategory from store
  const effectiveCategory = categoryOverride !== undefined ? categoryOverride : selectedCategory

  const { products, isLoading } = useProducts({
    categoryId: effectiveCategory,
    search: searchQuery || undefined
  })

  if (isLoading) {
    return <div className="text-center py-12">Loading products...</div>
  }


  return (
    <div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          autoFocus
          placeholder="Pesquisar produtos..."
          className="pl-10"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhum produto encontrado. Tente alterar seus filtros.</div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {products.map((product) => (
            <ProductCard
              className="w-40"
              key={product.id}
              product={product}
              button={
                <Button onClick={() => addToCart(product)} className="w-full text-primary border-primary font-semibold" size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              } />
          ))}
        </div>
      )}
    </div>
  )
}
