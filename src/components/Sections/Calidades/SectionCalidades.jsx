// SectionCalidades.jsx
import { useState } from "react";
import "./SectionCalidades.css";
import { CalidadesCards, Carrusel } from "../../card-calidades/CalidadesCards.jsx";

const CALIDADES = [
  {
    icon: "/assets/svg/calidad-asegurado.svg",
    alt: "Calidad certificada",
    title: "Calidad certificada",
    desc:
      "Productos avalados por normas IRAM, EN y ANSI que garantizan confianza y seguridad real.",
  },
  {
    icon: "/assets/svg/experiencia-protege.svg",
    alt: "Experiencia que protege",
    title: "Experiencia que protege",
    desc:
      "Más de 15 años fabricando guantes e indumentaria de cuero para quienes trabajan seguro.",
  },
  {
    icon: "/assets/svg/evolucion-constante.svg",
    alt: "Evolución constante",
    title: "Evolución constante",
    desc:
      "De la tradición de CVE a la innovación de DualSafe, creciendo para todo el país.",
  },
];

export default function SectionCalidades() {
  const [index, setIndex] = useState(0);
  const max = CALIDADES.length - 1;

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(max, i + 1));
  const goTo   = (i) => setIndex(i);

  return (
    <section className="sectionCalidades" aria-labelledby="calidades-title">

          <CalidadesCards
      items={CALIDADES}
      index={index}
      onActiveChange={(i) => setIndex(i)}   // 👈 sincroniza dot al scroll manual
    />
    <Carrusel
      length={CALIDADES.length}
      index={index}
      onPrev={goPrev}
      onNext={goNext}
      onDot={goTo}
    />

    </section>
  );
}
