import type { ReactNode } from "react";
import { Home } from "@/pages/Home";
import { Products } from "@/pages/Products";
import { ProductDetail } from "@/pages/ProductDetail";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { Contact } from "@/pages/Contact";
import { Gallery } from "@/pages/Gallery";
import { FAQ } from "@/pages/FAQ";
import { About } from "@/pages/About";
import { Wholesale } from "@/pages/Wholesale";
import { ReturnPolicy } from "@/pages/ReturnPolicy";
import { Quote } from "@/pages/Quote";
import { ComingSoon } from "@/components/common/ComingSoon";

interface RouteDef {
  path: string;
  element: ReactNode;
}

// Full sitemap. Home, Products, Product Detail, Cart, Checkout, Contact,
// Gallery, FAQ, About, Wholesale, Return Policy, and Quote are built out;
// remaining pages are scaffolded as placeholders. Blog, Shipping Policy,
// Track Order, Dealer Registration, and Careers have been removed from the
// site per project scope.
export const routes: RouteDef[] = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/products/:slug", element: <ProductDetail /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/wholesale", element: <Wholesale /> },
  { path: "/about", element: <About /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/contact", element: <Contact /> },
  { path: "/quote", element: <Quote /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/return-policy", element: <ReturnPolicy /> },
  {
    path: "/privacy-policy",
    element: <ComingSoon title="Privacy Policy" description="How we handle your data." />,
  },
  {
    path: "/terms",
    element: <ComingSoon title="Terms & Conditions" description="Terms of use for this website." />,
  },
];
