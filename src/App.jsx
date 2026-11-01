// App.jsx
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { Principal } from "./pages/Principal/Principal.jsx";
import Productos from "./pages/Productos/Productos.jsx";
import { Empresa } from "./pages/Empresa/Empresa.jsx";
import { Contacto } from "./pages/Contacto/Contacto.jsx";
import PoliticaCambios from "./pages/PoliticaCambios/PoliticaCambios.jsx";
import ProductoDetalle from "./pages/ProductoDetalle/ProductoDetalle.jsx";

import NavMobile from "./components/nav/Navigator.jsx";
import Footer from "./components/footer/Footer.jsx";
import CartDrawer from "./components/cart-drawer/CartDrawer.jsx";

import ScrollToTop from "./ScrollToTop";
import ErrorBoundary from "./ErrorBoundary";
import DemoAvisos from "./demo/DemoAvisos.jsx";

// ========== Layout principal ==========
function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  // Eventos globales para abrir/cerrar/toggle del carrito
  useEffect(() => {
    const onOpen   = () => setCartOpen(true);
    const onClose  = () => setCartOpen(false);
    const onToggle = () => setCartOpen(v => !v);

    window.addEventListener("cart:open", onOpen);
    window.addEventListener("cart:close", onClose);
    window.addEventListener("cart:toggle", onToggle);
    return () => {
      window.removeEventListener("cart:open", onOpen);
      window.removeEventListener("cart:close", onClose);
      window.removeEventListener("cart:toggle", onToggle);
    };
  }, []);

  return (
    <>
      <NavMobile />
      <Outlet />
      <Footer />
      {/* Drawer global */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

// ========== Ruta “fantasma” para abrir el carrito desde /carrito ==========
function OpenCartRoute() {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cart:open"));
  }, []);
  return null;
}

// ========== App raíz ==========
export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <DemoAvisos />
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Principal />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/politica-cambios" element={<PoliticaCambios />} />
            {/* Abrir carrito por URL */}
            <Route path="/carrito" element={<OpenCartRoute />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ padding: "2rem" }}>
                <h1>404 — No encontrado</h1>
                <button onClick={() => window.history.back()}>Volver</button>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
