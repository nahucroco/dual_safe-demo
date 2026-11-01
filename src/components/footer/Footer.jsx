import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="Footer" role="contentinfo">

      <div className="Footer-content mobile">

        <div className="Footer-logo-info">

          <div className="container-1">
            <img
              src="/assets/img/footer-logo.png"
              alt="Logo de DualSafe en blanco"
              width={110}
              height={110}
              loading="lazy"
            />
            <p className="fabricando Body M-Aux-blanco">
              Más de 15 años fabricando y distribuyendo EPP certificados en Argentina.
            </p>
            <p className="certificaciones Body M-Aux-blanco">
              Certificaciones: IRAM · EN · ANSI
            </p>
          </div>

          <div className="container-2">

            <nav className="Footer-link" aria-label="Menú de navegación del sitio">
              <p className="Body links">Menú:</p>
              <div className="Footer-links">
                <Link className="Field" to="/">Home</Link>
                <Link className="Field" to="/productos">Productos</Link>
                <Link className="Field" to="/empresa">Empresa</Link>
                <Link className="Field" to="/contacto">Contacto</Link>
                {/* Ajustá si “Catálogo” es una ruta o un PDF */}
                <Link className="Field" to="/productos?view=catalogo">Catálogo</Link>
                <a
                  className="Field"
                  href="https://instagram.com/dual.safe/" /* cambia al real */
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <Link className="Field" to="/politica-cambios">Política de cambio y devoluciones</Link>
              </div>
            </nav>

            <div className="Footer-locate">
              <p className="Body">Información de contacto:</p>
              <div className="Footer-links">
  {/* Dirección → Google Maps */}
  <div className="direccion">
    <img src="/assets/svg/hombresito.svg" alt="" aria-hidden="true" />
    <a
      href="https://www.google.com/maps?q=Montiel+1942,+Lomas+de+Zamora,+Buenos+Aires"
      target="_blank"
      rel="noopener noreferrer"
      className="Body"
    >
      Montiel 1942, Lomas de Zamora, Buenos Aires
    </a>
  </div>

  {/* Mail → abrir cliente de correo */}
  <div className="direccion">
    <img src="/assets/svg/mail.svg" alt="" aria-hidden="true" />
    <a
      href="#contacto-demo"
      className="Body"
    >
      Email desactivado en la demo
    </a>
  </div>

  {/* WhatsApp → abrir chat */}
  <div className="direccion">
    <img src="/assets/svg/whatsappblanco.svg" alt="" aria-hidden="true" />
    <a
      href="#contacto-demo"
      target="_blank"
      rel="noopener noreferrer"
      className="Body"
    >
      WhatsApp desactivado en la demo
    </a>
  </div>
</div>

            </div>

          </div>

        </div>

        <div className="Footer-locate-info">

          <p className="Body">© {year} DualSafe. Todos los derechos reservados.</p>

          <div className="container-2">
            <p className="Body links">Web diseñada y desarrollada por</p>
            <a
              href="https://octopush.com.ar" /* cambia si querés */
              target="_blank"
              rel="noopener noreferrer"
              className="Footer-madeby-link Body links"
            >
              octopush
            </a>
          </div>

        </div>

      </div>

      <div className="Footer-content desktop">

        <div className="Footer-logo-info">
          <div>
            <img
              src="/assets/img/footer-logo.png"
              alt="Logo de DualSafe en blanco"
              width={110}
              height={110}
              loading="lazy"
            />
            <p className="fabricando Body M-Aux-blanco">
              Más de 15 años fabricando y distribuyendo EPP certificados en Argentina.
            </p>
            <p className="certificaciones Body M-Aux-blanco">
              Certificaciones: IRAM · EN · ANSI
            </p>
          </div>
          <p className="Body">© {year} DualSafe. Todos los derechos reservados.</p>
        </div>



        <div className="Footer-locate-info">

          <div className="container-1">

            <nav className="Footer-link" aria-label="Menú de navegación del sitio">
              <p className="Body links">Menú:</p>
              <div className="Footer-links">
                <Link className="Field" to="/">Home</Link>
                <Link className="Field" to="/productos">Productos</Link>
                <Link className="Field" to="/empresa">Empresa</Link>
                <Link className="Field" to="/contacto">Contacto</Link>
                {/* Ajustá si “Catálogo” es una ruta o un PDF */}
                <Link className="Field" to="/productos?view=catalogo">Catálogo</Link>
                <a
                  className="Field"
                  href="https://instagram.com/dual.safe/" /* cambia al real */
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <Link className="Field" to="/politica-cambios">Política de cambio y devoluciones</Link>
              </div>
            </nav>

            <div className="Footer-locate">
              <p className="Body">Información de contacto:</p>
              <div className="Footer-links">
  {/* Dirección → Google Maps */}
  <div className="direccion">
    <img src="/assets/svg/hombresito.svg" alt="" aria-hidden="true" />
    <a
      href="https://maps.app.goo.gl/s5QNd23TSgjkjRvz7"
      target="_blank"
      rel="noopener noreferrer"
      className="Body"
    >
      Montiel 1942, Lomas de Zamora, Buenos Aires
    </a>
  </div>

  {/* Mail → abrir cliente de correo */}
  <div className="direccion">
    <img src="/assets/svg/mail.svg" alt="" aria-hidden="true" />
    <a
      href="#contacto-demo"
      className="Body"
    >
      Email desactivado en la demo
    </a>
  </div>

  {/* WhatsApp → abrir chat */}
  <div className="direccion">
    <img src="/assets/svg/whatsappblanco.svg" alt="" aria-hidden="true" />
    <a
      href="#contacto-demo"
      target="_blank"
      rel="noopener noreferrer"
      className="Body"
    >
      WhatsApp desactivado en la demo
    </a>
  </div>
</div>

            </div>

          </div>

          <div className="container-2">
            <p className="Body links">Web diseñada y desarrollada por</p>
            <a
              href="https://octopush.com.ar" /* cambia si querés */
              target="_blank"
              rel="noopener noreferrer"
              className="Footer-madeby-link links Titulo"
            >
              octopush
            </a>
          </div>

        </div>

      </div>

    </footer>
  );
}
