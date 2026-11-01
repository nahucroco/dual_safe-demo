import "./SectionEmpresa.css";

export default function SectionEmpresa() {
    return (
        <section className="SectionEmpresa">
            <div className="empresa-container-1 padding">
                <p className="Producto">Empresa</p>
                <div>
                    <p className="Subtitulo">
                        De una fábrica familiar a una marca nacional
                    </p>
                    <div className="container-img-desc">
                        <img src="/assets/img/empresa-placeholder.png" alt="" />
                        <p className="Body">En 2005 nació CVE, nuestra fábrica familiar dedicada a producir guantes e indumentaria de cuero para protección personal. Con más de 15 años de experiencia, crecimos escuchando a quienes trabajan en los entornos más exigentes y transformamos esa trayectoria en una propuesta más amplia y moderna.
                            Así surgió DualSafe: la evolución digital y comercial de esa historia, incorporando nuevas líneas de Elementos de Protección Personal certificados por IRAM y marcas líderes. Hoy combinamos tradición e innovación para ofrecer EPP de calidad en todo el país, con un objetivo claro: que cada trabajador tenga la seguridad y la confianza que necesita para rendir al máximo.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}