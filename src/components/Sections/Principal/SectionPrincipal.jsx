import "./SectionPrincipal.css"
import { useNavigate } from "react-router-dom";
import BotonCustom from "../../botones/BotonCustom.jsx";


export default function SectionPrincipal() {
  const navigate = useNavigate();

  return (
    <section className="sectionPrincipal">

      <div className="principal-mobile">
        {/* media */}
        <div className="hero-media">
          <img src="/assets/img/presentacion.png" alt="DualSafe Presentación" />
        </div>
        {/* overlay (oscurecido/gradiente) */}
        <div className="hero-overlay" aria-hidden="true"></div>
        {/* contenido */}
        <div className="hero-content">
          <img src="/assets/img/dualsafe_blanco.png" alt="DualSafe" />
          <div className="M-Contenedor">
            <h1 className="Titulo slogan M-Aux-blanco">15 años cuidando a quienes trabajan</h1>
            <BotonCustom texto="Ver productos" width={"180px"} variante="primario" onClick={() => navigate("/productos")} />
          </div>
        </div>
      </div>

      <div className="principal-desktop">
        <div className="container-1">
          <p className="Titulo">15 años cuidando a quienes trabajan</p>
          <BotonCustom texto="Ver productos" width={"180px"} variante="primario" onClick={() => navigate("/productos")} />
        </div>
        <div className="container-2">
          <div className="hero-content">
            <img src="/assets/img/dualsafe_blanco.png" alt="DualSafe" />
          </div>
        </div>
      </div>

      <a
  href="#contacto-demo"
  className="whatsapp-float"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chatear por WhatsApp"
>
  <img src="/assets/svg/wtsp.svg" alt="WhatsApp" style={{ filter: "invert(1)" }}  />
</a>


    </section>

    
  );
}