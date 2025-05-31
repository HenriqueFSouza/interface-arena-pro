'use client'

import { Input } from "@/components/ui/input";
import { useStock } from "@/hooks/useStock";
import { formatToBRL } from "@/utils/formaters";
import { Search } from "lucide-react";
import { Suspense, useState } from "react";
import { StockTable } from "../Table";
import { TableSkeleton } from "../Table/Skeleton";

export function StockList() {
    const { items, totalValue, isLoading } = useStock()
    const [search, setSearch] = useState('')

    if (isLoading) {
        return (
            <TableSkeleton />
        )
    }

    const filteredItems = items.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase())
    })

    const noItemsFound = filteredItems.length === 0 && !isLoading

    return (
        <div className="flex flex-col">
            <div className="mb-2 relative bg-white rounded-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    autoFocus
                    placeholder="Pesquisar produtos..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {!noItemsFound && <p className="text-sm text-muted-foreground my-2">Total em estoque: <strong className="text-neutral-900 font-bold text-base">{formatToBRL(totalValue)}</strong></p>}

            <Suspense fallback={<TableSkeleton />}>
                <StockTable items={filteredItems} />
            </Suspense>
        </div>
    )
}

