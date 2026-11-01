import "./card-categoria.css";

const COLOR_MAP = {
  Manos: "#4139BE",
  Visual: "#25B8AC",
  Cabeza: "#CBC83D",
  Indumentaria: "#B82B2B",
  Otros: "#A5A5A5",
};

export default function CardCategoria({ categoria, variant = "productos" }) {
  if (!categoria) return null;

  const safe = categoria.toString().trim();
  const final = safe.charAt(0).toUpperCase() + safe.slice(1).toLowerCase();

  const src = `/assets/svg/CardCategoria/${final}.svg`;
  const bgColor = COLOR_MAP[final] || "#999";

  const handleError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/assets/svg/CardCategoria/_default.svg";
  };

  // elige la clase según el variant
  const baseClass =
    variant === "carrito" ? "card-img-overlay-tag" : "card-img-overlay";

  return (
    <div className={baseClass} style={{ backgroundColor: bgColor }}>
      <img
        className="card-img-tag-cat"
        src={src}
        alt={categoria}
        onError={handleError}
      />
      <span className="tag-category M-card-overlay M-Aux-blanco">{categoria}</span>
    </div>
  );
}
