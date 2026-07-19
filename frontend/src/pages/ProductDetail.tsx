import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Minus, Plus, ShoppingCart, MessageCircle, ChevronRight, PackageCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useProduct } from "@/hooks/useProducts";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCart } from "@/lib/CartContext";
import { business } from "@/config/business";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useProduct(slug);
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [priceMode, setPriceMode] = useState<"retail" | "wholesale">("retail");
  const [added, setAdded] = useState(false);

  usePageMeta({
    title: product ? `${product.name} | RK Traders` : "Product | RK Traders",
    description: product?.description ?? "View product details, pricing, and specifications at RK Traders, Lucknow.",
  });

  if (isLoading) {
    return (
      <Section className="pt-12">
        <div className="grid animate-pulse grid-cols-1 gap-10 md:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-line/60" />
          <div className="space-y-4">
            <div className="h-4 w-1/3 rounded bg-line/60" />
            <div className="h-8 w-3/4 rounded bg-line/60" />
            <div className="h-6 w-1/2 rounded bg-line/60" />
            <div className="h-24 w-full rounded bg-line/60" />
          </div>
        </div>
      </Section>
    );
  }

  if (isError || !product) {
    return (
      <Section className="pt-12 text-center">
        <p className="font-display text-xl font-semibold">Product not found</p>
        <p className="mt-2 text-slate">
          It may be out of stock, unpublished, or the backend isn't running.
        </p>
        <Button as="a" href="/products" className="mt-6">
          Back to Products
        </Button>
      </Section>
    );
  }

  const isWholesaleEligible = quantity >= product.pricing.minWholesaleQty;
  const effectivePrice =
    priceMode === "wholesale" && isWholesaleEligible
      ? product.pricing.wholesalePrice
      : product.pricing.retailPrice;

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity, priceMode === "wholesale" && isWholesaleEligible ? "wholesale" : "retail");
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const whatsappMessage = encodeURIComponent(
    `Hi RK Traders, I'm interested in ${product.name} (SKU: ${product.sku}). Could you share availability and pricing?`
  );

  return (
    <Section className="pt-8 md:pt-10">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-slate">
        <Link to="/" className="hover:text-volt">Home</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-volt">Products</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${product.category.slug}`} className="hover:text-volt">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-surface">
            <img
              src={product.images[activeImage]?.url}
              alt={product.images[activeImage]?.alt}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-volt" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-slate-light">
            {product.brand} · SKU {product.sku}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy md:text-3xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-live text-live" />
              {product.ratings.average.toFixed(1)}
            </div>
            <span className="text-slate-light">({product.ratings.count} reviews)</span>
            {product.inStock ? (
              <span className="ml-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <PackageCheck size={14} /> In Stock
              </span>
            ) : (
              <span className="ml-2 text-xs font-medium text-red-500">Out of Stock</span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate">{product.description}</p>

          {/* Pricing toggle */}
          <div className="mt-6 rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setPriceMode("retail")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  priceMode === "retail" ? "bg-navy text-white" : "bg-surface text-slate"
                }`}
              >
                Retail
              </button>
              <button
                onClick={() => setPriceMode("wholesale")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  priceMode === "wholesale" ? "bg-navy text-white" : "bg-surface text-slate"
                }`}
              >
                Wholesale
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-navy">{formatINR(effectivePrice)}</span>
              <span className="text-xs text-slate">/ {product.stock.unit} · excl. GST ({product.pricing.gstPercent}%)</span>
            </div>
            {priceMode === "wholesale" && !isWholesaleEligible && (
              <p className="mt-1 text-xs text-live-dim">
                Wholesale pricing applies at {product.pricing.minWholesaleQty}+ {product.stock.unit}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-line">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center text-slate hover:text-navy"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-mono text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center text-slate hover:text-navy"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-slate">
                Line total: <strong className="font-mono text-navy">{formatINR(effectivePrice * quantity)}</strong>
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                icon={<ShoppingCart size={16} />}
                className="flex-1"
              >
                {added ? "Added ✓" : "Add to Cart"}
              </Button>
              <Button
                as="a"
                href={`https://wa.me/${business.whatsapp}?text=${whatsappMessage}`}
                variant="secondary"
                icon={<MessageCircle size={16} />}
                className="flex-1"
              >
                Ask on WhatsApp
              </Button>
            </div>
          </div>

          {/* Specs */}
          {product.specs.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-display text-sm font-semibold text-navy">Specifications</h2>
              <dl className="divide-y divide-line rounded-xl border border-line">
                {product.specs.map((spec) => (
                  <div key={spec.key} className="flex justify-between px-4 py-2.5 text-sm">
                    <dt className="text-slate">{spec.key}</dt>
                    <dd className="font-medium text-navy">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
