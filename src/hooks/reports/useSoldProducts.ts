import { reportsService, SoldProduct } from "@/services/reports";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseSoldProductsProps {
  startDate: string;
  endDate: string;
  initialLimit?: number;
}

export const SOLD_PRODUCTS_QUERY_KEY = "sold-products";

export function useSoldProducts({
  startDate,
  endDate,
  initialLimit = 20,
}: UseSoldProductsProps) {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<SoldProduct[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data,
    isLoading: isInitialLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [SOLD_PRODUCTS_QUERY_KEY, startDate, endDate, page],
    queryFn: () =>
      reportsService.getSoldProducts(startDate, endDate, page, initialLimit),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  // Update allProducts when data changes
  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAllProducts(data.products);
      } else {
        setAllProducts((prev) => [...prev, ...data.products]);
      }
      setIsLoadingMore(false);
    }
  }, [data, page]);

  // Reset when dates change
  const dateKey = useMemo(
    () => `${startDate}-${endDate}`,
    [startDate, endDate]
  );
  const [lastDateKey, setLastDateKey] = useState(dateKey);

  useEffect(() => {
    if (dateKey !== lastDateKey) {
      setLastDateKey(dateKey);
      setPage(1);
      setAllProducts([]);
      setIsLoadingMore(false);
    }
  }, [dateKey, lastDateKey]);

  const loadMore = useCallback(async () => {
    if (!data?.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    setPage((prev) => prev + 1);
  }, [data?.hasNextPage, isLoadingMore]);

  const reset = useCallback(() => {
    setPage(1);
    setAllProducts([]);
    setIsLoadingMore(false);
  }, []);

  return {
    products: allProducts,
    totalProducts: data?.totalProducts ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    isLoading: isInitialLoading && page === 1,
    isLoadingMore,
    error,
    loadMore,
    reset,
    refetch: () => {
      reset();
      refetch();
    },
  };
}
