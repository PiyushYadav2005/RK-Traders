import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export function AddedToCartToast() {
  const { justAdded, dismissJustAdded } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(dismissJustAdded, 4500);
    return () => clearTimeout(timer);
  }, [justAdded, dismissJustAdded]);

  if (!justAdded) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-line bg-white p-4 shadow-[0_16px_48px_-12px_rgba(10,17,40,0.35)] sm:left-6 sm:translate-x-0">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CheckCircle2 size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-navy">Added to cart</p>
          <p className="truncate text-xs text-slate">{justAdded.name}</p>
        </div>
        <button onClick={dismissJustAdded} className="text-slate-light hover:text-navy" aria-label="Dismiss">
          <X size={16} />
        </button>
      </div>
      <button
        onClick={() => {
          dismissJustAdded();
          navigate("/cart");
        }}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-navy py-2.5 text-xs font-semibold text-white hover:bg-volt"
      >
        Go to Cart
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
