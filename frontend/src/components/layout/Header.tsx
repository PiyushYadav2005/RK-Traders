import { useState, useEffect } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Menu, X, Zap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/CartContext";
import type { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "Products", href: "/products" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md ${
        scrolled
          ? "shadow-[0_1px_0_0_rgba(10,17,40,0.06)]"
          : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt text-white">
            <Zap size={18} strokeWidth={2.5} />
          </span>
          <span className="text-lg leading-none">
            RK Traders
            <span className="block font-mono text-[10px] font-normal tracking-wide text-slate">
              ELECTRICAL SUPPLY
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <RouterNavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `font-display text-sm font-medium transition-colors hover:text-volt ${
                  isActive ? "text-volt" : "text-navy/80"
                }`
              }
            >
              {link.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/cart" className="relative text-navy/80 hover:text-volt" aria-label="View cart">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-live text-[10px] font-bold text-navy">
                {itemCount}
              </span>
            )}
          </Link>
          <Button as="a" href="/quote" variant="live">
            Get Quote
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-base font-medium text-navy"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 font-display text-base font-medium text-navy"
            >
              <ShoppingCart size={18} />
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            <Button as="a" href="/quote" variant="live" className="mt-2 w-full">
              Get Quote
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
