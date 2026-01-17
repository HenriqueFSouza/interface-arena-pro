"use client";

import { BillFilters as BillFiltersType, BillStatus } from "@/@types/bill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface BillFiltersProps {
  filters: BillFiltersType;
  onFiltersChange: (filters: BillFiltersType) => void;
}

export function BillFilters({ filters, onFiltersChange }: BillFiltersProps) {
  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "ALL" ? undefined : (value as BillStatus),
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      startDate: e.target.value || undefined,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      endDate: e.target.value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.status || filters.startDate || filters.endDate || filters.expenseId;

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-lg border mb-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select
          value={filters.status || "ALL"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger id="status" className="w-[160px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value={BillStatus.PENDING}>Pendentes</SelectItem>
            <SelectItem value={BillStatus.PAID}>Pagas</SelectItem>
            <SelectItem value={BillStatus.CANCELLED}>Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="startDate">De</Label>
        <Input
          id="startDate"
          type="date"
          value={filters.startDate || ""}
          onChange={handleStartDateChange}
          className="w-[160px]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="endDate">Até</Label>
        <Input
          id="endDate"
          type="date"
          value={filters.endDate || ""}
          onChange={handleEndDateChange}
          className="w-[160px]"
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
