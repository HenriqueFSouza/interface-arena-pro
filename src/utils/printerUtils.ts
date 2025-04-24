/**
 * Utility functions for printer operations
 */

/**
 * Attempts to detect if a thermal printer is available
 * This uses a best-effort approach since browsers have limited printer detection capabilities
 * @returns Promise<boolean> - true if a thermal printer is likely available
 */
export const hasThermalPrinter = async (): Promise<boolean> => {
    // If not in browser environment, return false
    if (typeof window === 'undefined' || !window.navigator) {
        return false;
    }

    try {
        // Check if window.print is available at all
        if (!window.print) {
            return false;
        }

        // First approach: Try to use the Printer API if available
        if ('printer' in navigator && 'query' in (navigator as any).printer) {
            const printers = await (navigator as any).printer.query();

            // Look for printers with names commonly associated with thermal printers
            return printers.some((printer: any) => {
                const name = printer.name.toLowerCase();
                return (
                    name.includes('thermal') ||
                    name.includes('receipt') ||
                    name.includes('pos') ||
                    name.includes('epson tm') ||
                    name.includes('elgin') ||
                    name.includes('star ') ||
                    name.includes('bixolon')
                );
            });
        }

        return false;
    } catch (error) {
        console.error('Error detecting thermal printer:', error);
        return false;
    }
};
; 