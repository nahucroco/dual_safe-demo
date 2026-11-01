import { useNavigate } from "react-router-dom";
import BotonCustom from "../../botones/BotonCustom.jsx";
import { useScrollNavigate } from "../../../hooks/useScrollNavigate.js";
import "./SectionNosotros.css"


export default function SectionNosotros() {
    const navigate = useNavigate();
    const { go, busy } = useScrollNavigate();
    return (
        <section className="SectionNosotros">
            <div className="nosotros-img">
                <img src="assets/img/DualSafeLogo.jpg" alt="Equipo de dualsafe" />
            </div>
            <div className="Somos-DualSafe">
                <div className="Somos-DualSafe-info">
                    <p className="Subtitulo M-Aux-negro">Somos DualSafe</p>
                    <p className="Body">Nacimos de la experiencia de CVE, una fábrica familiar con más de 15 años produciendo guantes e indumentaria de cuero. Hoy combinamos esa tradición con la innovación digital para ofrecer EPP de calidad certificada en todo el país.</p>
                </div>
                <BotonCustom
                    texto="Nuestra historia"
                    width="180px"
                    variante="primario"
                    onClick={() => go("/empresa")}
                    disabled={busy}
                />
            </div>
        </section>
    )
}