import { Order } from '@/@types/order';
import { CartItem } from '@/lib/sales-store';
import { formatToBRL } from '@/utils/formaters';
import React from 'react';

interface ReceiptProps {
    order: Order;
    newItems?: CartItem[];
    showHeader?: boolean;
    showFooter?: boolean;
}

const Receipt = React.forwardRef(({
    order,
    newItems,
    showHeader = true,
    showFooter = true
}: ReceiptProps, ref: React.Ref<HTMLDivElement>) => {

    console.log({ order, newItems })

    const totalPrice = newItems
        ? newItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
        : order.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const totalItems = newItems
        ? newItems.reduce((acc, item) => acc + item.quantity, 0)
        : order.items.reduce((acc, item) => acc + item.quantity, 0);

    const currentDateWithoutTime = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');

    // Determine which items to render
    const itemsToRender = newItems ? [...newItems] : order.items;

    return (
        <div ref={ref} className="w-[80mm] font-mono text-xs leading-tight p-5 mx-auto text-black bg-white">
            {showHeader && (
                <div className="text-center mb-2.5">
                    <h1 className="text-2xl font-bold text-primary">ARENA PRO</h1>
                    <p className="text-sm font-bold my-1.5">Pedido #{order?.id.slice(-6)}</p>
                    {order?.clients.length > 0 && (
                        <div className="flex justify-between my-2 text-xs">
                            <p className="my-0.5">Cliente: {order.clients[0].name}</p>
                            <p className="my-0.5">Tel: {order.clients[0].phone}</p>
                        </div>
                    )}
                    <div className="flex justify-between my-2 text-xs">
                        <p className="my-0.5">{currentDateWithoutTime} </p>
                        <p className="my-0.5">{currentTime} </p>
                    </div>
                    <div className="border-t border-dashed border-black my-1.5"></div>
                </div>
            )}

            <div className="w-full my-1.5">
                <div className="flex justify-between font-bold mb-1.5 border-b border-solid border-black pb-0.5">
                    <span className="flex-2 text-left pr-1.5 overflow-hidden text-ellipsis whitespace-nowrap">Item</span>
                    <span className="flex-none w-[25px] text-center">Qtd</span>
                    <span className="flex-1 text-right">Valor</span>
                </div>

                {itemsToRender.map((item, index) => (
                    <div key={index} className="flex justify-between mb-0.5">
                        <span className="flex-2 text-left pr-1.5 overflow-hidden text-ellipsis whitespace-nowrap">{item.product.name}</span>
                        <span className="flex-none w-[25px] text-center">{item.quantity}x</span>
                        <span className="flex-1 text-right">{formatToBRL(item.product.price * item.quantity)}</span>
                    </div>
                ))}
            </div>

            {showFooter && (
                <>
                    <div className="border-t border-dashed border-black my-1.5"></div>
                    <div className="my-2.5">
                        <div className="flex justify-between font-bold text-xs my-1.5">
                            <span>TOTAL</span>
                            <span>{formatToBRL(totalPrice)}</span>
                        </div>
                        <p className="text-right text-xs my-1.5">{totalItems} {totalItems === 1 ? "item" : "itens"}</p>
                    </div>
                    <div className="text-center mt-4 text-xs">
                        <p>Obrigado pela preferência!</p>
                    </div>
                </>
            )}
        </div>
    );
});

Receipt.displayName = "Receipt";

export default Receipt;
