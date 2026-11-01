// src/components/contador/Contador.jsx
import { useState, useEffect, useRef } from "react";
import "./Contador.css";

export default function Contador({
  value = 1,
  min = 0,
  max = 999,
  onChange,
  onMinus,
  onPlus,
}) {
  const [draft, setDraft] = useState(String(value));
  const [isEditing, setEditing] = useState(false);
  const inputRef = useRef(null);

  // Mantener draft sincronizado con value cuando no estás editando
  useEffect(() => { if (!isEditing) setDraft(String(value)); }, [value, isEditing]);

  const clamp = (n) => Math.max(min, Math.min(max, n));

  const restar = () => {
    const next = clamp(value - 1);
    onMinus?.(next);
    onChange?.(next);
  };

  const sumar = () => {
    const next = clamp(value + 1);
    onPlus?.(next);
    onChange?.(next);
  };

  const handleChange = (e) => {
    // solo dígitos; permitimos vacío
    const digits = e.target.value.replace(/[^\d]/g, "");
    setDraft(digits);
  };

  const commit = () => {
    if (draft === "") {                 // si quedó vacío, volvemos al valor previo
      setDraft(String(value));
      return;
    }
    let n = parseInt(draft, 10);
    if (Number.isNaN(n)) n = value;
    n = clamp(n);
    if (n !== value) onChange?.(n);
    setDraft(String(n));
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { commit(); e.currentTarget.blur(); }
    if (e.key === "Escape") { setDraft(String(value)); e.currentTarget.blur(); }
    if (e.key === "ArrowUp") { e.preventDefault(); sumar(); }
    if (e.key === "ArrowDown") { e.preventDefault(); restar(); }
  };

  return (
    <div className="carrito-producto-cantidad">
      <img
        src="/assets/svg/menos.svg"
        alt="Restar cantidad del producto"
        onClick={restar}
        style={{ cursor: "pointer" }}
      />
      <input
        /* usamos text para permitir vacío; sigue siendo teclado numérico */
        type="text"
        inputMode="numeric"
        pattern="\d*"
        className="contador-input Field"
        value={draft}
        onChange={handleChange}
        onFocus={() => setEditing(true)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        onWheel={(e) => e.currentTarget.blur()} /* evita cambiar con la rueda */
        aria-label="Cantidad"
      />
      <img
        src="/assets/svg/mas.svg"
        alt="Sumar cantidad del producto"
        onClick={sumar}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}
