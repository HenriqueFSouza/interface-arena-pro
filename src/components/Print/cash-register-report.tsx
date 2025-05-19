import { CashRegister } from '@/@types/cash-register';
import { PaymentMethod } from '@/@types/payment';
import { formatDateTime, formatToBRL } from '@/utils/formaters';
import React from 'react';

interface CashRegisterReportProps {
    cashRegister: CashRegister;
    registeredPayments: {
        [key in PaymentMethod]: number;
    };
}

const CashRegisterReport = React.forwardRef(({
    cashRegister,
    registeredPayments,
}: CashRegisterReportProps, ref: React.Ref<HTMLDivElement>) => {
    const currentDateWithoutTime = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');

    const getSystemAmount = (method: PaymentMethod): number => {
        return cashRegister.transactions
            .filter(transaction => transaction.paymentMethod === method)
            .reduce((total, transaction) => total + (transaction.amount ?? 0), 0);
    };

    const getDifference = (method: PaymentMethod): number => {
        const systemAmount = getSystemAmount(method);
        const registeredAmount = registeredPayments[method];
        return registeredAmount - systemAmount;
    };

    const getTotalSystemAmount = (): number => {
        return Object.values(PaymentMethod).reduce((total, method) => {
            return total + getSystemAmount(method);
        }, 0);
    };

    const getTotalRegisteredAmount = (): number => {
        return Object.values(registeredPayments).reduce((total, amount) => total + amount, 0);
    };

    const getTotalDifference = (): number => {
        return getTotalRegisteredAmount() - getTotalSystemAmount();
    };

    const renderPaymentMethodRow = (method: PaymentMethod) => {
        const systemAmount = getSystemAmount(method);
        const registeredAmount = registeredPayments[method];
        const difference = getDifference(method);

        return (
            <div key={method} className="grid grid-cols-4 gap-1 text-xs items-center">
                <div className="font-medium">
                    {method === PaymentMethod.CASH ? "Dinheiro" : method === PaymentMethod.CARD ? "Cartão" : "PIX"}
                </div>
                <div className="text-right">{formatToBRL(systemAmount)}</div>
                <div className="text-right">{formatToBRL(registeredAmount)}</div>
                <div className={`text-right font-medium ${difference === 0 ? 'text-gray-600' : difference > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatToBRL(difference)}
                </div>
            </div>
        );
    };

    return (
        <div ref={ref} className="w-[80mm] font-mono text-xs leading-tight p-2 mx-auto text-black bg-white">
            <div className="text-center mb-2.5">
                <h1 className="text-2xl font-bold text-primary italic">PayArena</h1>
                <p className="text-sm font-bold my-1.5">Relatório de Fechamento de Caixa</p>
                <div className="flex justify-between my-2 text-xs">
                    <p className="my-0.5">{currentDateWithoutTime}</p>
                    <p className="my-0.5">{currentTime}</p>
                </div>
                <div className="border-t border-dashed border-black my-1.5"></div>
            </div>

            <div className="mb-4">
                <p className="font-bold mb-1">Informações do Caixa</p>
                <div className="flex justify-between text-xs">
                    <span>Abertura:</span>
                    <span>{formatDateTime(cashRegister.createdAt)}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span>Valor Inicial:</span>
                    <span>{formatToBRL(cashRegister.openedAmount)}</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="grid grid-cols-4 gap-2 text-xs">
                    <div />
                    <div className="text-right font-semibold col-span-1">Sistema</div>
                    <div className="text-right font-semibold col-span-1">Registrado</div>
                    <div className="text-right font-semibold col-span-1">Diferença</div>
                </div>

                <div className="space-y-2">
                    {Object.values(PaymentMethod).map(renderPaymentMethodRow)}
                </div>
            </div>

            <div className="border-t border-dashed border-black my-1.5"></div>

            <div className="mb-4">
                <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="font-medium">Total</div>
                    <div className="text-right">{formatToBRL(getTotalSystemAmount())}</div>
                    <div className="text-right">{formatToBRL(getTotalRegisteredAmount())}</div>
                    <div className={`text-right font-medium ${getTotalDifference() === 0 ? 'text-gray-600' : getTotalDifference() > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {formatToBRL(getTotalDifference())}
                    </div>
                </div>
            </div>

            <div className="text-center mt-4 text-xs mb-4">
                <p>Relatório gerado automaticamente pelo sistema</p>
            </div>
        </div>
    );
});

CashRegisterReport.displayName = "CashRegisterReport";

export default CashRegisterReport; 