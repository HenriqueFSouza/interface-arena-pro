'use client'

import { Sidebar } from "@/components/Sidebar"
import { UserNav } from "@/components/UserNav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
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

            <UserNav />
        </div>
    )
} 