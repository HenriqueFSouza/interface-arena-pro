'use client'

import { Order } from '@/@types/order';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/sales-store';
import { Printer } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Receipt from './receipt';

interface PrintOrderProps {
  order: Order;
  newItems?: CartItem[];
  buttonLabel?: string;
  showButton?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

const PrintOrder = ({
  order,
  newItems,
  buttonLabel,
  showButton = true,
  size = 'default',
  variant = 'outline',
}: PrintOrderProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: newItems ? `Item-${newItems[0].product.name}` : `Pedido-${order.id}`,
    onAfterPrint: () => {
      console.log('Printed successfully')
    },
    bodyClass: 'print-receipt',
    contentRef: componentRef,
  });

  const printWithThermalCheck = async () => {

    handlePrint();
  };

  return (
    <>
      {showButton && (
        <Button
          type="button"
          onClick={() => printWithThermalCheck()}
          size={size}
          variant={variant}
          className="gap-2 absolute top-2 right-10 p-2"
        >
          <Printer className="h-4 w-4" />
          {buttonLabel}
        </Button>
      )}
      <div style={{ display: 'none' }}>
        <Receipt
          ref={componentRef}
          order={order}
          newItems={newItems}
          showHeader={!newItems}
          showFooter={!newItems}
        />
      </div>
    </>
  );
};

export default PrintOrder;

// This is a hook to be used within a component context
export const usePrintItem = () => {
  const printItemRef = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: 'Receipt',
    bodyClass: 'print-receipt',
    contentRef: printItemRef,
    onAfterPrint: () => {
      console.log('Printed successfully')
    },
  });

  const printItem = async () => {
    if (printItemRef.current) {
      handlePrint();
    }
  };

  return { printItemRef, printItem };
};
