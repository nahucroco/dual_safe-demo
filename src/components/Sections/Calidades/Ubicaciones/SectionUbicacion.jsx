import "./SectionUbicacion.css";

export default function SectionUbicacion() {
  return (
    <section className="SectionUbicacion">
      <div className="ubicacion-container padding">
        <p className="Subtitulo">Dónde encontrarnos</p>
      </div>

      <div className="ubicacion-mapa-container">
        <iframe
          className="ubicacion-mapa"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.443848209081!2d-58.457057224254775!3d-34.71920497291304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccd5dd0fec9b5%3A0xc511137903253f9f!2sCVE%20y%20Dual%20Safe%20Seguridad%20Industrial!5e0!3m2!1ses!2sar!4v1762380999907!5m2!1ses!2sar"
          width="100%"
          height="500"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
