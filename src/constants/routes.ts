import { BarChart, Package, ShoppingBag, ShoppingCart } from "lucide-react";

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
        label: "Relatórios",
        href: "/reports",
        icon: BarChart,
    }
]

