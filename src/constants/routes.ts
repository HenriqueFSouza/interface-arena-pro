import { BarChart, FileText, Package, ShoppingBag, ShoppingCart } from "lucide-react";

interface Route {
    label: string
    href: string
    icon: React.ElementType
    disabled?: boolean
}

export const routes: Route[] = [
    {
        label: "Vender",
        href: "/",
        icon: ShoppingBag,
    },
    {
        label: "Produtos",
        href: "/products",
        icon: ShoppingCart,
    },
    {
        label: "Estoque",
        href: "/stock",
        icon: Package,
    },
    {
        label: "Financeiro",
        href: "/financeiro",
        icon: FileText,
    },
    {
        label: "Relatórios",
        href: "/reports",
        icon: BarChart,
    }
]

