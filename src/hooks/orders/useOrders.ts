'use client'

import { ordersService } from "@/services/orders"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

export const ORDER_QUERY_KEY = 'orders'

export const useOrders = () => {
    const [search, setSearch] = useState('')

    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: [ORDER_QUERY_KEY],
        queryFn: () => ordersService.getOrders(),
    })

    const filteredOrders = data?.filter((order) =>
        order.clients[0].name.toLowerCase().includes(search.toLowerCase())
    )

    const openOrdersSubTotal = useMemo(() =>
        data?.reduce((acc, order) =>
            acc + order.items.reduce((acc, item) =>
                acc + (item.product?.price || 0) * item.quantity, 0
            ), 0
        ), [data]
    )

    return {
        orders: filteredOrders ?? [],
        isLoading: isLoading || isFetching,
        search,
        error,
        openOrdersSubTotal: openOrdersSubTotal ?? 0,
        setSearch,
    }
}

