// src/hooks/useProductos.js
import { useEffect, useState } from "react";
import { deriveFromCombos } from "../utils/materials";
import { cargarProductos } from "../demo/catalogo";

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Reglas locales (permitimos cache normal)
        const rulesRes = await fetch(`/rules_materiales.json`, {
          signal: ac.signal,
        });
        if (!rulesRes.ok) throw new Error("Rules HTTP " + rulesRes.status);
        const rules = await rulesRes.json();

        const data = await cargarProductos(ac.signal);

        const productosConMaterial = data.map((p) => {
          const baseStr = Array.isArray(p.materials) ? p.materials.join(" ") : "";
          const material_simple = deriveFromCombos(baseStr, rules?.combos || []);
          return { ...p, material_simple };
        });

        setProductos(productosConMaterial);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e);
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  return { productos, loading, error };
}
