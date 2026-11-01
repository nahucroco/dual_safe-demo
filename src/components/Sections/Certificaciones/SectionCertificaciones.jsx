import "./SectionCertificaciones.css";

export default function SectionCertificaciones() {
    return (
        <section className="SectionCertificaciones">
            <div className="empresa-container-3 padding">
                <p className="Subtitulo">Certificaciones</p>
                <p className="Body slogan-certificaciones">Nuestros productos cumplen con las principales normas nacionales e internacionales de seguridad. Cada certificación es garantía de calidad, confianza y protección para quienes eligen DualSafe</p>
            </div>
            <div className="empresa-container-4 mobile padding">
                <div>
                    <img src="assets/img/certificacion-iram.jpg" alt="" />
                    <img src="assets/img/certificacion-en.png" alt="" />
                </div>
                <div>
                    <img src="assets/svg/certificacion-ansi.svg" alt="" />
                </div>
            </div>
            <div className="empresa-container-4 desktop padding">
                <img src="assets/img/certificacion-iram.jpg" alt="" />
                <img src="assets/img/certificacion-en.png" alt="" />
                <img src="assets/svg/certificacion-ansi.svg" alt="" />
            </div>
            <div className="empresa-container-5 padding">
                <p className="Producto">Productos certificados bajo normas IRAM, EN y ANSI</p>
            </div>


            
        </section>
    )
}