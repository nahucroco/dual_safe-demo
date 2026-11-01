import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navigator.css";
import BotonCustom from "../botones/BotonCustom.jsx";
import Aside from "../aside/Aside.jsx";

export default function NavMobile() {
  const [open, setOpen] = useState(false);
  const busyRef = useRef(false); // evita doble click durante la animación
  const [scrolled, setScrolled] = useState(false); // 👈 nuevo estado
  

  // Bloquear/desbloquear scroll cuando el aside está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // 👉 abrir: primero scrolleo arriba, después setOpen(true)
  const handleToggle = () => {
    // si está abierto, cierro directo
    if (open) { setOpen(false); return; }
    if (busyRef.current) return;
    busyRef.current = true;

    // Si ya estoy arriba, abro ya
    if (Math.abs(window.scrollY) <= 2) {
      setOpen(true);
      busyRef.current = false;
      return;
    }

    // Respeta "reduced motion"
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) {
      window.scrollTo(0, 0);
      setOpen(true);
      busyRef.current = false;
      return;
    }

    // Scroll suave al top y espera
    // Si se habilita esto cuando abra el aside, el scroll se va hacia arriba
    try { /* window.scrollTo({ top: 0, behavior: "smooth" });  */}
    catch { /* window.scrollTo(0, 0);  */}

    const start = performance.now();
    const TIMEOUT = 0;
    const tick = (now) => {
      const atTop = Math.abs(window.scrollY) <= 2;
      const timedOut = now - start > TIMEOUT;
      if (atTop || timedOut) {
        setOpen(true);
        setTimeout(() => { busyRef.current = false; }, 50);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
    useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0); // true si bajaste
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <nav className="navbar-wrapper">
      <div className={`navbar ${scrolled ? "scrolled" : ""}`}>
        {/* Botón hamburguesa */}
        <BotonCustom
          width="50px"
          height="50px"
          size="E"
          variante="extra"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={handleToggle}  // 👈 acá usamos la lógica nueva
          className="icon-btn"
        >
          <span className="icon-viewport">
            <span className={`icon-track ${open ? "to-x" : "to-menu"}`}>
              <img src="/assets/svg/mynaui_x.svg" alt="" aria-hidden="true" />
              <img src="/assets/svg/menu.svg" alt="" aria-hidden="true" />
            </span>
          </span>
        </BotonCustom>

        {/* Logo */}
        <div className="navbar-frame-3">
          <Link to="/" aria-label="Ir al inicio" onClick={() => setOpen(false)}>
            <img src="/assets/img/logo_principal.png" alt="logo" />
          </Link>
        </div>

        {/* Carrito */}
        <BotonCustom
          as={Link}
             // 👈 ahora se respeta
          
          icon="/assets/svg/carrito.svg"
          size="E"
          variante="extra"
          aria-label="Abrir carrito de compras"
        />
      </div>

      {/* Aside debajo de la navbar */}
      <Aside open={open} setOpen={setOpen} />
    </nav>
  );
}
