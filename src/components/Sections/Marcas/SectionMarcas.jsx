// SectionMarcas.
import BrandCarousel from "../../brand-carrusel/BrandCarousel.jsx";
import "./SectionMarcas.css";

const LOGOS = [
  { src: "/assets/img/Gamisol.png", alt: "Gamisol" },
  { src: "/assets/img/cve.png", alt: "cve" },
  { src: "/assets/img/Libus.png",   alt: "Libus" },
  // agregá más si querés
];

export default function SectionMarcas() {
  return (
    <section className="SectionMarcas">
      <div className="SectionMarcas-info padding">
        <h3 className="Subtitulo M-Aux-negro">Marcas que trabajamos</h3>
        <p className="Body M-Aux-negro">
          Trabajamos con marcas líderes en seguridad industrial para garantizar
          productos confiables y certificados.
        </p>
      </div>

      {/* Carrusel infinito */}
      <BrandCarousel logos={LOGOS} height={206} speed={40} />
    </section>
  );
}