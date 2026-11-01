// BrandCarousel.jsx
import { useEffect, useRef } from "react";
import "./BrandCarousel.css";

export default function BrandCarousel({ logos, height = 60, speed = 40 }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const groupARef = useRef(null);

  const xRef = useRef(0);
  const draggingRef = useRef(false);
  const visibleRef = useRef(false);          // 👈 visible en viewport
  const pageVisibleRef = useRef(true);       // 👈 pestaña visible
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const groupWRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  const measure = () => {
    const w = groupARef.current?.getBoundingClientRect().width || 0;
    groupWRef.current = w;
  };

  // Observar tamaño del grupo
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (groupARef.current) ro.observe(groupARef.current);
    return () => ro.disconnect();
  }, []);

  // Observar visibilidad en viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry?.isIntersecting || false; },
      { root: null, threshold: 0.05 } // 5% visible ya cuenta
    );
    if (containerRef.current) io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  // Observar visibilidad de la pestaña
  useEffect(() => {
    const onVis = () => { pageVisibleRef.current = document.visibilityState === "visible"; };
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Animación
  useEffect(() => {
    const step = (ts) => {
      const last = lastTsRef.current || ts;
      const dt = (ts - last) / 1000;
      lastTsRef.current = ts;

      const canRun =
        visibleRef.current && pageVisibleRef.current && !draggingRef.current && groupWRef.current > 0;

      if (canRun) {
        xRef.current -= speed * dt; // px/s hacia la izquierda
        while (xRef.current <= -groupWRef.current) xRef.current += groupWRef.current;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${xRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);

  // Drag
  const onPointerDown = (e) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startPosRef.current = xRef.current;
    trackRef.current.setPointerCapture?.(e.pointerId);
    containerRef.current.style.cursor = "grabbing";
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    const w = groupWRef.current || 1;
    let next = startPosRef.current + dx;
    if (next <= -w) next = ((next % w) + w) % w - w; // (-w,0]
    if (next > 0) next = -((w - (next % w)) % w);
    xRef.current = next;
  };

  const endDrag = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    containerRef.current.style.cursor = "";
    trackRef.current.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="brand-carousel"
      style={{ "--h": `${height}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <div ref={trackRef} className="brand-track-js">
        <div ref={groupARef} className="brand-group-js">
          {logos.map((l, i) => (
            <div className="brand-item" key={`a-${i}`}>
              <img src={l.src} alt={l.alt} draggable="false" />
            </div>
          ))}
        </div>
        <div className="brand-group-js">
          {logos.map((l, i) => (
            <div className="brand-item" key={`b-${i}`}>
              <img src={l.src} alt={l.alt} draggable="false" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
