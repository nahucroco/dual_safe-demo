// CalidadesCards.jsx
import { useEffect, useLayoutEffect, useRef } from "react";
import "./CalidadesCards.css";
import "./Carrusel.css";
import BotonCustom from "../botones/BotonCustom";

const SCROLL_MS = 380;   // duración estimada del smooth
const IDLE_MS = 120;   // inactividad para considerar "scrollend"

export function CalidadesCards({ items, index, onActiveChange }) {
  const viewportRef = useRef(null);
  const cardsRef = useRef([]);
  const programmaticRef = useRef(false);
  const endTimerRef = useRef(null);
  const smoothTimerRef = useRef(null);

  const setNoSnap = (on) => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.classList.toggle("no-snap", !!on);
  };

  const clampIdx = (i) => Math.max(0, Math.min(items.length - 1, i));

  // ✅ centra la card i en px, compensando el padding-inline del viewport
  const scrollToIndex = (i, behavior = "smooth") => {
    const vp = viewportRef.current;
    const card = cardsRef.current[i];
    if (!vp || !card) return;

    programmaticRef.current = true;
    setNoSnap(true);

    const vpRect = vp.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const vpCenter = vpRect.left + vpRect.width / 2;
    const cardCenter = cardRect.left + cardRect.width / 2;

    const delta = cardCenter - vpCenter; // cuánto mover para alinear centros

    // si el delta es ínfimo, evitá scroll innecesario
    const EPS = 0.5; // px
    if (Math.abs(delta) > EPS) {
      vp.scrollBy({ left: delta, behavior });
    }

    clearTimeout(smoothTimerRef.current);
    smoothTimerRef.current = setTimeout(() => {
      programmaticRef.current = false;
      setNoSnap(false);

      // micro-corrección por si el snap o el rounding dejaron 1px de deriva
      const again = card.getBoundingClientRect().left + card.clientWidth / 2
        - (vp.getBoundingClientRect().left + vp.clientWidth / 2);
      if (Math.abs(again) > EPS) {
        vp.scrollBy({ left: again, behavior: "auto" });
      }
    }, behavior === "smooth" ? SCROLL_MS : 0);
  };



  // Centrar cuando cambia index (por flechas o dot)
  useEffect(() => {
    scrollToIndex(clampIdx(index));
    return () => clearTimeout(smoothTimerRef.current);
  }, [index]);

  // Recentrar en resize
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(() => scrollToIndex(clampIdx(index), "auto"));
    ro.observe(vp);
    return () => ro.disconnect();
  }, [index]);

  // Actualizar dot SOLO al terminar el scroll manual (no durante)
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onScroll = () => {
      if (programmaticRef.current) return;
      clearTimeout(endTimerRef.current);
      endTimerRef.current = setTimeout(() => {
        const center = vp.scrollLeft + vp.clientWidth / 2;
        let best = 0, bestDist = Infinity;

        for (let i = 0; i < cardsRef.current.length; i++) {
          const el = cardsRef.current[i];
          if (!el) continue;
          const c = el.offsetLeft + el.clientWidth / 2;
          const d = Math.abs(c - center);
          if (d < bestDist) { bestDist = d; best = i; }
        }

        const next = clampIdx(best);
        if (typeof onActiveChange === "function" && next !== index) {
          onActiveChange(next);
        }
      }, IDLE_MS);
    };

    vp.addEventListener("scroll", onScroll, { passive: true });

    // si el navegador soporta scrollend, úsalo
    const onScrollEnd = () => {
      clearTimeout(endTimerRef.current);
      onScroll();
    };
    vp.addEventListener?.("scrollend", onScrollEnd);

    return () => {
      vp.removeEventListener("scroll", onScroll);
      vp.removeEventListener?.("scrollend", onScrollEnd);
      clearTimeout(endTimerRef.current);
    };
  }, [index, onActiveChange, items.length]);

  // Mantener array de refs estable
  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, items.length);
  }, [items.length]);

  return (
    <div
      ref={viewportRef}
      className="cards-viewport"
      role="region"
      aria-label="Calidades destacadas"
    >
      <div className="cards-track" aria-live="polite">
        {items.map((it, i) => {
          const isActive = index === i; // la centrada según tu lógica actual
          return (
            <article
              key={i}
              ref={el => (cardsRef.current[i] = el)}
              className={`card-calidad ${isActive ? "is-active" : "is-blurred"}`}
            >
              <img src={it.icon} alt={it.alt} />
              <div className="card-info">
                <p className="Producto">{it.title}</p>
                <p className="Body M-Aux-negro">{it.desc}</p>
              </div>
            </article>
          );
        })}

      </div>
    </div>
  );
}

export function Carrusel({ length, index, onPrev, onNext, onDot }) {
  return (
    <nav className="carrusel" aria-label="Paginación de calidades">
      <BotonCustom
        width="50px"
        height="50px"
        icon="/assets/svg/flecha-izquierda.svg"
        size="E"
        variante="extra"
        aria-label="Anterior"
        onClick={onPrev}
      />
      <ul className="carrusel-dots" role="tablist" aria-label="Paginación">
        {Array.from({ length }).map((_, i) => (
          <li key={i} role="presentation">
            <button
              className="dot"
              aria-label={`Ir a slide ${i + 1}`}
              aria-current={index === i ? "page" : undefined}
              onClick={() => onDot(i)}
            >
              <img
                src={
                  index === i
                    ? "/assets/svg/carrusel-dot-fill.svg"
                    : "/assets/svg/carrusel-dot-notfill.svg"
                }
                alt=""
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>
      <BotonCustom
        width="50px"
        height="50px"
        icon="/assets/svg/flecha-derecha.svg"
        size="E"
        variante="extra"
        aria-label="Siguiente"
        onClick={onNext}
      />
    </nav>
  );
}
