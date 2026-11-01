// src/components/Sections/Productos/SectionProductos.jsx
import { useMemo, useState } from "react";
import CardProducto from "../../card-producto/CardProducto.jsx";
import "./SectionProductos.css";
import BotonCustom from "../../botones/BotonCustom.jsx";
import useProductos from "../../../hooks/useProductos.js";

const BASE = (import.meta.env?.BASE_URL ?? "/").replace(/\/+$/, "/");
const PLACEHOLDER = `${BASE}image/error.png`;

const CATS = ["Manos", "Visual", "Cabeza", "Indumentaria"];

const CAT_ICONS = {
  Manos:        `${BASE}assets/svg/CardCategoria/Manos.svg`,
  Visual:       `${BASE}assets/svg/CardCategoria/Visual.svg`,
  Cabeza:       `${BASE}assets/svg/CardCategoria/Cabeza.svg`,
  Indumentaria: `${BASE}assets/svg/CardCategoria/Indumentaria.svg`,
};

const CAT_COLORS = {
  Manos: "#4525B9",
  Cabeza: "#B4B925",
  Indumentaria: "#B92525",
  Visual: "#25B99C",
};

function StaticCard() {
  return (
    <article className="carProducto carProducto--static" aria-hidden="true">
      <div className="card-media">
        <img src={PLACEHOLDER} alt="" />
      </div>
      <h3 className="card-title">Cargando productos...</h3>
      <div className="card-tags"></div>
    </article>
  );
}

// normaliza activo: soporta si_activo boolean o status de Directus
const isActive = (p) => {
  if (typeof p?.si_activo === "boolean") return p.si_activo;
  const s = String(p?.status || "").toLowerCase().trim();
  return s === "activo" || s === "active" || s === "published";
};

// normaliza categoría (si necesitás mapear variantes, agregalas acá)
const normalizeCat = (raw) => {
  const s = String(raw || "").trim();
  // ejemplo de mapeos opcionales:
  // if (/^guantes?/i.test(s)) return "Manos";
  return s;
};

function padToMin(arr, min = 4) {
  const out = arr.slice(0, min);
  while (out.length < min) out.push(null);
  return out;
}

export default function SectionProductos() {
  const { productos, loading, error } = useProductos();
  const [active, setActive] = useState("Manos");

  // activos (el hook ya ordena por sort_order)
  const activos = useMemo(
    () => (Array.isArray(productos) ? productos.filter(isActive) : []),
    [productos]
  );

  // agrupar por categoría normalizada
  const grouped = useMemo(() => {
    const out = Object.fromEntries(CATS.map((c) => [c, []]));
    for (const p of activos) {
      const cat = normalizeCat(p.categoria);
      if (out[cat]) out[cat].push(p);
    }

    return out;
  }, [activos]);

  // fallback global: primeros 4 activos
  const topFour = useMemo(() => activos.slice(0, 4), [activos]);

  // MOBILE/TABLET: 1 por categoría (si no hay, usa topFour), padded a 4
  const miniCandidates = useMemo(() => {
    const mini = CATS.map((c) => grouped[c]?.[0]).filter(Boolean);
    return mini.length ? mini : topFour;
  }, [grouped, topFour]);

  const miniPadded = useMemo(() => padToMin(miniCandidates, 4), [miniCandidates]);

  // partir en filas de 2
  const rowsOf2 = useMemo(() => {
    const out = [];
    for (let i = 0; i < miniPadded.length; i += 2) out.push(miniPadded.slice(i, i + 2));
    return out;
  }, [miniPadded]);

  // DESKTOP: 4 de la activa (si no hay, usa topFour), padded a 4
  const currentFourPadded = useMemo(() => {
    const list = (grouped[active] || []);
    const chosen = list.length ? list.slice(0, 4) : topFour;
    return padToMin(chosen, 4);
  }, [grouped, active, topFour]);

  const renderCard = (p, idxKey = 0) =>
    p ? (
      <CardProducto
        key={p.id ?? p.codigo ?? `${p.name}-${idxKey}`}
        id={p.id}
        codigo={p.codigo}
        name={p.name}
        materials={p.materials}
        marca={p.marca}
        images_urls={p.images_urls}   // usa las URLs del hook
        images={p.images}             // opcional: crudo de Directus
        image_alt={p.image_alt}
        material_simple={p.material_simple}
        price={p.price}
      />
    ) : (
      <StaticCard key={`static-${idxKey}`} />
    );

  return (
    <section className="sectionProductos" aria-labelledby="productos-title">
      <div className="container-1">
        <p id="productos-title" className="Subtitulo">Productos</p>
        <p className="Body">
          Guantes de seguridad, indumentaria de protección en cuero y textil, cascos, lentes y más.
        </p>
      </div>

      {loading && <p className="Body" style={{ opacity: 0.7 }}>Cargando productos…</p>}
      {error && <p className="Body" style={{ color: "#c00" }}>Error cargando productos: {String(error?.message || error)}</p>}

      {!loading && (
        <div className="productos-mobile">
          {rowsOf2.map((row, i) => (
            <div className="fila" key={i}>
              {row.map((item, j) => renderCard(item, `${i}-${j}`))}
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="productos-desktop">
          <div className="cat-tabs" role="tablist" aria-label="Categorías de productos">
            {CATS.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                className={`cat-tab ${active === c ? "active" : ""}`}
                onClick={() => setActive(c)}
                style={{ "--cat-color": CAT_COLORS[c] }}
                disabled={(grouped[c] || []).length === 0 && !topFour.length}
                title={(grouped[c] || []).length === 0 ? "Sin productos aún" : c}
              >
                <img src={CAT_ICONS[c]} alt="" aria-hidden="true" className="cat-icon" />
              </button>
            ))}
          </div>

          <div className="grid-four">
            <div className="rectangulo-fade-left"></div>
            {currentFourPadded.map((item, i) => renderCard(item, i))}
            <div className="rectangulo-fade-right"></div>
          </div>
        </div>
      )}

      <div className="container-3">
        <p className="Body">Encontrá el equipo ideal para trabajar protegido y cómodo</p>
        <BotonCustom texto="Ver todos" width="180px" variante="primario" size="M" />
      </div>
    </section>
  );
}
