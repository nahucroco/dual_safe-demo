import "./Contacto.css";
import SectionForm from "../../components/Sections/Formulario/SectionForm.jsx"
import SectionWhatsapp from "../../components/Sections/Whatsapp/SectionWhatsapp.jsx"

export function Contacto() {
  return (
    <>
    <main className="contacto">
    <SectionForm/>
    <SectionWhatsapp/>
    </main>
    </>
  );
}
