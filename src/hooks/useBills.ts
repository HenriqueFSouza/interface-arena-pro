import { BillFilters, CreateBillDTO, UpdateBillDTO } from "@/@types/bill";
import { billsService } from "@/services/bills-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const BILLS_QUERY_KEY = "bills";

export function useBills(filters?: BillFilters) {
  const queryClient = useQueryClient();

  const {
    data: bills = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [BILLS_QUERY_KEY, filters],
    queryFn: () => billsService.list(filters),
  });

  const invalidateBills = () => {
    queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
  };

  const { mutateAsync: createBill, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateBillDTO) => billsService.create(data),
    onSuccess: invalidateBills,
  });

  const { mutateAsync: updateBill, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBillDTO }) =>
      billsService.update(id, data),
    onSuccess: invalidateBills,
  });

  const { mutateAsync: payBill, isPending: isPaying } = useMutation({
    mutationFn: (id: string) => billsService.pay(id),
    onSuccess: invalidateBills,
  });

  const { mutateAsync: cancelBill, isPending: isCancelling } = useMutation({
    mutationFn: (id: string) => billsService.cancel(id),
    onSuccess: invalidateBills,
  });

  const { mutateAsync: deleteBill, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => billsService.delete(id),
    onSuccess: invalidateBills,
  });

  return {
    bills,
    isLoading: isLoading || isFetching,
    refetch,
    createBill,
    isCreating,
    updateBill,
    isUpdating,
    payBill,
    isPaying,
    cancelBill,
    isCancelling,
    deleteBill,
    isDeleting,
  };
}
