import ReportsTabsSelector from "@/components/Reports/ReportsTabsSelector";
import { SalesReports } from "@/components/Reports/SalesReports";

export default function ReportsPage() {
    return (
        <>
            <ReportsTabsSelector />
            <SalesReports />
        </>
    )
}