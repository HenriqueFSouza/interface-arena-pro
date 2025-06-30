import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrintPage() {
    return (
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">Clique no botão abaixo para instalar o programa de impressão</h1>
                <Link href="/download/printer-service-setup.exe" download>
                    <Button>
                        Instalar programa de impressão
                    </Button>
                </Link>
            </div>
        </div>
    )
}