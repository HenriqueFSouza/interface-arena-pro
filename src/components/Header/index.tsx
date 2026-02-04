'use client'

import { Sidebar } from "@/components/Sidebar"
import { UserNav } from "@/components/UserNav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/providers/auth-provider"
import { Menu } from "lucide-react"

export function Header() {
    const { user } = useAuth()

    return (
        <div className="h-16 flex items-center justify-between px-4 lg:justify-end">
            <Sheet >
                <SheetTrigger asChild>
                    <Button className="text-white lg:hidden" variant="ghost" size="sm">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[200px] p-0">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex flex-col items-end">
                    <span className="text-sm font-medium text-white">{user?.name}</span>
                    <span className="text-xs text-white/70">{user?.email}</span>
                </div>
                <UserNav />
            </div>
        </div>
    )
} 