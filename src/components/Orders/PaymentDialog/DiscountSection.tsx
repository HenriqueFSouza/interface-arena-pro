import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOrderPayment } from "@/contexts/OrderPaymentContext";
import { Discount } from "@/services/discounts";
import { formatToBRL } from "@/utils/formaters";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

const discountReasons = [
    "Ajustar valor",
    "Promoção",
];

export function DiscountSection() {
    const [showDiscount, setShowDiscount] = useState(false);
    const [discountValue, setDiscountValue] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [discountReason, setDiscountReason] = useState("");

    const {
        discounts,
        isLoading,
        remainingAmount,
        paymentIsCompleted,
        existingDiscountsTotal,
        addDiscount,
        removeDiscount,
        updateTempDiscountAmount
    } = useOrderPayment();


    const handleDiscountValueChange = (value: string) => {
        const numValue = Math.min(parseFloat(value) || 0, remainingAmount);
        const percentage = ((numValue / remainingAmount) * 100).toFixed(2);

        setDiscountValue(numValue.toString());
        setDiscountPercentage(percentage);

        const totalDiscount = existingDiscountsTotal + numValue;
        updateTempDiscountAmount(totalDiscount);
    };

    const handleDiscountPercentageChange = (value: string) => {
        const numValue = Math.min(parseFloat(value) || 0, 100);
        const absoluteValue = ((numValue / 100) * remainingAmount).toFixed(2);

        setDiscountPercentage(numValue.toString());
        setDiscountValue(absoluteValue);

        const totalDiscount = existingDiscountsTotal + parseFloat(absoluteValue);
        updateTempDiscountAmount(totalDiscount);
    };

    const handleDiscountToggle = (checked: boolean) => {
        setShowDiscount(checked);
        if (!checked) {
            setDiscountValue("");
            setDiscountPercentage("");
            setDiscountReason("");
            updateTempDiscountAmount(existingDiscountsTotal);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const amount = parseFloat(discountValue);
        const percentage = parseFloat(discountPercentage);

        if (isNaN(amount) || isNaN(percentage)) return;

        try {
            await addDiscount({
                value: amount,
                percentage,
                reason: discountReason
            });

            toast.success('Desconto adicionado com sucesso');
            setDiscountValue("");
            setDiscountPercentage("");
            setDiscountReason("");
            setShowDiscount(false);
        } catch (error) {
            toast.error('Erro ao adicionar desconto');
        }
    };

    const handleRemoveDiscount = async (discountId: string) => {
        await removeDiscount(discountId);
    };

    const renderDiscountsList = useCallback(() => {
        if (isLoading) {
            return <div className="text-sm text-muted-foreground">Carregando descontos...</div>
        }

        if (discounts.length > 0) {
            return (
                <ScrollArea className="max-h-[100px]">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Motivo</p>
                            <p className="text-xs text-muted-foreground">Valor</p>
                        </div>
                        {discounts.map((discount: Discount) => (
                            <div key={discount.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                <div>
                                    <p className="text-sm font-medium">{discount.reason}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{formatToBRL(discount.value)}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-destructive"
                                        onClick={() => handleRemoveDiscount(discount.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )
        }

        return null;
    }, [discounts, isLoading, handleRemoveDiscount]);

    if (!showDiscount) {
        return (
            <div className="space-x-1">
                <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                        id="apply-discount"
                        checked={showDiscount}
                        onCheckedChange={(checked) => handleDiscountToggle(checked as boolean)}
                        disabled={paymentIsCompleted}
                    />
                    <label
                        htmlFor="apply-discount"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
                    >
                        Aplicar desconto
                    </label>
                </div>
                {renderDiscountsList()}
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-4 border-b border-dashed border-gray-300 pb-2">
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="apply-discount"
                    checked={showDiscount}
                    disabled={paymentIsCompleted}
                    onCheckedChange={(checked) => handleDiscountToggle(checked as boolean)}
                />
                <label
                    htmlFor="apply-discount"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
                >
                    Aplicar desconto
                </label>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <Label htmlFor="discount-value">Valor (R$)</Label>
                        <Input
                            id="discount-value"
                            type="number"
                            placeholder="0.00"
                            required
                            max={remainingAmount}
                            value={discountValue}
                            onChange={(e) => handleDiscountValueChange(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="discount-percentage">Porcentagem (%)</Label>
                        <Input
                            id="discount-percentage"
                            type="number"
                            max="100"
                            required
                            value={discountPercentage}
                            onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <Input
                        id="discount-reason"
                        value={discountReason}
                        onChange={(e) => setDiscountReason(e.target.value)}
                        placeholder="Informe o motivo do desconto"
                        required
                    />

                    <Button variant="secondary" size="sm" className="h-10" type="submit">
                        <Plus className="w-4 h-4 mr-1" />
                        Aplicar
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {discountReasons.map((reason) => (
                        <Badge
                            className="cursor-pointer bg-blue-600/80 hover:bg-blue-600/90"
                            key={reason}
                            onClick={() => setDiscountReason(reason)}
                        >
                            {reason}
                        </Badge>
                    ))}
                </div>
            </form>

            {renderDiscountsList()}
        </div>
    );
} 