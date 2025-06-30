import { Order } from '@/@types/order';
import { PaymentMethod } from '@/@types/payment';
import { CartItem } from '@/stores/sales-store';
import { formatDateTime, formatToBRL } from './formaters';

export interface ReceiptOptions {
    width?: string;
    customStyles?: string;
    shouldCallFallback?: boolean;
    download?: boolean;
}

export interface ReceiptTemplateData {
    order: Order;
    newItems?: CartItem[];
    totalPrice: number;
    currentDate: string;
    currentTime: string;
    itemsToRender: CartItem[] | { product: any; quantity: number; }[];
    isTicketTemplate?: boolean;
    expandedTickets?: Array<{ product: any; quantity: 1; ticketNumber: number; totalTickets: number; }>;
}

export interface PrintCashRegisterReportProps {
    cashSystemAmount: number;
    cardSystemAmount: number;
    pixSystemAmount: number;
    createdAt: string;
    openedAmount: number;
    cashRegisteredPayments: number;
    cardRegisteredPayments: number;
    pixRegisteredPayments: number;
    totalSystemAmount: number;
    totalRegisteredAmount: number;
    totalDifference: number;
}

function expandItemsForTickets(items: CartItem[] | { product: any; quantity: number; }[]): Array<{ product: any; quantity: 1; ticketNumber: number; totalTickets: number; }> {
    const expandedTickets: Array<{ product: any; quantity: 1; ticketNumber: number; totalTickets: number; }> = [];
    let ticketCounter = 1;

    items.forEach((item) => {
        // Validate item has required properties
        if (!item.product || !item.product.name || item.quantity <= 0) {
            console.warn('Skipping invalid item for ticket generation:', item);
            return;
        }

        for (let i = 0; i < item.quantity; i++) {
            expandedTickets.push({
                product: item.product,
                quantity: 1,
                ticketNumber: ticketCounter,
                totalTickets: 0 // Will be set after all items are processed
            });
            ticketCounter++;
        }
    });

    // Set total tickets count for all items
    expandedTickets.forEach(ticket => {
        ticket.totalTickets = expandedTickets.length;
    });

    return expandedTickets;
}

export function generateReceiptData(order: Order, newItems?: CartItem[], template?: keyof typeof ReceiptTemplates): ReceiptTemplateData {
    const isTicketTemplate = template === 'ticket';

    const itemsToProcess = newItems ? [...newItems] : order.items;

    const totalPrice = itemsToProcess.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const currentDate = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');

    let itemsToRender = itemsToProcess;
    let expandedTickets: Array<{ product: any; quantity: 1; ticketNumber: number; totalTickets: number; }> | undefined;

    // For ticket template, expand items into individual tickets
    if (isTicketTemplate) {
        expandedTickets = expandItemsForTickets(itemsToProcess);
    }

    return {
        order,
        newItems,
        totalPrice,
        currentDate,
        currentTime,
        itemsToRender,
        isTicketTemplate,
        expandedTickets,
    };
}

export function generateReceiptHTML(
    receiptData: ReceiptTemplateData,
    options: ReceiptOptions = {}
): string {
    const {
        order,
        totalPrice,
        currentDate,
        currentTime,
        itemsToRender,
    } = receiptData;

    const { width = '80mm', customStyles = '' } = options;

    const baseStyles = `
        font-family: monospace;
        font-size: 18px;
        line-height: 1.2;
        margin: 0 auto;
        color: black;
        padding: 10px;
        background: white;
        width: ${width};
    `;

    const clientName = order.clients.length > 2 ? order.clients[0].name.slice(0, 20) + '...' : order.clients[0].name;

    const headerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <h1 style="font-size: 36px; font-weight: bold; font-style: italic; margin: 0;">PayArena</h1>
            <p style="font-size: 16px; font-weight: bold; margin: 6px 0;">Pedido #${order?.id.slice(-6)}</p>
            ${order?.clients.length > 0 ? `
                <div style="display: flex; flex-direction: column; gap: 2px; align-items: center; margin: 8px 0; font-size: 18px; font-weight: bold;">
                    <p style="margin: 2px 0;">${clientName}</p>
                    <p style="margin: 2px 0;">${order.clients[0].phone ? `${order.clients[0].phone}` : ''}</p>
                </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 18px;">
                <p style="margin: 2px 0;">${currentDate}</p>
                <p style="margin: 2px 0;">${currentTime}</p>
            </div>
            <div style="border-top: 1px dashed black; margin: 6px 0;"></div>
        </div>
    `;

    const itemsHTML = itemsToRender.map((item, index) => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;" key="${index}">
            <span style="flex: 2; text-align: left; padding-right: 6px;">${item.product.name}</span>
            <span style="flex: none; width: 25px; text-align: center;">${item.quantity}x</span>
            <span style="flex: 1; text-align: right;">${formatToBRL(item.product.price * item.quantity)}</span>
        </div>
    `).join('');

    const footerHTML = `
        <div style="border-top: 1px dashed black; margin: 6px 0;"></div>
        <div style="margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin: 6px 0;">
                <span>TOTAL</span>
                <span>${formatToBRL(totalPrice)}</span>
            </div>
        </div>
        <div style="text-align: center; margin-top: 10px; margin-bottom: 10px; font-size: 18px;">
            <p>Obrigado pela preferência!</p>
        </div>
    `;

    return `
        <div style="${baseStyles} ${customStyles}">
            ${headerHTML}
            <div style="width: 100%; margin: 6px 0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 6px; border-bottom: 1px solid black; padding-bottom: 10px;">
                    <span style="flex: 2; text-align: left; padding-right: 6px;">Item</span>
                    <span style="flex: none; width: 25px; text-align: center;">Qtd</span>
                    <span style="flex: 1; text-align: right;">Valor</span>
                </div>
                ${itemsHTML}
            </div>
            ${footerHTML}
        </div>
    `;
}

export function createElementFromHTML(html: string): HTMLElement {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = '0';
    tempDiv.style.height = '0';
    tempDiv.style.overflow = 'hidden';
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);
    return tempDiv.firstElementChild as HTMLElement;
}

export const ReceiptTemplates = {
    default: (receiptData: ReceiptTemplateData, options?: ReceiptOptions): string => {
        return generateReceiptHTML(receiptData, options);
    },

    ticket: (receiptData: ReceiptTemplateData, options?: ReceiptOptions): string => {
        const { order, expandedTickets, currentDate, currentTime } = receiptData;
        const { width = '80mm', customStyles = '' } = options || {};

        if (!expandedTickets || expandedTickets.length === 0) {
            return '<div>Nenhum ticket para imprimir</div>';
        }

        const baseStyles = `
            font-family: monospace;
            font-size: 18px;
            line-height: 1.2;
            margin: 0 auto 20px auto;
            color: black;
            background: white;
            width: ${width};
            page-break-after: always;
        `;

        const clientInfo = order.clients.length > 0 ? order.clients[0] : null;

        // Generate individual tickets
        const ticketsHTML = expandedTickets.map((ticket, index) => `
            <div style="${baseStyles} ${customStyles}" key="${index}">
                <div style="text-align: center; margin-bottom: 10px;">
                    <h1 style="font-size: 27px; font-weight: bold; margin-bottom: 10px;">PayArena</h1>
                    <div style="background: #000000; color: white; padding: 4px; font-weight: bold; font-size: 21px; text-align: center;">
                        <p>FICHA DE PRODUTO</p>
                    </div>
                </div>

                ${clientInfo ? `
                    <div style="text-align: center; margin-bottom: 10px;">
                        <div style="font-weight: bold;">${clientInfo.name}</div>
                        ${clientInfo.phone ? `<div>${clientInfo.phone}</div>` : ''}
                    </div>
                ` : ''}

                <div style="border: 1px solid #000000; padding: 4px; margin-bottom: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">
                        ${ticket.product.name}
                    </div>
                    <div style="font-size: 21px; font-weight: bold;">
                        1 UNIDADE
                    </div>
                    <div style="font-size: 18px; margin: 6px 0;">
                        Valor: ${formatToBRL(ticket.product.price)}
                    </div>
                </div>

                <div style="font-size: 15px; text-align: center;">
                    <div style="">${currentDate} - ${currentTime}</div>
                    <div style="; font-weight: bold;">
                        Apresente esta ficha para retirar o produto
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div style="width: 100%; margin: 0; padding: 0;">
                ${ticketsHTML}
            </div>
        `;
    },

    cashRegisterReport: (data: PrintCashRegisterReportProps): string => {
        const {
            createdAt,
            openedAmount,
            cashSystemAmount,
            cardSystemAmount,
            pixSystemAmount,
            cashRegisteredPayments,
            cardRegisteredPayments,
            pixRegisteredPayments,
            totalSystemAmount,
            totalRegisteredAmount,
            totalDifference,
        } = data;

        const currentDate = new Date().toLocaleDateString('pt-BR');
        const currentTime = new Date().toLocaleTimeString('pt-BR');

        const baseStyles = `
           font-family: monospace;
            font-weight: 600;
            line-height: 1.2;
            color: #000000;
            background: white;
            padding-bottom: 40px;
            margin: 0 auto;
            width: 90mm;
        `;

        const renderPaymentMethodRow = (method: PaymentMethod): string => {
            const systemAmount = method === PaymentMethod.CASH ? cashSystemAmount : method === PaymentMethod.CARD ? cardSystemAmount : pixSystemAmount;
            const registeredAmount = method === PaymentMethod.CASH ? cashRegisteredPayments : method === PaymentMethod.CARD ? cardRegisteredPayments : pixRegisteredPayments;
            const difference = Math.abs(registeredAmount - systemAmount);
            const methodName = method === PaymentMethod.CASH ? "Dinheiro" : method === PaymentMethod.CARD ? "Cartão" : "PIX";

            return `
                <tr>
                    <td style="font-weight: 600; text-align: left; padding: 8px 0;">${methodName}</td>
                    <td style="text-align: center; font-size: 18px; padding: 8px 0;">${formatToBRL(systemAmount, true)}</td>
                    <td style="text-align: center; font-size: 18px; padding: 8px 0;">${formatToBRL(registeredAmount, true)}</td>
                    <td style="text-align: right; font-size: 18px; padding: 8px 0;">${formatToBRL(difference, true)}</td>
                </tr>
            `;
        };

        const paymentMethodsHTML = Object.values(PaymentMethod).map(renderPaymentMethodRow).join('');

        return `
            <div style="${baseStyles}">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 10px;">
                    <h1 style="font-weight: bold; font-style: italic; margin: 0; font-size: 34px;">PayArena</h1>
                    <p style="font-size: 16px; font-weight: bold; margin: 6px 0;">Relatório de Fechamento de Caixa</p>
                    <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 16px;">
                        <p style="margin: 2px 0;">${currentDate}</p>
                        <p style="margin: 2px 0;">${currentTime}</p>
                    </div>
                    <div style="border-top: 1px dashed black; margin: 6px 0;"></div>
                </div>

                <!-- Cash Register Info -->
                <div style="margin-bottom: 16px;">
                    <p style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">Informações do Caixa</p>
                    <div style="display: flex; justify-content: space-between; font-size: 16px; margin-bottom: 2px;">
                        <span>Abertura:</span>
                        <span>${formatDateTime(createdAt)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Valor Inicial:</span>
                        <span style="font-size: 16px;">${formatToBRL(openedAmount)}</span>
                    </div>
                </div>

                <!-- Payment Methods Table -->
                <div style="margin-bottom: 10px;">
                    <table style="width: 100%; margin-bottom: 8px; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="text-align: left; font-weight: 600; font-size: 16px;"></th>
                                <th style="text-align: center; font-weight: 600; font-size: 16px;">Sistema</th>
                                <th style="text-align: right; font-weight: 600; font-size: 16px;">Registrado</th>
                                <th style="text-align: right; font-weight: 600; font-size: 16px;">Diferença</th>
                            </tr>
                        </thead>
                        <tbody style="padding-bottom: 10px; border-bottom: 1px solid black;">
                            ${paymentMethodsHTML}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="font-weight: 600; padding: 8px 0; text-align: left;">Total</td>
                                <td style="text-align: right; padding: 8px 0; font-size: 18px;">${formatToBRL(totalSystemAmount, true)}</td>
                                <td style="text-align: center; padding: 8px 0; font-size: 18px;">${formatToBRL(totalRegisteredAmount + 1000, true)}</td>
                                <td style="text-align: right; padding: 8px 0; font-size: 18px;">${formatToBRL(Math.abs(totalDifference), true)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin: 16px 0; font-size: 16px; margin-bottom: 20px;">
                    <p>Relatório gerado automaticamente pelo sistema</p>
                </div>
            </div>
        `;
    },
};

export async function printReceiptTemplate(
    order: Order,
    template: 'default' | 'ticket',
    newItems?: CartItem[],
    options?: ReceiptOptions,
): Promise<{ success: boolean; error?: string }> {
    try {
        const { PrinterService } = await import('@/services/printer');

        const receiptData = generateReceiptData(order, newItems, template);

        const receiptHTML = ReceiptTemplates[template](receiptData, options);

        const receiptElement = createElementFromHTML(receiptHTML);

        await PrinterService.print(receiptElement, options?.shouldCallFallback ?? false);

        return { success: true };
    } catch (error) {
        console.error('Error printing receipt template:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function printCashRegister(
    receiptHTML: string,
    options?: ReceiptOptions,
): Promise<{ success: boolean; error?: string }> {
    try {
        const { PrinterService } = await import('@/services/printer');

        const element = createElementFromHTML(receiptHTML);

        await PrinterService.print(element, (options?.shouldCallFallback ?? false), options?.download);

        return { success: true };
    } catch (error) {
        console.error('Error printing cash register report:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function printProductTickets(
    order: Order,
    newItems?: CartItem[],
): Promise<{ success: boolean; error?: string; ticketCount?: number }> {
    try {

        const receiptData = generateReceiptData(order, newItems, 'ticket');
        const ticketCount = receiptData.expandedTickets?.length || 0;

        if (ticketCount === 0) {
            return {
                success: false,
                error: 'Nenhum item encontrado para gerar tickets',
                ticketCount: 0
            };
        }

        console.log(`Preparando para imprimir ${ticketCount} tickets individuais`);

        return await printTicketsInBatches(receiptData);

    } catch (error) {
        console.error('Error printing product tickets:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido durante a impressão dos tickets',
            ticketCount: 0
        };
    }
}

async function printTicketsInBatches(
    receiptData: ReceiptTemplateData,
): Promise<{ success: boolean; error?: string; ticketCount?: number }> {
    try {
        const { PrinterService } = await import('@/services/printer');

        if (!receiptData.expandedTickets) {
            return {
                success: false,
                error: 'Nenhum ticket encontrado para impressão em lote',
                ticketCount: 0
            };
        }

        // Configure batch options with defaults
        const batchDelay = 1000;
        console.log({ receiptData })

        const totalTickets = receiptData.expandedTickets.length;

        console.log(`Imprimindo ${totalTickets} tickets`);

        const ticketsToPrint = receiptData.expandedTickets;

        for (let i = 0; i < ticketsToPrint.length; i++) {
            const ticket = ticketsToPrint[i];
            const batchReceiptData = {
                ...receiptData,
                expandedTickets: [ticket]
            };

            // Generate HTML for this batch
            const batchHTML = ReceiptTemplates.ticket(batchReceiptData);
            const batchElement = createElementFromHTML(batchHTML);

            // Print this batch
            await PrinterService.print(batchElement);

            // Small delay between batches to prevent overwhelming the printer
            if (i < ticketsToPrint.length - 1) {
                await new Promise(resolve => setTimeout(resolve, batchDelay));
            }

            console.log(`Lote ${i + 1}/${ticketsToPrint.length} impresso com sucesso`);
        }

        return {
            success: true,
            ticketCount: totalTickets
        };
    } catch (error) {
        console.error('Error printing tickets in batches:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro durante impressão em lotes',
            ticketCount: 0
        };
    }
} 