import { StockHistoryType, UnitMeasure } from "@/@types/stock";

export const getUnitMeasureLabel = (unitMeasure: UnitMeasure) => {
    switch (unitMeasure) {
        case UnitMeasure.KILOGRAM:
            return 'KG'
        case UnitMeasure.LITER:
            return 'L'
        case UnitMeasure.UNIT:
            return 'UN'
        default:
            return unitMeasure
    }
}


export const getHistoryTypeLabel = (type: StockHistoryType) => {
    switch (type) {
        case StockHistoryType.INCOMING:
            return "Entrada"
        case StockHistoryType.OUTGOING:
            return "Saída"
        case StockHistoryType.ADJUSTMENT:
            return "Ajuste"
        case StockHistoryType.INVENTORY:
            return "Inventário"
    }
}