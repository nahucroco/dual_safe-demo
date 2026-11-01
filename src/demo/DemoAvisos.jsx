import { useEffect, useRef, useState } from "react";
import "./demo.css";

const AVISO_CONTACTO = "En esta demo el contacto directo está desactivado.";
const DURACION_MS = 6000;

export default function DemoAvisos() {
  const [aviso, setAviso] = useState(null);
  const temporizador = useRef(null);

  useEffect(() => {
    const mostrar = (texto) => {
      setAviso(texto);
      clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setAviso(null), DURACION_MS);
    };
    const onAviso = (event) => mostrar(event.detail);
    const onClick = (event) => {
      if (event.target.closest('a[href="#contacto-demo"]')) {
        event.preventDefault();
        mostrar(AVISO_CONTACTO);
      }
    };

    window.addEventListener("demo:aviso", onAviso);
    document.addEventListener("click", onClick);
    return () => {
      clearTimeout(temporizador.current);
      window.removeEventListener("demo:aviso", onAviso);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <div className="demo-banner">
        Demo de portfolio: este no es el sitio oficial de DualSafe y no se envían pedidos ni mensajes.
      </div>
      {aviso && (
        <div className="demo-aviso" role="status">
          {aviso}
        </div>
      )}
    </>
  );
}
