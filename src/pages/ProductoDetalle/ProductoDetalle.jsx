// src/pages/producto/ProductoDetalle.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Contador from "../../components/contador/Contador.jsx";
import BotonCustom from "../../components/botones/BotonCustom.jsx";
import CardProducto from "../../components/card-producto/CardProducto.jsx";
import { useCart } from "../../cart/CartContext.jsx";
import "./ProductoDetalle.css";
import Spinner from "../../components/ui/Spinner.jsx";
import { cargarProductos } from "../../demo/catalogo";

const BASE = (import.meta?.env?.BASE_URL || "/").replace(/\/+$/, "");

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();

  const [producto, setProducto] = useState(null);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [imagenes, setImagenes] = useState([]);
  const [principalIndex, setPrincipalIndex] = useState(0);

  // --- Barra que sigue y se detiene ---
  const scopeRef = useRef(null);
  const stopRef = useRef(null);
  const barRef = useRef(null);
  const spacerRef = useRef(null);

  const [stuck, setStuck] = useState(false);
  const [barH, setBarH] = useState(0);

  // mide la barra y ajusta spacer
  useEffect(() => {
    const el = barRef.current;
    const sp = spacerRef.current;
    if (!el || !sp) return;

    const measure = () => {
      const h = Math.round(el.getBoundingClientRect().height || 0);
      setBarH(h);
      document.documentElement.style.setProperty("--comprabar-h", `${h}px`);
      sp.style.height = `${h}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // alterna entre fixed y stuck según el STOP
  useEffect(() => {
    const onScroll = () => {
      const stop = stopRef.current;
      if (!stop) return;
      const rect = stop.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const reached = rect.top <= (viewportH - barH);
      setStuck(reached);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [barH]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      setLoading(true);
      try {
        const productos = await cargarProductos(signal);
        const p = productos.find((r) => String(r.id) === String(id));
        if (!p) {
          navigate("/404", { replace: true });
          return;
        }
        const sim = productos.filter((r) => r.categoria === p.categoria && r.id !== p.id).slice(0, 8);
        if (signal.aborted) return;

        setProducto(p);
        setSimilares(sim);
        setQty(1);

        setImagenes(p.images_urls);
        setPrincipalIndex(0);
      } catch (err) {
        if (err?.name === "AbortError") return;
        // Cualquier error manda a 404 en esta vista
        navigate("/404", { replace: true });
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, navigate]);

  const fichaUrl = producto?.pdf_url ?? null;

  if (loading) return <Spinner text="Cargando producto…" />;
  if (!producto) return null;

  const handleAgregar = () => {
    if (!producto || qty <= 0) return;
    const item = {
      id: producto.id,
      codigo: producto.codigo,
      name: producto.name,
      price: Number.isFinite(producto.price) ? Number(producto.price) : 0,
      image: imagenes[principalIndex] || `${BASE}/image/error.png`,
      categoria: producto.categoria,
      marca: producto.marca,
      materials: producto.material_simple?.length
        ? producto.material_simple
        : producto.materials,
    };
    add(item, qty);
    setQty(1);
    window.dispatchEvent(
      new CustomEvent("cart:open", { detail: { source: "producto-detalle", item, qty } })
    );
  };

  const CERT_ICON_MAP = {
    iram: "/assets/img/certificados/iram.png",
    ansi: "/assets/img/certificados/ansi.png",
    en: "/assets/img/certificados/en.png",
  };

  function certKey(s) {
    if (!s) return null;
    const k = String(s)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().trim();
    if (k.startsWith("iram")) return "iram";
    if (k.startsWith("ansi")) return "ansi";
    if (k === "en" || k.startsWith("en ")) return "en";
    return null;
  }

  return (
    <div className="Producto-general">
      <div className="Producto-Detalle">
        {/* === ÁREA QUE DEBE SEGUIR Y LUEGO DETENERSE === */}
        <section className="CompraScope" ref={scopeRef}>
          {/* Imagen + header */}
          <div className="Producto-detalle-query">
            <div className="Producto-Img-Box">
              <h1 className="Subtitulox Titulo-detalle-product text-left">{producto.name}</h1>

              <div className="Producto-Detalle-Header">
                <div className="Producto-Img-principal">
                  {imagenes[principalIndex] ? (
                    <img
                      src={imagenes[principalIndex]}
                      alt={producto.image_alt || producto.name}
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="Producto-Img-placeholder">
                      <Spinner text="Cargando imagen…" />
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbs */}
              <div className="Producto-Img-pie">
                {imagenes.slice(0, 4).map((img, i) => {
                  const active = principalIndex === i;
                  return (
                    <div
                      className={"Producto-Img-thumb" + (active ? " is-active" : "")}
                      key={i}
                      onClick={() => img && setPrincipalIndex(i)}
                      style={{ cursor: img ? "pointer" : "default" }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`${producto.name} miniatura ${i + 1}`}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="Producto-Img-placeholder">
                          <Spinner text="" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detalles */}
            <div className="Producto-Detalle-info">
              <div className="Producto-Detalle-info-group">
                <div className="Producto-Detalle-info-detalle">
                  <h1 className="query Subtitulo text-left">{producto.name}</h1>
                  <div className="CompraBar__innerx">
                    <div className="barra"></div>

                    <Contador
                      value={qty}
                      min={1}
                      onChange={(q) => setQty(Math.max(1, q))}
                      onMinus={(q) => setQty(Math.max(1, q))}
                      onPlus={(q) => setQty(Math.max(1, q))}
                    />
                    <BotonCustom
                      texto="Agregar"
                      variante="primario"
                      icon="/assets/svg/carritomas.svg"
                      width="180px"
                      size="M"
                      onClick={handleAgregar}
                      disabled={qty < 1}
                    />
                  </div>
                  <div className="CompraDetails">
                    <span className="Producto">Detalles</span>
                    <span className="Body text-left">
                      {producto.long_description || "Sin descripción disponible."}
                    </span>
                  </div>
                </div>

                {/* Etiquetas */}
                <div className="Producto-Detalle-info-etiquetas">
                  <img src="/assets/svg/etiqueta.svg" alt="Etiqueta de inicio" />
                  {(producto.tags || ["CVE", producto.categoria, producto.material_simple?.[0]])
                    .filter(Boolean)
                    .map((tag, idx, arr) => (
                      <span key={idx} className="Field" style={{ display: "inline-flex", alignItems: "center" }}>
                        {idx > 0 && (
                          <img src="/assets/svg/separador.svg" alt="|" style={{ margin: "0 6px" }} />
                        )}
                        {tag}
                        {idx === arr.length - 1 && (
                          <img src="/assets/svg/separador.svg" alt="Etiqueta de cierre" style={{ marginLeft: 6 }} />
                        )}
                      </span>
                    ))}
                </div>
              </div>

              <div className="fichatecnica-certificaciones">
                {/* Ficha técnica */}
                <div className="Producto-Detalle-info-ficha">
                  <span className="Producto">Ficha Técnica</span>
                  {fichaUrl ? (
                    <a href={fichaUrl} download target="_blank" rel="noopener noreferrer" type="application/pdf">
                      <BotonCustom texto="Descargar PDF" variante="secundario" icon="/assets/svg/documento.svg" size="M" />
                    </a>
                  ) : (
                    <BotonCustom texto="No disponible" variante="primario" icon="/assets/svg/documento.svg" size="M" disabled />
                  )}
                </div>

                {/* Certificaciones */}
                <div className="Producto-Detalle-info-certificaciones">
                  <span className="Producto">Certificaciones</span>
                  {(() => {
                    const arr = Array.isArray(producto?.certificacion) ? producto.certificacion : [];
                    const keys = Array.from(new Set(arr.map(certKey).filter(Boolean)));
                    if (keys.length === 0) {
                      return <span className="Body">Sin certificaciones declaradas.</span>;
                    }
                    return (
                      <div className="Cert-list">
                        {["iram", "ansi", "en"].map((k) =>
                          keys.includes(k) ? (
                            <img
                              key={k}
                              className={`Cert-icon Cert-${k}`}
                              src={CERT_ICON_MAP[k]}
                              alt={`Certificación ${k.toUpperCase()}`}
                              title={`Certificación ${k.toUpperCase()}`}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : null
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* PUNTO DE CORTE: movelo donde quieras frenar la barra */}
          <div ref={stopRef} className="CompraStop" aria-hidden="true" />

          {/* Spacer para que el contenido no quede debajo de la barra cuando está fixed */}
          <div ref={spacerRef} className="CompraBarSpacer" aria-hidden="true" />

          {/* Barra que sigue y se detiene */}
          <div
            ref={barRef}
            className={`CompraBar ${stuck ? "is-stuck" : "is-fixed"}`}
          >
            <div className="CompraBar__inner">
              <Contador
                value={qty}
                min={1}
                onChange={(q) => setQty(Math.max(1, q))}
                onMinus={(q) => setQty(Math.max(1, q))}
                onPlus={(q) => setQty(Math.max(1, q))}
              />
              <BotonCustom
                texto="Agregar"
                variante="primario"
                icon="/assets/svg/carritomas.svg"
                width="180px"
                size="M"
                onClick={handleAgregar}
                disabled={qty < 1}
              />
            </div>
          </div>
        </section>

        {/* Fuera del scope: ya NO te sigue */}
        <div className="Producto-Detalle-similar">
          <span className="Producto">Similar</span>
          <div className="Producto-Detalle-similar-container">
            {similares.length === 0 ? (
              <span className="Descripcion">No hay productos similares por ahora.</span>
            ) : (
              similares.map((p) => (
                <CardProducto
                  key={p.id}
                  id={p.id}
                  codigo={p.codigo}
                  name={p.name}
                  materials={p.materials}
                  marca={p.marca}
                  images={p.images}
                  images_urls={p.images_urls}
                  image_alt={p.image_alt}
                  categoria={p.categoria}
                  material_simple={p.material_simple}
                  price={p.price}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
