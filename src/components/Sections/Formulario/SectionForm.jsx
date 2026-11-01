// SectionForm.jsx
import "./SectionForm.css";
import BotonCustom from "../../botones/BotonCustom.jsx";
import { useRef, useState } from "react";

export default function SectionForm() {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      // Demo: no se envía nada, solo se muestra el mismo recorrido del sitio original.
      await new Promise((resolve) => setTimeout(resolve, 800));
      form.reset();
      setStatus("success");
    } catch (error) {
      console.error("Error al enviar:", error);
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="SectionForm">
      <div className="contacto-container-1">
        <h3 className="Subtitulo">Estamos para ayudarte</h3>
        <p className="Body">
          ¿Querés asesoramiento sobre qué equipo de protección personal se adapta
          mejor a tu trabajo o necesitás una cotización mayorista? Completá el
          formulario y un miembro de nuestro equipo comercial se pondrá en
          contacto para darte una respuesta personalizada y profesional.
        </p>

        <div className="contacto-container-3">
          <p className="Subtitulo">¿Preferís algo más rápido?</p>
          <a
            href="#contacto-demo"
            target="_blank"
            rel="noreferrer"
          >
            <p className="Field">Chatear por WhatsApp</p>
          </a>
        </div>
      </div>

      <div className="contacto-container-2 padding">
        <form
          ref={formRef}
          className="formulario"
          onSubmit={handleSubmit}
          noValidate={false}                /* usamos validación nativa */
        >
          <div className="dos-campos">
            <div className="campo">
              <label htmlFor="nombre" className="Field">
                Nombre
              </label>
              <input type="text" id="nombre" name="nombre" required />
            </div>

            <div className="campo">
              <label htmlFor="telefono" className="Field">
                <span>Teléfono</span>
                <span className="M-Aux-transparent"> (opcional)</span>
              </label>
              <input type="tel" id="telefono" name="telefono" />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="email" className="Field">
              Email
            </label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="campo">
            <label htmlFor="empresa" className="Field">
              <span>Empresa</span>
              <span className="M-Aux-transparent"> (opcional)</span>
            </label>
            <input type="text" id="empresa" name="empresa" />
          </div>

          <div className="campo">
            <label htmlFor="mensaje" className="Field">
              Mensaje
            </label>
            <textarea id="mensaje" name="mensaje" rows="4" required></textarea>
          </div>

          <BotonCustom
            as="button"
            type="submit"
            disabled={sending}
            texto={sending ? "Enviando..." : "Enviar"}
            width="180px"
            variante="primario"
            size="M"
          />

          {status === "success" && (
            <p
              style={{
                marginTop: "12px",
                color: "green",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              ✅ Formulario de demostración: no se envió ningún dato.
            </p>
          )}
          {status === "error" && (
            <p
              style={{
                marginTop: "12px",
                color: "red",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              ❌ No se pudo enviar. Intentá nuevamente.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
