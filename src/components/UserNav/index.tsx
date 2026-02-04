'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { ChevronDown, LogOut, User } from "lucide-react"
import Link from "next/link"

function getInitials(name: string | undefined): string {
    if (!name) return 'U'
    const names = name.trim().split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

export function UserNav() {
    const { user, logout } = useAuth()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="text-white border rounded-full outline-none gap-2" variant="ghost" size="sm">
                    <Avatar className="h-7 w-7">
                        {user?.profileImage ? (
                            <AvatarImage src={user.profileImage} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="text-xs bg-white/20 text-white">
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Meu Perfil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 