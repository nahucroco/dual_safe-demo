import CardProducto from "../../components/card-producto/CardProducto.jsx";
import useProductos from "../../hooks/useProductos.js";
import "./productos.css";
import WhatsappProductos from "../../components/whatsapp-productos/WhatsappProductos.jsx";
import Buscador from "../../components/buscador/Buscador.jsx";
import { ProductSearchProvider, useProductSearch } from "../../search/ProductSearchContext";
import Spinner from "../../components/ui/Spinner.jsx";

function SkeletonGrid({ count = 12 }) {
  return (
    <div className="Producto-card">
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="carProducto card-skeleton">
          <div className="card-header">
            <div className="card-img-wrapper is-loading">
              <div className="card-img-skeleton" />
            </div>
            <div className="card-info-wrapper">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-sub" />
            </div>
          </div>
          <div className="card-footer">
            <div className="skeleton-btn" />
          </div>
        </article>
      ))}
    </div>
  );
}

function GridProductos({ loading, hasData }) {
  const { filtered } = useProductSearch();

  // ✅ skeleton mientras carga o aún no hay data inicial
  if (loading || !hasData) return <SkeletonGrid count={12} />;

  if (!filtered.length) return <Spinner text="No se encontraron resultados." />;

  // ✅ filtrar productos con imagen
  const productosConImagen = filtered.filter(
    (p) =>
      (Array.isArray(p.images_urls) && p.images_urls.length > 0) ||
      (Array.isArray(p.images) && p.images.length > 0)
  );

  if (!productosConImagen.length) {
    return <Spinner text="No hay productos con imágenes disponibles." />;
  }

  return (
    <div className="Producto-card">
      {productosConImagen.map((p, idx) => (
        <CardProducto
          key={p.codigo || p.id || idx}
          id={p.id}
          codigo={p.codigo}
          name={p.name}
          materials={p.materials}
          marca={p.marca}
          images={p.images}
          images_urls={p.images_urls}
          image_alt={p.image_alt}
          categoria={p.categoria}
          material_simple={p.material_simple}
          price={p.price}
          priority={idx < 8} // ✅ primeras 8 con prioridad
        />
      ))}
    </div>
  );
}

export default function Productos() {
  const { productos, loading, error } = useProductos();
  if (error) return <p>Error: {error.message}</p>;

  const hasData = Array.isArray(productos) && productos.length > 0;

  return (
    <ProductSearchProvider productos={productos}>
      <div className="Productos">
        <Buscador />
        <GridProductos loading={loading} hasData={hasData} />
      </div>
      <WhatsappProductos />
    </ProductSearchProvider>
  );
}
