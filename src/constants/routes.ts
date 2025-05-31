import { BarChart, Package, ShoppingBag, ShoppingCart } from "lucide-react";

export const routes = [
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
        disabled: true,
    }
]

