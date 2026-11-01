// src/components/botones/BotonCustom.jsx
import React, { forwardRef } from "react";
import "./BotonCustom.css";

const BotonCustom = forwardRef(function BotonCustom(
  {
    texto,
    width,
    height,
    icon,
    size = "B",                 // B, M, S, E, ES
    variante = "primario",      // primario | secundario | extra
    hover = "no",               // "si" | "no"
    className = "",
    style = {},
    children,
    as,                         // "button" | "a" | Link | componente
    href,                       // para <a>
    disabled = false,           // 👈 NUEVO
    onClick,                    // lo envolvemos para bloquear si disabled
    ...rest
  },
  ref
) {
  const styleFix = { width, height, ...style };

  const classes = [
    "boton",
    `size-${size}`,
    `var-${variante}`,
    `hover-${hover}`,
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = children ? (
    children
  ) : (
    <>
      {icon && <img className="icon" src={icon} alt="" aria-hidden="true" />}
      {texto && <span className="label">{texto}</span>}
    </>
  );

  // Handler seguro: no dispara si está disabled
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  const commonProps = {
    ref,
    className: classes,
    style: styleFix,
    onClick: handleClick,
    "aria-disabled": disabled || undefined,
    ...(disabled ? { tabIndex: -1 } : {}),
    ...rest,
  };

  // 1) Si viene `as` (por ej. Link)
  if (as) {
    const Comp = as;
    // Si está disabled, no pasamos `to`/`href` para evitar navegación
    const { to, href: hrefRest, ...restProps } = rest;
    return (
      <Comp
        {...commonProps}
        {...(!disabled ? { to, href: href ?? hrefRest } : {})}
      >
        {content}
      </Comp>
    );
  }

  // 2) Si es anchor directo
  if (href) {
    return (
      <a
        {...commonProps}
        {...(!disabled ? { href } : {})}
        role="link"
      >
        {content}
      </a>
    );
  }

  // 3) Default <button>
  return (
    <button
      {...commonProps}
      type="button"
      disabled={disabled}          // 👈 deshabilita nativo
    >
      {content}
    </button>
  );
});

export default BotonCustom;
