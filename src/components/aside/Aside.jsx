import { Link } from "react-router-dom";
import "./Aside.css";

export default function Aside({ open, setOpen }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      ></div>

      <aside className={`aside ${open ? "open" : ""}`} id="app-aside">
        <div className="aside-content-frame1">
          <Link
            className="aside-boton"
            to="/productos"
            onClick={() => setOpen(false)}
          >
            <span className="Body">Productos</span>
          </Link>
          <Link
            className="aside-boton"
            to="/empresa"
            onClick={() => setOpen(false)}
          >
            <span className="Body">Empresa</span>
          </Link>
          <Link
            className="aside-boton"
            to="/contacto"
            onClick={() => setOpen(false)}
          >
            <span className="Body">Contacto</span>
          </Link>

          <Link
            className="aside-boton"
            to="https://www.mercadolibre.com.ar/pagina/cveydualsafe"
            onClick={() => setOpen(false)}
          >
            <span className="Body">Venta minorista</span>
          </Link>


        </div>

        <div className="aside-content-frame2">
          {/* si es link externo (instagram), mantené <a> con target="_blank" */}
          <a
            className="aside-boton"
            href="https://instagram.com/dual.safe/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="Body">Seguinos</span>
            <img src="/assets/svg/instagram.svg" alt="logo instagram" />
          </a>
        </div>
      </aside>
    </>
  );
}
