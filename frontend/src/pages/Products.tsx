import { useState, useMemo, type FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, ChevronRight as Chevron, WifiOff, X, SlidersHorizontal } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ProductCard } from "@/components/common/ProductCard";
import { CategoryIconGrid } from "@/components/common/CategoryIconGrid";
import { useProducts } from "@/hooks/useProducts";
import { usePageMeta } from "@/hooks/usePageMeta";
import { productCategories } from "@/data/productCategories";
import { brands as allBrands } from "@/config/business";
import type { ProductQuery } from "@/types/product";

const sortOptions: { value: NonNullable<ProductQuery["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Selling / Top Rated" },
  { value: "name_asc", label: "Name: A–Z" },
];

function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-line bg-white">
      <div className="aspect-square bg-line/60" />
      <div className="space-y-2 p-4">
        <div className="h-2.5 w-1/3 rounded bg-line/60" />
        <div className="h-3.5 w-4/5 rounded bg-line/60" />
        <div className="h-3.5 w-1/2 rounded bg-line/60" />
        <div className="mt-3 h-9 w-full rounded-full bg-line/60" />
      </div>
    </div>
  );
}

/** Landing state: categories only, nothing else. Products never render here —
 * per spec, browsing always starts with a category choice, Flipkart-style. */
function CategoryLanding({ onSelect }: { onSelect: (slug: string) => void }) {
  return (
    <Section className="pt-12 md:pt-16">
      <Eyebrow>Shop by Category</Eyebrow>
      <h1 className="mb-8 font-display text-3xl font-bold tracking-tight md:text-4xl">
        What are you looking for?
      </h1>
      <CategoryIconGrid active={undefined} onSelect={(slug) => slug && onSelect(slug)} />

      <div className="mt-16 border-t border-line pt-6 text-center">
        <Link to="/admin/login" className="text-xs text-slate-light hover:text-slate">
          Store Admin
        </Link>
      </div>
    </Section>
  );
}

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  usePageMeta({
    title: "Products | RK Traders — Electrical Wholesale & Retail, Lucknow",
    description: "Browse LED lights, wires, cables, switches, fans, MCBs and 3000+ electrical products at wholesale and retail prices from RK Traders, Lucknow.",
  });

  const activeCategory = searchParams.get("category") ?? undefined;
  const activeBrand = searchParams.get("brand") ?? undefined;
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const inStockOnly = searchParams.get("inStock") === "true";
  const sort = (searchParams.get("sort") as ProductQuery["sort"]) ?? "newest";
  const page = Number(searchParams.get("page") ?? 1);
  const searchTerm = searchParams.get("search") ?? undefined;

  // A search or brand filter also counts as "browsing" — only the bare
  // /products with nothing set shows the category-only landing.
  const hasActiveView = Boolean(activeCategory || activeBrand || searchTerm);

  const query: ProductQuery = useMemo(
    () => ({
      category: activeCategory,
      brand: activeBrand,
      search: searchTerm,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStockOnly || undefined,
      sort,
      page,
      limit: 12,
    }),
    [activeCategory, activeBrand, searchTerm, minPrice, maxPrice, inStockOnly, sort, page]
  );

  const { data, isLoading, isError, error, isPlaceholderData } = useProducts(query, {
    enabled: hasActiveView,
  });
  const activeCategoryName = productCategories.find((c) => c.slug === activeCategory)?.name;

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  }

  function clearAllFilters() {
    setSearchParams(new URLSearchParams());
    setSearchInput("");
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    updateParam("search", searchInput || null);
  }

  if (!hasActiveView) {
    return <CategoryLanding onSelect={(slug) => updateParam("category", slug)} />;
  }

  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message;

  return (
    <Section className="pt-8 md:pt-10">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate">
        <Link to="/products" onClick={clearAllFilters} className="hover:text-volt">
          Products
        </Link>
        {activeCategoryName && (
          <>
            <Chevron size={12} />
            <span className="font-medium text-navy">{activeCategoryName}</span>
          </>
        )}
        {activeBrand && (
          <>
            <Chevron size={12} />
            <span className="font-medium text-navy">{activeBrand}</span>
          </>
        )}
        {searchTerm && (
          <>
            <Chevron size={12} />
            <span className="font-medium text-navy">"{searchTerm}"</span>
          </>
        )}
      </nav>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {activeCategoryName ?? (activeBrand ? `${activeBrand} Products` : "Search Results")}
        </h1>
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, brands, SKUs..."
              className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-volt"
            />
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? "block" : "hidden"} md:block`}>
          <div className="sticky top-24 space-y-6 rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-navy">Filters</h3>
              <button onClick={clearAllFilters} className="text-xs text-volt hover:underline">
                Clear all
              </button>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-light">
                Category
              </h4>
              <select
                value={activeCategory ?? ""}
                onChange={(e) => updateParam("category", e.target.value || null)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              >
                <option value="">All categories</option>
                {productCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-light">
                Brand
              </h4>
              <select
                value={activeBrand ?? ""}
                onChange={(e) => updateParam("brand", e.target.value || null)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              >
                <option value="">All brands</option>
                {allBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-light">
                Price (₹)
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => updateParam("minPrice", e.target.value || null)}
                  placeholder="Min"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
                />
                <span className="text-slate-light">–</span>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => updateParam("maxPrice", e.target.value || null)}
                  placeholder="Max"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
                className="h-4 w-4 rounded border-line accent-volt"
              />
              In stock only
            </label>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-light">
                Sort By
              </h4>
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between md:hidden">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium"
            >
              {filtersOpen ? <X size={15} /> : <SlidersHorizontal size={15} />}
              Filters
            </button>
          </div>

          {isError && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white py-16 text-center">
              <WifiOff size={28} className="text-slate-light" />
              <p className="font-display font-semibold text-navy">
                {errorMessage ?? "Couldn't reach the product API"}
              </p>
              <p className="max-w-sm text-sm text-slate">
                Make sure the backend is running (<code className="font-mono text-xs">npm run dev</code>{" "}
                in <code className="font-mono text-xs">rk-traders-backend</code>) and seeded (
                <code className="font-mono text-xs">npm run seed</code>).
              </p>
            </div>
          )}

          {!isError && (
            <>
              {!isLoading && data && (
                <p className="mb-4 text-sm text-slate">
                  {data.total} product{data.total !== 1 ? "s" : ""} found
                </p>
              )}

              <div
                className={`grid grid-cols-2 gap-4 sm:grid-cols-3 ${
                  isPlaceholderData ? "opacity-60" : ""
                }`}
              >
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                  : data?.products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
              </div>

              {!isLoading && data?.products.length === 0 && (
                <div className="rounded-2xl border border-line bg-white py-16 text-center">
                  <p className="font-display font-semibold text-navy">No products match these filters</p>
                  <p className="mt-1 text-sm text-slate">Try adjusting or clearing your filters.</p>
                  <button onClick={clearAllFilters} className="mt-3 text-sm font-medium text-volt hover:underline">
                    Clear all filters
                  </button>
                </div>
              )}

              {data && data.pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateParam("page", String(Math.max(1, page - 1)))}
                    disabled={page <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-mono text-sm text-slate">
                    {data.page} / {data.pages}
                  </span>
                  <button
                    onClick={() => updateParam("page", String(Math.min(data.pages, page + 1)))}
                    disabled={page >= data.pages}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-6 text-center">
        <Link to="/admin/login" className="text-xs text-slate-light hover:text-slate">
          Store Admin
        </Link>
      </div>
    </Section>
  );
}
