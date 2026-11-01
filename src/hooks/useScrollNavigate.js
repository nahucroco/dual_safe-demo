import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function useScrollNavigate({ onBeforeScroll } = {}) {
  const navigate = useNavigate();
  const busyRef = useRef(false);
  const rafRef = useRef();

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  function go(to) {
    if (busyRef.current) return;
    busyRef.current = true;

    onBeforeScroll?.(); // 👈 opcional: cerrar aside, restaurar overflow, etc.

    // Si ya estoy arriba, navego directo
    if (Math.abs(window.scrollY) <= 2) {
      navigate(to);
      busyRef.current = false;
      return;
    }

    // Respeta reduced motion
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) {
      navigate(to);
      busyRef.current = false;
      return;
    }

    // Scroll suave al top
    try {/*  window.scrollTo({ top: 0, behavior: "smooth" }); */ }
    catch { window.scrollTo(0, 0); }

    const start = performance.now();
    const TIMEOUT = 0;

    const tick = (now) => {
      const atTop = Math.abs(window.scrollY) <= 2;
      const timedOut = now - start > TIMEOUT;
      if (atTop || timedOut) {
        navigate(to);
        setTimeout(() => { busyRef.current = false; }, 50);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  return { go, busy: busyRef.current };
}
