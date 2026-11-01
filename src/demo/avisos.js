// Demo: los botones de contacto llaman a esto en vez de abrir WhatsApp.
export function avisarDemo(texto) {
  window.dispatchEvent(new CustomEvent("demo:aviso", { detail: texto }));
}
