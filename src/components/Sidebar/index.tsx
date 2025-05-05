'use client'

import { routes } from "@/constants/routes"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path
    return (
        <div className={cn(
            "relativetext-neutral-800 h-full p-6 px-4 lg:text-white transition-all duration-300 ease-in-out",
            "w-[70px] hover:w-[200px] group",
            className
        )}>
            <div className="absolute top-4 left-6 font-bold text-2xl mb-8 italic whitespace-nowrap overflow-hidden">PayArena</div>

            <nav className="space-y-6 pt-10">
                {routes.map((route) => {

                    const isDisabled = route.disabled
                    return (
                        <Link href={route.href} key={route.href} className={cn(
                            "p-2 flex items-center font-semibold gap-4 transition-all duration-100 ease-in-out",
                            "border border-transparent rounded-lg",
                            "hover:bg-neutral-50/10 hover:border-neutral-50 hover:scale-105",
                            isActive(route.href) && "border-2 border-neutral-50",
                            isDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent hover:border-transparent hover:scale-100"
                        )}>
                            <route.icon className="min-w-[18px]" />
                            <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {route.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}