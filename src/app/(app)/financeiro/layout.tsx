export default function FinanceiroLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Financeiro</h1>
                {children}
            </div>
        </div>
    )
}
