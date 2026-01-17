'use client'

import TabsSelector from "../TabsSelector";

export default function FinanceiroTabsSelector() {
    const links = [
        {
            label: 'Contas a Pagar',
            href: '/financeiro',
        },
        // Future tabs:
        // {
        //     label: 'Contas a Receber',
        //     href: '/financeiro/receitas',
        // },
        // {
        //     label: 'Fluxo de Caixa',
        //     href: '/financeiro/fluxo-caixa',
        // },
    ]

    return (
        <TabsSelector links={links} />
    )
}
