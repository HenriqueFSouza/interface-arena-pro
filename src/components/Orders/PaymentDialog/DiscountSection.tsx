import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";

interface DiscountProps {
    totalAmount: number;
    onDiscountChange: (discountValue: number) => void;
}

const discountReasons = [
    "Ajustar valor",
    "Promoção",
]

export function DiscountSection({ totalAmount, onDiscountChange }: DiscountProps) {
    const [showDiscount, setShowDiscount] = useState(false);
    const [discountValue, setDiscountValue] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [discountReason, setDiscountReason] = useState("");

    const handleDiscountValueChange = (value: string) => {
        const numValue = Math.min(parseFloat(value) || 0, totalAmount);
        const percentage = ((numValue / totalAmount) * 100).toFixed(2);

        setDiscountValue(numValue.toString());
        setDiscountPercentage(percentage);
        onDiscountChange(numValue);
    };

    const handleDiscountPercentageChange = (value: string) => {
        const numValue = Math.min(parseFloat(value) || 0, 100);
        const absoluteValue = ((numValue / 100) * totalAmount).toFixed(2);

        setDiscountPercentage(numValue.toString());
        setDiscountValue(absoluteValue);
        onDiscountChange(parseFloat(absoluteValue));
    };

    const handleDiscountToggle = (checked: boolean) => {
        setShowDiscount(checked);
        if (!checked) {
            setDiscountValue("");
            setDiscountPercentage("");
            setDiscountReason("");
            onDiscountChange(0);
        }
    };

    if (!showDiscount) {
        return (
            <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                    id="apply-discount"
                    checked={showDiscount}
                    onCheckedChange={(checked) => handleDiscountToggle(checked as boolean)}
                />
                <label
                    htmlFor="apply-discount"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Aplicar desconto
                </label>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onDiscountChange(parseFloat(discountValue));
    };

    return (
        <form className="space-y-4 mb-4 border-b border-dashed border-gray-300 pb-2" onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="apply-discount"
                    checked={showDiscount}
                    onCheckedChange={(checked) => handleDiscountToggle(checked as boolean)}
                />
                <label
                    htmlFor="apply-discount"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Aplicar desconto
                </label>
            </div>
            <div className="flex gap-3">
                <div className="flex-1">
                    <Label htmlFor="discount-value">Valor (R$)</Label>
                    <Input
                        id="discount-value"
                        type="number"
                        min="0"
                        placeholder="0.00"
                        required
                        max={totalAmount}
                        value={discountValue}
                        onChange={(e) => handleDiscountValueChange(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <Label htmlFor="discount-percentage">Porcentagem (%)</Label>
                    <Input
                        id="discount-percentage"
                        type="number"
                        min="0"
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
            {discountReasons.map((reason) => (
                <Badge
                    className="cursor-pointer !mt-1 !mr-2 bg-blue-600/80 hover:bg-blue-600/90"
                    key={reason}
                    onClick={() => setDiscountReason(reason)}
                >
                    {reason}
                </Badge>
            ))}
        </form >
    );
} 