import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/lib/CartContext";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const image = product.images[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-[0_16px_40px_-16px_rgba(10,17,40,0.18)]">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-light">
            No image
          </div>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-navy/60 font-display text-sm font-semibold text-white">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[10px] uppercase tracking-wide text-slate-light">
          {product.brand}
        </p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 font-display text-sm font-semibold text-navy hover:text-volt">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-xs text-slate">
          <Star size={13} className="fill-live text-live" />
          {product.ratings.average.toFixed(1)}
          <span className="text-slate-light">({product.ratings.count})</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-semibold text-navy">
              {formatINR(product.pricing.retailPrice)}
            </span>
          </div>

          <button
            onClick={() => addItem(product, 1, "retail")}
            disabled={!product.inStock}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-navy py-2.5 text-xs font-semibold text-white transition-colors hover:bg-volt disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
