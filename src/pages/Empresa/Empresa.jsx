import "./Empresa.css";
import SectionEmpresa from "../../components/Sections/Empresa/SectionEmpresa.jsx"
import SectionCertificaciones from "../../components/Sections/Certificaciones/SectionCertificaciones.jsx"
import SectionUbicacion from "../../components/Sections/Calidades/Ubicaciones/SectionUbicacion.jsx";


export function Empresa() {
  return (
    <>
    <main className="empresa">
    <SectionEmpresa/>
    <SectionUbicacion />

    <SectionCertificaciones/>
    </main>
    </>
  );
}
