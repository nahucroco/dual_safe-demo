import { useEffect, useRef } from "react";
import "./cart-drawer.css";
import { useCart } from "../../cart/CartContext.jsx";
import { Link } from "react-router-dom";
import BotonCustom from "../botones/BotonCustom.jsx";
import CardCategoria from "../card-categoria/CardCategoria.jsx";
import Contador from "../contador/Contador.jsx";

import { avisarDemo } from "../../demo/avisos.js";

// ===== Helpers =====
function normalizePath(p) {
  if (!p || typeof p !== "string") return "";
  const t = p.trim();
  if (!t) return "";
  if (/^(https?:)?\/\//i.test(t) || /^data:/.test(t) || /^blob:/.test(t)) return t;
  return t.startsWith("/") ? t : `/${t}`;
}
function pickImage(it) {
  const c = [
    it?.image,
    Array.isArray(it?.images) ? it.images[0] : null,
    it?.image_filename ? `/assets/productos/${it.image_filename}` : null,
  ].filter(Boolean);
  for (const x of c) {
    const path = normalizePath(x);
    if (path) return encodeURI(path);
  }
  return "/image/error.png";
}
const EMOJI_MAP = { manos: "🧤", visual: "👓", cabeza: "🪖", indumentaria: "👕", otros: "📦" };
const emojiFor = (cat) => EMOJI_MAP[String(cat || "").toLowerCase()] ?? "•";
// ====================

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, updateQty, remove } = useCart();
  const hasItems = Array.isArray(items) && items.length > 0;
  const scrollLockRef = useRef({ y: 0, prev: {} });

  // refs para focus management
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const prevFocusRef = useRef(null);

  // bloqueo de scroll + Escape
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // mover foco al abrir y devolverlo al cerrar
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement;
      // dar tiempo a montar el panel
      setTimeout(() => panelRef.current?.focus(), 0);
    } else {
      // si se cerró y el foco quedó adentro, sacarlo y devolverlo
      const active = document.activeElement;
      if (rootRef.current?.contains(active)) active?.blur?.();
      prevFocusRef.current?.focus?.();
    }
  }, [open]);

  // ✅ BLOQUEO DE SCROLL ROBUSTO (desktop + iOS)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (open) {
      const y = window.scrollY || html.scrollTop || body.scrollTop || 0;
      scrollLockRef.current.y = y;

      // guarda estilos previos para restaurar luego
      scrollLockRef.current.prev = {
        bodyPos: body.style.position,
        bodyTop: body.style.top,
        bodyLeft: body.style.left,
        bodyRight: body.style.right,
        bodyWidth: body.style.width,
        bodyOverflow: body.style.overflow,
        bodyTouchAction: body.style.touchAction,
        htmlOverscroll: html.style.overscrollBehavior,
        htmlScrollBehavior: html.style.scrollBehavior,
      };

      // evita saltos por scrollTo suave mientras cambiamos estilos
      html.style.scrollBehavior = "auto";

      // lock real del body (sin “bypass” del navegador)
      body.style.position = "fixed";
      body.style.top = `-${y}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";    // refuerzo
      body.style.touchAction = "none";    // corta scroll táctil iOS en el body
      html.style.overscrollBehavior = "none"; // evita rubber-band en viewport
    } else {
      const { y, prev } = scrollLockRef.current;

      // restaurar estilos
      body.style.position = prev.bodyPos || "";
      body.style.top = prev.bodyTop || "";
      body.style.left = prev.bodyLeft || "";
      body.style.right = prev.bodyRight || "";
      body.style.width = prev.bodyWidth || "";
      body.style.overflow = prev.bodyOverflow || "";
      body.style.touchAction = prev.bodyTouchAction || "";
      html.style.overscrollBehavior = prev.htmlOverscroll || "";
      html.style.scrollBehavior = prev.htmlScrollBehavior || "";

      // volver a la misma posición de scroll
      window.scrollTo(0, y || 0);
    }
  }, [open]);

  // focus trap dentro del panel (Tab/Shift+Tab)
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;

    const selector = [
      "a[href]", "button:not([disabled])", "input:not([disabled])",
      "select:not([disabled])", "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(el.querySelectorAll(selector));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const buildWappText = () => {
    const header = "¡Hola! Quiero cotizar este pedido:";
    const lines = (items || []).map((it) => {
      const emoji = emojiFor(it.categoria);
      const code = it.codigo ?? "";
      const unidadTxt = (it.qty || 0) === 1 ? "unidad" : "unidades";
      return `${emoji} [${code}] ${it.name} x ${it.qty || 0} ${unidadTxt}`;
    });
    const footer = "¿Me confirmás stock y precios? Mi nombre es: ";
    return `${header}\n\n${lines.join("\n")}\n\n${footer}`;
  };

  return (
    <div
      ref={rootRef}
      className={`cart-drawer ${open ? "is-open" : ""}`}
      aria-hidden={open ? undefined : true}   // ❗ no ocultar cuando está abierto
      inert={!open ? true : undefined}        // ❗ evita foco/inputs cuando está cerrado
    >
      <button className="cart-drawer__backdrop" onClick={onClose} aria-label="Cerrar carrito" />

      <aside
        ref={panelRef}
        className="cart-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        tabIndex={-1}                         // ❗ permite enfocar el panel
      >
        <div className="drawer-inner">
          <div className="drawer-header">
            <h2 className="drawer-title Subtitulo M-Aux-Negro">Carrito</h2>
            <div>
              <img src="/assets/svg/carrito-info.svg" alt="" aria-hidden="true" />
              <p className="Descripcion">Enviás tu pedido directo a nuestro WhatsApp para confirmar stock y precios.</p>
            </div>
          </div>

          <section className="drawer-card">
            <div className="drawer-toprow">
              <span className="Field">Total</span>
              <div className="drawer-toprow__qty">
                <span className="Field">{String(hasItems ? items.length : 0)}</span>
                <span className="Field">productos</span>
              </div>
            </div>

            <div className="drawer-sep">
              <hr className="sep-dashed">
              </hr>
            </div>

            <div className={`drawer-list ${!hasItems ? "is-empty" : ""}`}>
              {!hasItems && <p className="Field">Tu carrito está vacío.</p>}
              {hasItems && items.map((it) => {
                const src = pickImage(it);
                const hasPrice = Number(it.price || 0) > 0;
                return (
                  <div className="drawer-item" key={it.id}>

                    <div className="container-1">

                      <div className="drawer-item__img">
                        <img
                          src={src}
                          alt={it.name || "Producto"}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/image/error.png"; }}
                        />
                      </div>

                      <div className="drawer-item__info">
                        <Link to={`/producto/${it.id}`} className="drawer-item__name Descripcion" onClick={onClose}>
                          {it.name}
                        </Link>

                        <div className="drawer-item__tags">
                          {it.categoria && <CardCategoria categoria={it.categoria} variant="carrito" />}
                          {Array.isArray(it.materials) && it.materials.length > 0 && (
                            <div className="drawer-item__materials opacity-05">
                              <span className="Descripcion">{it.materials[0]}</span>
     
                            </div>
                          )}
                        </div>

                      </div>

                      {hasPrice && <div className="drawer-item__price Descripcion">
                        ${Number(it.price).toLocaleString("es-AR")} c/u
                      </div>}

                    </div>

                    <div className="drawer-item__qtyrow">
                      <Contador
                        value={it.qty}
                        onChange={(q) => (q <= 0 ? remove(it.id) : updateQty(it.id, q))}
                        onMinus={() => (it.qty <= 1 ? remove(it.id) : updateQty(it.id, it.qty - 1))}
                        onPlus={() => updateQty(it.id, (it.qty || 0) + 1)}
                      />
                    </div>

                    {hasPrice && (
                      <div className="drawer-item__subtotal Descripcion">
                        ${Number((it.price || 0) * (it.qty || 0)).toLocaleString("es-AR")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
        <footer className="cart-drawer__footer">
          <div className="container-1">
            <p className="Field">¿Faltó algo?</p>
            <Link
              to="/productos"
              className="seguir-comprando-link Field"
              onClick={onClose}              // cierra el carrito al navegar
              aria-label="Ir a la sección productos"
            >
              Seguir comprando
            </Link>
          </div>
          <BotonCustom
            icon="/assets/svg/wtsp.svg"
            texto="Cotizar en Whatsapp"
            width="100%"
            variante="primario"
            disabled={!hasItems}
            onClick={() => avisarDemo(`En esta demo no se abre WhatsApp. El sitio original enviaba este pedido a la empresa:\n\n${buildWappText()}`)}
          />
        </footer>

      </aside>
    </div>
  );
}
