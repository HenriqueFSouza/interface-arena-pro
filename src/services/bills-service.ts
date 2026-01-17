import { Bill, BillFilters, CreateBillDTO, UpdateBillDTO } from "@/@types/bill";
import { api } from "@/lib/api";

export const billsService = {
  async list(filters?: BillFilters): Promise<Bill[]> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.expenseId) params.append("expenseId", filters.expenseId);

    const queryString = params.toString();
    const url = queryString ? `/bills?${queryString}` : "/bills";

    const { data } = await api.get<Bill[]>(url);
    return data;
  },

  async getById(id: string): Promise<Bill> {
    const { data } = await api.get<Bill>(`/bills/${id}`);
    return data;
  },

  async create(bill: CreateBillDTO): Promise<Bill> {
    const { data } = await api.post<Bill>("/bills", bill);
    return data;
  },

  async update(id: string, bill: UpdateBillDTO): Promise<Bill> {
    const { data } = await api.put<Bill>(`/bills/${id}`, bill);
    return data;
  },

  async pay(id: string): Promise<Bill> {
    const { data } = await api.post<Bill>(`/bills/${id}/pay`);
    return data;
  },

  async cancel(id: string): Promise<Bill> {
    const { data } = await api.post<Bill>(`/bills/${id}/cancel`);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/bills/${id}`);
  },
};
