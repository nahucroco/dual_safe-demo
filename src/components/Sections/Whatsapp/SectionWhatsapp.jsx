import "./SectionWhatsapp.css";
import { useNavigate } from "react-router-dom";
import BotonCustom from '../../botones/BotonCustom.jsx'

export default function SectionWhatsappMovil() {
    return (
        <section className="SectionWhatsappMovil">
            <div className="contacto-container-3">
                <p className="Subtitulo">¿Preferís algo más rápido?</p>
                <BotonCustom
                    texto="Chatear por WhatsApp"
                    icon="/assets/svg/wtsp.svg"
                    width={"250px"}
                    variante="secundario"
                    size="M"
                />
            </div>
        </section>
    )
}