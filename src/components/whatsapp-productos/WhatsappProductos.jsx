// WhatsappProductos.jsx
import './WhatsappProductos.css'
import BotonCustom from '../botones/BotonCustom.jsx'

export default function WhatsappProductos() {
    return (
        <section className='WhatsappProductos'>
            <div className='container-productos-2'>
                <img src="../../assets/svg/zoom.svg" alt="" />
                <p className='Subtitulo'>¿No encontraste el producto que necesitás?</p>
                <p className='Body'>Escribinos por WhatsApp y nuestro equipo te va a ayudar a conseguirlo o recomendarte la mejor alternativa.</p>
                <BotonCustom
                    texto="Ir a WhatsApp"
                    icon="/assets/svg/wtsp.svg"
                    width={"180px"}
                    variante="primario"
                    size="M"
                />
            </div>
        </section>
    )
}