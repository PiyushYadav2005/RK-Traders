import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ProductListResponse, ProductQuery, Product } from "@/types/product";
import type { Category } from "@/types";

export function useProducts(query: ProductQuery, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: async () => {
      const { data } = await api.get<ProductListResponse>("/products", { params: query });
      return data;
    },
    placeholderData: (prev) => prev,
    enabled: options?.enabled ?? true,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; product: Product }>(
        `/products/${slug}`
      );
      return data.product;
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; categories: Category[] }>(
        "/categories"
      );
      return data.categories;
    },
    staleTime: 5 * 60 * 1000,
  });
}
