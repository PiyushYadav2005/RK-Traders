export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  pricing: {
    retailPrice: number;
    wholesalePrice: number;
    minWholesaleQty: number;
    gstPercent: number;
    mrp?: number;
  };
  specs: ProductSpec[];
  stock: {
    quantity: number;
    unit: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  isFeatured: boolean;
  inStock: boolean;
}

export interface ProductListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  products: Product[];
}

export interface ProductQuery {
  category?: string;
  brand?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "name_asc";
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
}
