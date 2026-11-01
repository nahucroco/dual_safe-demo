import "./Principal.css";
import SectionProductos from "../../components/Sections/Productos/SectionProductos.jsx"
import SectionPrincipal from "../../components/Sections/Principal/SectionPrincipal.jsx"
import SectionNosotros from "../../components/Sections/Nosotros/SectionNosotros.jsx"
import SectionMarcas from "../../components/Sections/Marcas/SectionMarcas.jsx"
import SectionCalidades from "../../components/Sections/Calidades/SectionCalidades.jsx"
import SectionCatalogo from "../../components/Section/Catalogo/SectionCatalogo.jsx";
export function Principal() {
  return (
    <>
    <main className="principal">
    <SectionPrincipal/>
    <SectionNosotros/>
    <SectionMarcas/>
    <SectionCalidades/>
    <SectionProductos/>
    <SectionCatalogo/>
    
    </main>
    </>
  );
}
