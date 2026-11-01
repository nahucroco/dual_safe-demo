import { createContext, useContext, useMemo, useState } from "react";

/* ========================
   Helpers
======================== */
const norm = (s) =>
  s?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function toSetNormalized(v) {
  const arr = v instanceof Set ? Array.from(v) : Array.isArray(v) ? v : [v];
  return new Set(arr.filter(Boolean).map(norm));
}

function asArray(v) {
  return Array.isArray(v) ? v : [v].filter(Boolean);
}

/* ========================
   Alias filtro → campo real del producto
   (tu decisión: usar siempre `materials` para material)
======================== */
const FIELD_ALIAS = {
  uso: "uso_recomendado",
  material: "materials",   // 👈 siempre usamos abreviaciones
  marca: "marca",
  categoria: "categoria",
};

/* ========================
   Core matching helpers
======================== */
function valuesForGroup(p, groupKey) {
  const field = FIELD_ALIAS[groupKey] ?? groupKey;
  let val = p[field];
  if (field === "materials" && !Array.isArray(val)) val = val ? [val] : [];
  return Array.isArray(val) ? val : [val].filter(Boolean);
}

/* AND entre grupos, OR dentro del grupo */
function matchSelectedFilters(p, selected) {
  if (!selected || typeof selected !== "object") return true;

  for (const g of Object.keys(selected)) {
    const want = selected[g];
    const empty =
      want == null ||
      (Array.isArray(want) && want.length === 0) ||
      (want instanceof Set && want.size === 0);
    if (empty) continue;

    const need = toSetNormalized(want);
    const vals = valuesForGroup(p, g).map(norm);

    const hasAny = vals.some((v) => need.has(v)); // OR dentro del grupo
    if (!hasAny) return false;                    // AND entre grupos
  }
  return true;
}

/* Igual que el de arriba pero ignorando un grupo (para facetear) */
function matchSelectedFiltersExceptGroup(p, selected, exceptKey) {
  if (!selected || typeof selected !== "object") return true;

  for (const g of Object.keys(selected)) {
    if (g === exceptKey) continue;
    const want = selected[g];
    const empty =
      want == null ||
      (Array.isArray(want) && want.length === 0) ||
      (want instanceof Set && want.size === 0);
    if (empty) continue;

    const need = toSetNormalized(want);
    const vals = valuesForGroup(p, g).map(norm);
    const hasAny = vals.some((v) => need.has(v));
    if (!hasAny) return false;
  }
  return true;
}

/* ========================
   Filtrado por texto (query)
======================== */
function matchQuery(p, q) {
  if (!q) return true;
  const tokens = norm(q).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const bucket = [
    p.name,
    p.marca,
    p.categoria,
    Array.isArray(p.materials) ? p.materials.join(" ") : p.materials,
    // Si querés excluir material_simple del texto, borrá la siguiente línea:
    Array.isArray(p.material_simple) ? p.material_simple.join(" ") : p.material_simple,
    Array.isArray(p.uso_recomendado) ? p.uso_recomendado.join(" ") : p.uso_recomendado,
    p.codigo,
  ]
    .filter(Boolean)
    .map(norm)
    .join(" ");

  return tokens.every((t) => bucket.includes(t));
}

/* ========================
   Contexto
======================== */
const ProductSearchContext = createContext(null);

/* Grupos a facetear (coinciden con tus keys en FILTERS_CONFIG) */
const GROUP_KEYS = ["uso", "marca", "material", "categoria"];

export function ProductSearchProvider({ productos, children }) {
  const [query, setQuery] = useState("");
  // selected ejemplo: { uso: ["metalurgia"], marca: ["libus"], material: ["kevlar"], categoria: "manos" }
  const [selected, setSelected] = useState({});

  /* 1) lista filtrada final */
  const filtered = useMemo(() => {
    if (!Array.isArray(productos)) return [];
    const out = productos.filter(
      (p) => matchQuery(p, query) && matchSelectedFilters(p, selected)
    );
    out.sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));
    return out;
  }, [productos, query, selected]);

  /* 2) facet counts (opciones disponibles según otros filtros + query) */
  const facetCounts = useMemo(() => {
    const out = Object.fromEntries(GROUP_KEYS.map((k) => [k, {}]));
    if (!Array.isArray(productos)) return out;

    for (const p of productos) {
      // 2.1: el producto debe pasar la búsqueda de texto
      if (!matchQuery(p, query)) continue;

      // 2.2: para cada grupo, contamos si pasa los otros filtros
      for (const g of GROUP_KEYS) {
        if (!matchSelectedFiltersExceptGroup(p, selected, g)) continue;

        const vals = valuesForGroup(p, g);
        for (const raw of vals) {
          const key = norm(raw);
          out[g][key] = (out[g][key] || 0) + 1;
        }
      }
    }

    return out;
  }, [productos, query, selected]);

  /* 3) value del contexto (usar facetCounts aquí ya es seguro) */
  const value = useMemo(
    () => ({
      query,
      setQuery,
      selected,
      setSelected,
      filtered,
      facetCounts, // 👈 disponible para deshabilitar opciones
      total: Array.isArray(productos) ? productos.length : 0,
      filteredCount: filtered.length,
    }),
    [query, selected, filtered, productos, facetCounts]
  );

  return (
    <ProductSearchContext.Provider value={value}>
      {children}
    </ProductSearchContext.Provider>
  );
}

export function useProductSearch() {
  const ctx = useContext(ProductSearchContext);
  if (!ctx) throw new Error("useProductSearch debe usarse dentro de <ProductSearchProvider>");
  return ctx;
}
