import { BillsList } from "@/components/Bills/BillsList";
import FinanceiroTabsSelector from "@/components/Financeiro/FinanceiroTabsSelector";
import { NewBillDialog } from "@/components/Bills/NewBillDialog";

export default function FinanceiroPage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <FinanceiroTabsSelector />
                <NewBillDialog />
            </div>
            <BillsList />
        </>
    )
}
