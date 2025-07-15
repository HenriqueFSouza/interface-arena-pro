import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsSelectorProps {
    links: {
        label: string
        href: string
        disabled?: boolean
    }[];
    className?: string;
}

export default function TabsSelector({ links, className }: TabsSelectorProps) {
    const pathname = usePathname()

    const activeClasses = 'text-primary border-primary bg-primary/5'

    return (
        <div className='no-scrollbar max-w-full overflow-x-scroll'>
            <div
                className={cn(
                    'flex gap-2 font-semibold',
                    className,
                )}
            >
                {links.map(({ label, href, disabled = false }) =>
                (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'whitespace-nowrap rounded-lg border border-neutral-300 bg-white',
                            'flex items-center justify-center px-4 py-1.5 text-sm text-neutral-600 transition-all hover:text-primary hover:bg-primary/10',
                            disabled && 'pointer-events-none opacity-25',
                            pathname === href && activeClasses,
                        )}
                    >
                        {label}
                    </Link>
                )
                )}
            </div>

        </div>
    );
}