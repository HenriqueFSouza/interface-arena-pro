'use client'

import TabsSelector from "../TabsSelector";

export default function ReportsTabsSelector() {
    const links = [
        {
            label: 'Vendas',
            href: '/reports',
        },
        // {
        //     label: 'Caixa',
        //     href: '/reports/cash',
        // }
    ]

    return (
        <TabsSelector links={links} />
    )
}