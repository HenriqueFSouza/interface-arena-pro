export enum BillStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export enum BillRecurrence {
  NONE = "NONE",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: BillStatus;
  notes: string | null;
  recurrence: BillRecurrence;
  recurrenceParentId: string | null;
  expenseId: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  expense?: {
    id: string;
    name: string;
  } | null;
}

export interface CreateBillDTO {
  name: string;
  amount: number;
  dueDate: string;
  notes?: string;
  recurrence?: BillRecurrence;
  expenseId?: string;
}

export interface UpdateBillDTO {
  name?: string;
  amount?: number;
  dueDate?: string;
  notes?: string;
  status?: BillStatus;
  recurrence?: BillRecurrence;
  expenseId?: string;
}

export interface BillFilters {
  status?: BillStatus;
  startDate?: string;
  endDate?: string;
  expenseId?: string;
}
