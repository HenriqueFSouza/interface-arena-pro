import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen flex bg-primary">
            {/* Sidebar - visível apenas em desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col">
                {/* Header - visível apenas em mobile */}
                <Header />

                {/* Área de conteúdo */}
                <main className="flex-1 pr-4 pb-4">
                    <div className="min-h-full mx-auto bg-gray-100 rounded-t-lg lg:rounded-lg border shadow-sm p-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
