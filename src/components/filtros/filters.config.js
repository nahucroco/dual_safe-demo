// filters.config.js
export const FILTERS_CONFIG = [
  {
    key: "Filtros",
    label: "Filtros",
  },
  {
    key: "uso",
    label: "Uso recomendado",
    type: "multi",
    options: [
      { value: "soldadura", label: "Soldadura" },
      { value: "construccion", label: "Construcción" },
      { value: "electricidad", label: "Electricidad" },
      { value: "metalurgia", label: "Metalurgia" },
      { value: "quimica", label: "Química" },
      { value: "logistica", label: "Logística" },
      { value: "agro", label: "Agro" },
      { value: "laboratorio", label: "Laboratorio" },
      { value: "general", label: "Uso general" },
    ],
  },
  {
    key: "marca",
    label: "Marca",
    type: "multi",
    options: [
      { value: "DualSafe", label: "DualSafe" },
      { value: "cve", label: "CVE" },
      { value: "libus", label: "Libus" },
    ],
  },
  {
    key: "material",
    label: "Material",
    type: "multi",
    searchable: true,               // agrega input de búsqueda local
    options: [
      { value: "vaqueta", label: "Vaqueta" },
      { value: "descarne", label: "Descarne" },
      { value: "algodon", label: "Algodón" },
      { value: "algodon_pvc", label: "Algodón PVC" },
      { value: "poly_pu", label: "Poly PU" },
      { value: "poly_nitrilo", label: "Poly Nitrilo" },
      { value: "nitrilo", label: "Nitrilo" },
      { value: "latex", label: "Látex" },
      { value: "pvc", label: "PVC" },
      { value: "kevlar", label: "Kevlar" },
      { value: "Jeans", label: "jeans" },
      { value: "garbardina", label: "Gabardina" },
      { value: "polar", label: "Polar" },
      { value: "friza", label: "Friza" },
      { value: "pique", label: "Piqué" },
      { value: "PEAD", label: "PEAD" },
      { value: "cuero", label: "cuero" },
    ],
  },
  {
    key: "categoria",
    label: "Categoría",
    type: "multi",                 // "single" | "multi"
    options: [
      { value: "manos", label: "Manos" },
      { value: "visual", label: "Visual" },
      { value: "cabeza", label: "Cabeza" },
      { value: "indumentaria", label: "Indumentaria" },
      { value: "otros", label: "Otros" },
    ],
  },
  
];
