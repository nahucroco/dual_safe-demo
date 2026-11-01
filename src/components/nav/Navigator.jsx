import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navigator.css";
import BotonCustom from "../botones/BotonCustom.jsx";
import Aside from "../aside/Aside.jsx";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import { openCart, closeCart , toggleCart } from "../../utils/cartEvents.js";

export default function NavMobile() {
  const [open, setOpen] = useState(false);        // aside hamburguesa
  const busyRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 824px)");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleToggle = () => {
    if (open) { setOpen(false); return; }
    if (busyRef.current) return;
    busyRef.current = true;
    setOpen(true);
    setTimeout(() => { busyRef.current = false; }, 50);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { if (isDesktop && open) setOpen(false); }, [isDesktop, open]);

  return (
    // 👇 cualquier click en el nav cierra el carrito
    <nav className="navbar-wrapper" onClick={closeCart}>
      <div className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-left">
          <BotonCustom
            width="50px"
            height="50px"
            size="E"
            variante="extra"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={(e) => { e.stopPropagation(); handleToggle(); }}
            className="icon-btn nav-hamburger"
          >
            <span className="icon-viewport">
              <span className={`icon-track ${open ? "to-x" : "to-menu"}`}>
                <img src="/assets/svg/mynaui_x.svg" alt="" aria-hidden="true" />
                <img src="/assets/svg/menu.svg" alt="" aria-hidden="true" />
              </span>
            </span>
          </BotonCustom>

          <Link to="/" className="nav-logo--desktop" onClick={() => setOpen(false)}>
            <img src="/assets/img/logo_principal.png" alt="logo" className="logo-desktop" />
            <img src="/assets/img/logo_principal2.png" alt="logo" className="logo-mobile" />
          </Link>
        </div>

        <div className="nav-center">
          <Link to="/" className="nav-logo--mobile" onClick={() => setOpen(false)}>
            <img src="/assets/img/logo_principal2.png" alt="logo" />
          </Link>

          <ul className="navbar-links">
            <li className="navbar-link Body"><NavLink to="/productos" onClick={() => setOpen(false)}>Productos</NavLink></li>
            <li className="navbar-link Body"><NavLink to="/empresa" onClick={() => setOpen(false)}>Empresa</NavLink></li>
            <li className="navbar-link Body"><NavLink to="/contacto" onClick={() => setOpen(false)}>Contacto</NavLink></li>
            <li className="navbar-link Body"><NavLink to="https://www.mercadolibre.com.ar/pagina/cveydualsafe" onClick={() => setOpen(false)}>Venta minorista</NavLink></li>
          </ul>
        </div>

        <div className="nav-right">
          {/* Botón carrito → abre (y no dispara el cierre del nav) */}
          <BotonCustom
          icon="/assets/svg/carrito.svg"
          size="E"
          variante="extra"
          aria-label="Abrir carrito"
          onClick={(e) => { e.stopPropagation(); toggleCart(); }}
        />
        </div>
      </div>

      <Aside open={open} setOpen={setOpen} />
    </nav>
  );
}
