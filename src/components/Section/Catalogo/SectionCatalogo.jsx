import "./SectionCatalogo.css";
import BotonCustom from "../../botones/BotonCustom.jsx";

export default function SectionCatalogo() {
  return (
    <section className="section-catalogo" aria-labelledby="catalogo-title">
      <div
        className="container-1"
        aria-label="Portada del catálogo DualSafe y sobre de mensaje"
      >
        <img
          src="/assets/img/catalogo-mobile.png"
          className="catalogo-mobile"
          alt="Portada del catálogo DualSafe"
          loading="lazy"
        />
        <img
          src="/assets/img/catalogo-desktop.png"
          className="catalogo-desktop"
          alt="Ícono de mensaje"
          loading="lazy"
        />
      </div>
      <div className="container-2">
        <div>

          <p className="Subtitulo" id="catalogo-title">Catálogo</p>
          <p className="catalogo-desc Body">
            ¿Querés ver nuestro catálogo completo de elementos de protección
            personal? Pedilo en un clic y recibilo directo en tu WhatsApp.
          </p>
        </div>

        <BotonCustom
          href="#contacto-demo"
          width="180px"
          texto={"Pedir catálogo"}
          variante="secundario"
          icon="/assets/svg/wtsp.svg"
          aria-label="Pedir catálogo por WhatsApp"
          size="M"
        />
      </div>

    </section>
  );
}
