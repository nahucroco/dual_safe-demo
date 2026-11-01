import { useMemo } from "react";
import "./filtros.css";
import { FILTERS_CONFIG } from "./filters.config";
import FilterGroup from "./FilterGroup";
import BotonCustom from "../botones/BotonCustom";


export default function FilterSidebar({ selected, onChange }) {
  const config = useMemo(() => FILTERS_CONFIG, []);

  const clearAll = () => onChange({}); // limpia todos los grupos

  return (
    <div>
      <div className="filter-sidebar__head">
        <span className="Field">Filtros</span>
        <BotonCustom
          size="S"
          variante="extra"
          aria-label="Limpiar filtros"
          texto={"Limpiar filtros"}
          type="button"
          onClick={clearAll}
        />
      </div>
      <div className="filter-sidebar">
        {config.map(group => {
          const valDefault = group.type === "multi" ? [] : null;
          const value = selected[group.key] ?? valDefault;
          return (
            <FilterGroup
              key={group.key}
              group={group}
              value={value}
              onChange={(val) => onChange({ ...selected, [group.key]: val })}
            />
          );
        })}

      </div>
    </div>
  );
}
