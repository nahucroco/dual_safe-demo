import { useState, useEffect } from "react";
import "./buscador.css";
import BotonCustom from "../botones/BotonCustom";
import Barrabusqueda from "../barrabusqueda/Barrabusqueda.jsx";
import FilterSidebar from "../filtros/FilterSidebar.jsx";
import { useProductSearch } from "../../search/ProductSearchContext";

export default function Buscador() {
  const [open, setOpen] = useState(false);
  const { query, setQuery, selected, setSelected } = useProductSearch();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1440px)");
    const onChange = e => { if (e.matches) setOpen(false); };
    // correr una vez al montar
    onChange(mq);
    // suscribirse a cambios
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange); // fallback Safari viejo
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return (
    <div className="nav-buscador">

      <div className="texto-desktop">
        <p className="texto-1">TU SEGURIDAD NO ES UN GASTO,</p>
        <p className="texto-2">ES UNA INVERSIÓN.</p>
      </div>

      {/* Mobile */}
      <div className={`Buscador ${open ? "abierto" : ""}`}>
        <div className="Buscador-filtros">
          <BotonCustom
            width="44px"
            height="44px"
            size="ES"
            variante="extra"
            aria-label={open ? "Cerrar filtros" : "Abrir filtros"}
            aria-expanded={open}
            aria-controls="panel-filtros"
            className={`icon-btn ${open ? "is-open" : ""}`}
            icon="/assets/svg/filter.svg"
            type="button"
            onClick={() => setOpen(o => !o)}
          />
        </div>
        <Barrabusqueda value={query} onChange={setQuery} />
      </div>



      {/* panel que empuja contenido */}
      <div className={`filters-collider ${open ? "open" : ""}`} id="panel-filtros">
        <div className="filters-inner">
          {/* Pasamos y recogemos filtros */}
          <FilterSidebar selected={selected} onChange={setSelected} />
        </div>
      </div>
    </div>
  );
}
