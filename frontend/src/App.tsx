import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { AddedToCartToast } from "@/components/common/AddedToCartToast";
import { CartProvider } from "@/lib/CartContext";
import { routes } from "@/pages/routes";
import { AdminApp } from "@/admin/AdminApp";

function PublicSite() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>
        <Footer />
        <FloatingActions />
        <AddedToCartToast />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin panel: separate shell, no public Header/Footer/Cart */}
        <Route path="/admin/*" element={<AdminApp />} />
        {/* Public site: everything else */}
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
