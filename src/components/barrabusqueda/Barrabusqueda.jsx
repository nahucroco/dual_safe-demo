import "./barrabusqueda.css";

export default function Barrabusqueda({ value, onChange }) {
  return (
    <div className="Barrabusqueda">
      <img
        src="/assets/svg/busqueda-barra.svg"
        alt="Lupa de búsqueda"
        aria-hidden="true"
      />
      <div className="barra-busqueda-container">
        <input
          className="Field Barrabusqueda-input"
          type="search"
          id="busqueda"
          name="busqueda"
          placeholder="Buscá producto, material, uso..."
          value={value}                        // ← controlado
          onChange={(e) => onChange(e.target.value)} // ← actualiza en tiempo real
          autoComplete="off"
        />
      </div>
    </div>
  );
}
