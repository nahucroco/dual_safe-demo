// src/pages/carrito/Carrito.jsx
import "./carrito.css";
import CardCategoria from "../../components/card-categoria/CardCategoria.jsx";
import Contador from "../../components/contador/Contador.jsx";
import BotonCustom from "../../components/botones/BotonCustom.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../cart/CartContext.jsx";

import { avisarDemo } from "../../demo/avisos.js";

function normalizePath(p) {
  if (!p || typeof p !== "string") return "";
  const trimmed = p.trim();
  if (!trimmed) return "";
  if (/^(https?:)?\/\//i.test(trimmed) || /^data:/.test(trimmed) || /^blob:/.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function pickImage(it) {
  const candidates = [
    it?.image,
    Array.isArray(it?.images) ? it.images[0] : null,
    it?.image_filename ? `/assets/productos/${it.image_filename}` : null,
  ].filter(Boolean);

  for (const c of candidates) {
    const path = normalizePath(c);
    if (path) return encodeURI(path);
  }
  return "/image/error.png";
}

const EMOJI_MAP = { manos: "🧤", visual: "👓", cabeza: "🪖", indumentaria: "👕", otros: "📦" };
function emojiFor(cat) {
  const k = String(cat || "").toLowerCase();
  return EMOJI_MAP[k] ?? "•";
}

export default function Carrito() {
  const navigate = useNavigate();
  const { items, totalItems, subtotal, updateQty, remove, clear } = useCart();

  // 👇 ya no hay redirección automática a "/"
  const hasItems = Array.isArray(items) && items.length > 0;

  const buildWappText = () => {
    const header = "¡Hola! Quiero cotizar este pedido:";
    const lines = (items || []).map((it) => {
      const emoji = emojiFor(it.categoria);
      const code = it.codigo ?? "";
      const unidadTxt = it.qty === 1 ? "unidad" : "unidades";
      return `${emoji} [${code}] ${it.name} x ${it.qty} ${unidadTxt}`;
    });
    const footer = "¿Me confirmás stock y Precios? Mi nombre es: ";
    return `${header}\n\n${lines.join("\n")}\n\n${footer}`;
  };


  return (
    <main className="Carrito" role="main">
      <div className="container">
        <header className="carrito-header">
          <div className="carrito-title">
            <h1 className="Subtitulo">Carrito</h1>
          </div>
          <p className="carrito-info Descripcion">
            <img src="/assets/svg/carrito-info.svg" alt="" aria-hidden="true" />
            <span className="span-info">
              Enviás tu pedido directo a nuestro WhatsApp para confirmar stock y precios.
            </span>
          </p>
        </header>

        <div className="carrito-box">
          <div className="carrito-info-cantidad">
            <span className="Field">Total</span>
            <div className="carrito-cantidad">
              <span className="Field">{String(totalItems || 0).padStart(0, "0")}</span>
              <span className="Field">productos</span>
            </div>
          </div>

          {/* Separador */}
          <svg xmlns="http://www.w3.org/2000/svg" width="308" height="2" viewBox="0 0 308 2" fill="none" aria-hidden="true">
            <path d="M0 1H308" stroke="black" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="8 8" />
          </svg>

          {/* Lista de productos */}
          {hasItems ? (
            items.map((it) => {
              const src = pickImage(it);
              return (
                <div className="carrito-producto" key={it.id}>
                  <div className="carrito-producto-img">
                    <Link to={`/producto/${it.id}`} aria-label={`Ver ${it.name}`}>
                      <img
                        src={src}
                        alt={it.name || "Producto"}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/image/error.png";
                        }}
                      />
                    </Link>
                  </div>

                  <div className="carrito-producto-info-container">
                    <div className="carrito-producto-info">
                      <Link to={`/producto/${it.id}`} className="carrito-producto-nombre Descripcion">
                        {it.name}
                      </Link>
                    </div>

                    <div className="carrito-producto-etiquetas">
                      {it.categoria && <CardCategoria categoria={it.categoria} variant="carrito" />}
                      {Array.isArray(it.materials) && it.materials.length > 0 && (
                        <div className="carrito-producto-materiales opacity-05">
                          <span className="Material-1 Descripcion">{it.materials[0]}</span>
                          {it.materials[1] && (
                            <>
                              <img src="/assets/svg/dot-material.svg" alt="" aria-hidden="true" />
                              <span className="Material-2 Descripcion">{it.materials[1]}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <Contador
                      value={it.qty}
                      onChange={(q) => (q <= 0 ? remove(it.id) : updateQty(it.id, q))}
                      onMinus={() => (it.qty <= 1 ? remove(it.id) : updateQty(it.id, it.qty - 1))}
                      onPlus={() => updateQty(it.id, (it.qty || 0) + 1)}
                    />

                    {Number(it.price || 0) > 0 && (
                      <div className="carrito-precio-linea">
                        <span className="Descripcion">
                          ${Number(it.price).toLocaleString("es-AR")} c/u
                        </span>
                        <span className="Descripcion opacity-05">
                          Subtotal: ${Number((it.price || 0) * (it.qty || 0)).toLocaleString("es-AR")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="carrito-vacio">
              <p className="Field">Tu carrito está vacío.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="carrito-footer">
        <div className="carrito-footer-info">
          {hasItems ? (
            <>
              <span className="Field">¿Faltó algo?</span>
              <BotonCustom
                texto="Seguir comprando"
                variante="secundario"
                onClick={() => navigate("/productos")}
              />
            </>
          ) : (
            <>
              <span className="Field">No hay producto</span>
              <BotonCustom
                texto="Seguir comprando"
                variante="secundario"
                onClick={() => navigate("/productos")}
              />
            </>
          )}
        </div>

        <div className="carrito-actions">
          {Number(subtotal) > 0 && (
            <div className="carrito-subtotal">
              <span className="Descripcion">Total estimado:</span>
              <strong className="Subtitulo">
                ${Number(subtotal).toLocaleString("es-AR")}
              </strong>
            </div>
          )}

          <BotonCustom
            icon="/assets/svg/wtsp.svg"
            texto="Cotizar en Whatsapp"
            width="100%"
            variante="primario"
            disabled={!hasItems}
            onClick={() => avisarDemo(`En esta demo no se abre WhatsApp. El sitio original enviaba este pedido a la empresa:\n\n${buildWappText()}`)}
          />
        </div>

        {/* Para volver a mostrar “Vaciar carrito”, descomentá esto */}
        {/* {hasItems && (
          <button className="carrito-clear" onClick={clear}>
            Vaciar carrito
          </button>
        )} */}
      </div>
    </main>
  );
}
