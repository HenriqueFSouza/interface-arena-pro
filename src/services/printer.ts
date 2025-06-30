const PRINTER_SERVICE_URL = 'http://localhost:5151';
const PRINTER_ID_KEY = 'selected_printer_id';

interface Printer {
    id: string;
    name: string;
    status: string;
}

interface PrintRequest {
    printerId: string;
    imageData: string;
}

export class PrinterService {
    private static isInitialized = false;

    /**
     * Initialize the printer service by checking if the local service is available
     */
    static async initialize(): Promise<boolean> {
        try {
            await this.getConfiguredPrinters();
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.warn('Printer service not available, will fallback to browser printing:', error);
            this.isInitialized = false;
            return false;
        }
    }

    /**
     * Check if the printer service is available
     */
    static async isServiceAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${PRINTER_SERVICE_URL}/api/printers/configured`, {
                method: 'GET',
                signal: AbortSignal.timeout(2000), // 2 second timeout
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get list of configured printers from the local service
     */
    static async getConfiguredPrinters(): Promise<Printer[]> {
        try {
            const response = await fetch(`${PRINTER_SERVICE_URL}/api/printers/configured`, {
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });
            if (!response.ok) {
                throw new Error(`Failed to get printers: ${response.statusText}`);
            }
            const printers = await response.json().then(data => data.printers);

            return printers;
        } catch (error) {
            console.error('Error getting configured printers:', error);
            throw error;
        }
    }

    /**
     * Get the selected printer ID from localStorage or fetch and set the first available
     */
    static async getSelectedPrinterId(): Promise<string> {
        // Try to get from localStorage first
        const storedPrinterId = localStorage.getItem(PRINTER_ID_KEY);
        if (storedPrinterId) {
            return storedPrinterId;
        }

        // If not found, fetch printers and use the first one
        try {
            const printers = await this.getConfiguredPrinters();
            console.log('printers', printers);
            if (printers.length === 0) {
                throw new Error('No printers configured');
            }

            const firstPrinterId = printers[0].id;
            this.setSelectedPrinterId(firstPrinterId);
            return firstPrinterId;
        } catch (error) {
            console.error('Error getting selected printer ID:', error);
            throw error;
        }
    }

    /**
     * Set the selected printer ID in localStorage
     */
    static setSelectedPrinterId(printerId: string): void {
        localStorage.setItem(PRINTER_ID_KEY, printerId);
    }

    /**
     * Convert HTML element to base64 image
     */
    static async htmlToBase64Image(element: HTMLElement): Promise<string> {
        try {
            // Import html2canvas dynamically to avoid SSR issues
            const html2canvas = (await import('html2canvas')).default;

            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2, // Higher scale for better quality
                useCORS: true,
                allowTaint: false,
                logging: false, // Disable logging for production
                width: element.scrollWidth,
                height: element.scrollHeight,
            });

            return canvas.toDataURL('image/png'); // Remove the data:image/png;base64, prefix
        } catch (error) {
            console.error('Error converting HTML to base64:', error);
            throw error;
        }
    }

    /**
     * Send print request to the local service
     */
    static async printImage(imageData: string, printerId?: string): Promise<void> {
        try {
            const selectedPrinterId = printerId || await this.getSelectedPrinterId();

            const printRequest: PrintRequest = {
                printerId: selectedPrinterId,
                imageData,
            };

            const response = await fetch(`${PRINTER_SERVICE_URL}/api/print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(printRequest),
                signal: AbortSignal.timeout(10000), // 10 second timeout
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Print failed: ${response.statusText} - ${errorText}`);
            }

            console.log('Print sent successfully');
        } catch (error) {
            console.error('Error sending print request:', error);
            throw error;
        }
    }

    /**
     * Fallback to browser printing
     */
    static fallbackToBrowserPrint(element: HTMLElement): void {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Por favor, permita pop-ups para imprimir o recibo');
            return;
        }

        const clonedElement = element.cloneNode(true) as HTMLElement;
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <body>
              ${clonedElement.outerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(() => window.close(), 1000);
                };
              </script>
            </body>
          </html>
        `);

        printWindow.document.close();
    }

    /**
     * Main print function that tries local service first, then falls back to browser
     */
    static async print(element: HTMLElement, shouldCallFallback?: boolean): Promise<void> {
        try {
            // Check if service is available first
            const serviceAvailable = await this.isServiceAvailable();

            if (!serviceAvailable && shouldCallFallback) {
                console.warn('Printer service not available, using browser print');
                this.fallbackToBrowserPrint(element);
                return;
            }

            const imageData = await this.htmlToBase64Image(element);
            await this.printImage(imageData);
        } catch (error) {
            console.warn('Local printing service failed, falling back to browser print:', error);
        }
    }
} 