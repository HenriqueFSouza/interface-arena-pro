import { Order } from '@/@types/order';
import { CartItem } from '@/stores/sales-store';
import {
    printCashRegister,
    printProductTickets,
    printReceiptTemplate,
    ReceiptOptions
} from '@/utils/printerUtils';
import { useCallback, useState } from 'react';

interface PrintOrderProps {
    order: Order;
    template?: 'default' | 'ticket';
    newItems?: CartItem[];
    options?: ReceiptOptions;
}

export const usePrinter = () => {
    const [isPrinting, setIsPrinting] = useState(false);

    const printOrder = useCallback(async (
        { order, template = 'default', newItems, options }: PrintOrderProps
    ) => {
        if (isPrinting) {
            return { success: false, error: 'Print operation already in progress' };
        }

        setIsPrinting(true);

        try {
            if (template === 'ticket') {
                const result = await printProductTickets(order, newItems);
                if (!result.success) {
                    console.error(result.error || 'Unknown error');
                }
                return result;
            }
            const result = await printReceiptTemplate(order, template, newItems, options);

            if (!result.success) {
                console.error(result.error || 'Unknown error');
            }
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to print order';
            console.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsPrinting(false);
            console.log('finally');
        }
    }, [isPrinting]);

    const printCashRegisterReport = useCallback(async (receiptHTML: string, options?: ReceiptOptions) => {
        if (isPrinting) {
            return { success: false, error: 'Print operation already in progress' };
        }

        setIsPrinting(true);
        try {
            await printCashRegister(receiptHTML, options);
            return { success: true };
        } catch (err) {
            console.error(err);
        } finally {
            setIsPrinting(false);
        }
    }, [isPrinting]);

    return {
        isPrinting,
        printOrder,
        printCashRegisterReport,
    };
}; 