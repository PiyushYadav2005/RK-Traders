import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/types/product";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  unit: string;
}

interface CartContextValue {
  lines: CartLine[];
  addItem: (product: Product, quantity?: number, priceMode?: "retail" | "wholesale") => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  justAdded: CartLine | null;
  dismissJustAdded: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rk_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [justAdded, setJustAdded] = useState<CartLine | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  function addItem(product: Product, quantity = 1, priceMode: "retail" | "wholesale" = "retail") {
    const unitPrice =
      priceMode === "wholesale" ? product.pricing.wholesalePrice : product.pricing.retailPrice;

    const newLine: CartLine = {
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "",
      unitPrice,
      quantity,
      unit: product.stock.unit,
    };

    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product._id);
      if (existing) {
        return prev.map((l) =>
          l.productId === product._id ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, newLine];
    });

    setJustAdded(newLine);
  }

  function removeItem(productId: string) {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }

  function setQuantity(productId: string, quantity: number) {
    setLines((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, quantity: Math.max(1, quantity) } : l))
    );
  }

  function clear() {
    setLines([]);
  }

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        addItem,
        removeItem,
        setQuantity,
        clear,
        itemCount,
        subtotal,
        justAdded,
        dismissJustAdded: () => setJustAdded(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
