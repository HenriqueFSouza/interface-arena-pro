export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Relatórios</h1>
                {children}
            </div>
        </div>
    )
}