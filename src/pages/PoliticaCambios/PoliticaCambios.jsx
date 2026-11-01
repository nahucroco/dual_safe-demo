import "./PoliticaCambios.css";

export default function Politicas() {
  return (
    <div className="politicas-container">
      <div className="politicas-header">
        <div className="politicas-titulo-container">
          <span className="politicas-titulo Subtitulo">Política de Devolución</span>
        </div>
      </div>

      <div className="politicas-descripcion">
        <div className="politicas-texto-container">
          <ul className="politicas-lista Body">
            <li>Devoluciones aceptadas solo para productos defectuosos de fábrica dentro de los 7 días posteriores a la compra. No aceptamos devoluciones de productos no defectuosos o dañados por el cliente.</li>
            <li>Para realizar la devolución, contáctate con nosotros por WhatsApp.</li>
            <li>Coordinamos la recolección del producto defectuoso a través de WhatsApp.</li>
            <li>El reembolso se realizará en un plazo de 5 a 7 días hábiles.</li>
            <li>El producto debe estar en su estado original.</li>
          </ul>
        </div>
      </div>

      <div className="politicas-cambios-container">
        <div className="politicas-cambios-header">
          <span className="politicas-cambios-titulo Producto">Cambios</span>
        </div>

        <div className="politicas-cambios-texto">
          <span className="politicas-cambios-descripcion Body">
            Aceptamos cambios solo por productos defectuosos.
          </span>
        </div>
      </div>
    </div>
  );
}
