'use client'

import { SearchInput } from "@/components/SearchInput";
import { useStock } from "@/hooks/useStock";
import { formatToBRL } from "@/utils/formaters";
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
            <div className="flex items-center justify-between"></div>
            <SearchInput search={search} placeholder="Pesquisar item..." handleSearch={(e) => setSearch(e.target.value)} />

            {!noItemsFound && <p className="text-sm text-muted-foreground my-2">Total em estoque: <strong className="text-neutral-900 font-bold text-base">{formatToBRL(totalValue)}</strong></p>}

            <Suspense fallback={<TableSkeleton />}>
                <StockTable items={filteredItems} />
            </Suspense>
        </div>
    )
}

