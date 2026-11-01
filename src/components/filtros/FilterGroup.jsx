import { useMemo, useState, useRef, useEffect } from "react";
import "./filtros.css";
import { useProductSearch } from "../../search/ProductSearchContext";

function useMediaQuery(q) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(q).matches : false
  );
  useEffect(() => {
    const m = window.matchMedia(q);
    const h = () => setMatches(m.matches);
    h();
    if (m.addEventListener) m.addEventListener("change", h);
    else m.addListener(h);
    return () => {
      if (m.removeEventListener) m.removeEventListener("change", h);
      else m.removeListener(h);
    };
  }, [q]);
  return matches;
}

export default function FilterGroup({ group, value, onChange }) {
  const { facetCounts } = useProductSearch();

  const {
    label,
    type,
    options = [],
    searchable = false,
    key: groupKey,
  } = group;

  const isMulti = type === "multi";
  const isSingle = type === "single";

  // ---- state UI
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [qDeb, setQDeb] = useState("");

  // ---- debounce simple para el buscador del grupo
  const tRef = useRef();
  useEffect(() => {
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setQDeb(q), 180);
    return () => clearTimeout(tRef.current);
  }, [q]);

  // ---- regular desplegable segun mobile o desktop
  const rootRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 1440px)");

  useEffect(() => {
    if (!open || !isDesktop) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, isDesktop]);

  // ---- helpers
  const safeKey =
    groupKey || label?.toString().replace(/\s+/g, "-").toLowerCase() || "grupo";

  const countsForGroup = facetCounts?.[safeKey] || {};
  const norm = (s) =>
    (s ?? "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const getCount = (val) => countsForGroup[norm(val)] || 0;

  // ---- filtra opciones por texto
  const filtered = useMemo(() => {
    if (!searchable || !qDeb) return options;
    const ql = qDeb.toLowerCase();
    return options.filter((o) => (o.label || "").toLowerCase().includes(ql));
  }, [options, searchable, qDeb]);

  // ---- deshabilitar grupo si todo da 0 (y no hay nada seleccionado en él)
  const allZero = useMemo(() => {
    const hasSelection = Array.isArray(value) ? value.length > 0 : !!value;
    if (hasSelection) return false;
    return options.every((opt) => getCount(opt.value) === 0);
  }, [options, value, countsForGroup]); // countsForGroup cambia cuando facetCounts cambia

  // ---- toggles
  const toggleMulti = (val) => {
    const curr = Array.isArray(value) ? value : [];
    const set = new Set(curr);
    set.has(val) ? set.delete(val) : set.add(val);
    onChange(Array.from(set));
  };

  const toggleSingle = (val) => {
    onChange(value === val ? null : val);
  };

  const bodyId = `fg-body-${safeKey}`;

  return (
    <section
      ref={rootRef}
      className={`filter-group ${label
        ?.toString()
        .replace(/\s+/g, "-")
        .toLowerCase()} ${allZero ? "is-disabled" : ""}`}
    >
      {/* HEAD */}
      <button
        type="button"
        className="filter-group__head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        disabled={allZero}
      >
        <span className="button-filter Field M-Aux-negro">{label}</span>
      <img
        src={
          label === "Filtros"
            ? "/assets/svg/filter.svg" // 👈 otro icono
            : "/assets/svg/bottom-arrow.svg"
        }
        alt=""
        aria-hidden="true"
        className={`arrow ${open ? "open" : ""}`}
      />
      </button>

      {/* BODY */}
      <div
        id={bodyId}
        className={`filter-group__body ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        <div className="filter-group__inner">

          <ul className="filter-options">
            {filtered.map((opt) => {
              const id = `opt-${safeKey}-${opt.value}`;
              const checked = isSingle
                ? value === opt.value
                : Array.isArray(value) && value.includes(opt.value);

              const count = getCount(opt.value);
              const disabled = !checked && count === 0;

              return (
                <li key={opt.value}>
                  <label
                    className="opt"
                    htmlFor={id}
                    aria-disabled={disabled ? "true" : undefined}
                  >
                    {isSingle ? (
                      <input
                        id={id}
                        type="radio"
                        name={`filter-${safeKey}`}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleSingle(opt.value)}
                      />
                    ) : (
                      <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleMulti(opt.value)}
                      />
                    )}
                    <span className="Field">{opt.label}</span>
                  </label>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="opt-empty">Sin resultados…</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
