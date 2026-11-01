// Demo: el catálogo sale de public/productos.json en lugar del servidor original.
export async function cargarProductos(signal) {
  const res = await fetch("/productos.json", { signal });
  if (!res.ok) throw new Error("Productos HTTP " + res.status);
  const data = await res.json();

  return data
    .filter((p) => p.si_activo)
    .sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999))
    .map((p) => {
      const carpeta = `/image/${p.image_filename}`;
      return {
        ...p,
        images_urls: (p.images || []).map((img) => `${carpeta}/${img}`),
        pdf_url: p.pdf_filename ? `${carpeta}/${p.pdf_filename}` : null,
      };
    });
}
