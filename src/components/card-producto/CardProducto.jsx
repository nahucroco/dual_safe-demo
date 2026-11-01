import "./card-producto.css";
import BotonCustom from "../botones/BotonCustom.jsx";
import CardCategoria from "../card-categoria/CardCategoria.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../cart/CartContext.jsx";
import { useEffect, useMemo, useState } from "react";
import { openCart } from "../../utils/cartEvents";

const MAX_TOTAL_CHARS = 10;
const MAX_EACH_CHARS = 14;
const BASE = (import.meta?.env?.BASE_URL || "/").replace(/\/+$/, "");

const DBG_TAG = "%c[CardProducto]";
const DBG_STYLE = "color:#0aa;font-weight:600;";
const warn = (...args) => console.warn(DBG_TAG, DBG_STYLE, ...args);

function truncate(str, n) {
  if (!str) return str;
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export default function CardProducto({
  id,
  codigo,
  name,
  materials = [],
  marca,
  images_urls = [],
  categoria,
  material_simple,
  price,
  image_alt,
  priority = false, // ✅
}) {
  const { add } = useCart();
  const navigate = useNavigate();
  const FALLBACK = `${BASE}/image/error.png`;

  const [coverLoaded, setCoverLoaded] = useState(false);

  const computedUrls = useMemo(() => images_urls.filter(Boolean), [images_urls]);

  const cover = computedUrls[0] || FALLBACK;
  const hover =
    computedUrls[1] && computedUrls[1] !== computedUrls[0]
      ? computedUrls[1]
      : null;

  // ✅ Reset skeleton cuando cambia la imagen
  useEffect(() => {
    setCoverLoaded(false);
  }, [cover]);

  const simpleArr =
    Array.isArray(material_simple) && material_simple.length
      ? material_simple
      : null;

  let m1 = simpleArr ? simpleArr[0] : materials?.[0] ?? null;
  let m2 = simpleArr ? simpleArr[1] ?? null : materials?.[1] ?? null;
  if (m1 && m2 && m1.length + m2.length > MAX_TOTAL_CHARS) m2 = null;

  const m1Disp = m1 ? truncate(m1, MAX_EACH_CHARS) : null;
  const m2Disp = m2 ? truncate(m2, MAX_EACH_CHARS) : null;

  const handleImgError = (e, label) => {
    warn(`onError ${label}`, {
      src: e?.currentTarget?.src,
      currentSrc: e?.currentTarget?.currentSrc,
    });

    if (label === "cover") {
      e.currentTarget.onerror = null;
      e.currentTarget.src = FALLBACK;
    } else if (label === "hover") {
      e.currentTarget.style.display = "none";
    }
  };

  const handleAgregar = () => {
    const item = {
      id,
      codigo,
      name,
      price: Number.isFinite(price) ? Number(price) : 0,
      image: cover || FALLBACK,
      categoria,
      marca,
      materials: simpleArr && simpleArr.length ? simpleArr : materials,
    };
    add(item, 1);
    openCart();
  };

  return (
    <article className="carProducto has-hover">
      <Link
        to={`/producto/${id}`}
        className="card-link"
        aria-label={`Ver detalle de ${name || "producto"}`}
      >
        <div className="card-header">
          <div className={`card-img-wrapper ${coverLoaded ? "is-ready" : "is-loading"}`}>
            {!coverLoaded && <div className="card-img-skeleton" />}

            <div className="card-img-container">
              <img
                src={cover}
                alt={image_alt || name || "Producto"}
                className="card-img img-principal"
                onLoad={() => setCoverLoaded(true)}
                onError={(e) => {
                  setCoverLoaded(true);
                  handleImgError(e, "cover");
                }}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                referrerPolicy="no-referrer"
                fetchpriority={priority ? "high" : "auto"}
              />
            </div>

            {hover && (
              <div className="card-img-container-hover">
                <img
                  src={hover}
                  alt={`${image_alt || name || "Producto"} hover`}
                  className="card-img img-secundaria"
                  onError={(e) => handleImgError(e, "hover")}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <CardCategoria categoria={categoria} />
          </div>

          <div className="card-info-wrapper">
            <span className="Name-Card Titulo-card">{name}</span>

            <div className="card-tags">
              <div className="card-tag-materials">
                {m1Disp && (
                  <span className="opacity-05 Descripcion" title={m1}>
                    {m1Disp}
                  </span>
                )}

                {m2Disp && (
                  <>
                    <svg
                      width="4"
                      height="5"
                      viewBox="0 0 4 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.875 4.39C1.53 4.39 1.22 4.31 0.93 4.14C0.65 3.97 0.42 3.75 0.25 3.46C0.08 3.18 0 2.87 0 2.52C0 2.18 0.08 1.86 0.25 1.58C0.42 1.3 0.65 1.07 0.93 0.90C1.22 0.73 1.53 0.65 1.87 0.65C2.22 0.65 2.54 0.73 2.82 0.90C3.10 1.07 3.33 1.30 3.49 1.58C3.66 1.86 3.75 2.18 3.75 2.52C3.75 2.87 3.66 3.18 3.49 3.46C3.33 3.75 3.10 3.97 2.82 4.14C2.54 4.31 2.22 4.39 1.87 4.39Z"
                        fill="black"
                        fillOpacity="0.5"
                      />
                    </svg>
                    <span className="opacity-05 Descripcion" title={m2}>
                      {m2Disp}
                    </span>
                  </>
                )}
              </div>

              {marca && (
                <div className="card-tag-cve">
                  <span className="Descripcion M-Aux-blanco">{marca}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="card-footer">
        <BotonCustom
          texto="Agregar"
          icon="/assets/svg/carritomas.svg"
          width="152px"
          variante="primario"
          size="S"
          onClick={handleAgregar}
          aria-label={`Agregar ${name || "producto"} al carrito`}
          className="boton-agregar"
        />
      </div>
    </article>
  );
}
