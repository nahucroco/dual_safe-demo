import { useMemo } from "react";
import "./filtros.css";
import { FILTERS_CONFIG } from "./filters.config";
import FilterGroup from "./FilterGroup";

// selected = { categoria: "manos", marca: ["cve","libus"], ... }
export default function FilterSidebar({ selected, onChange }) {
  const config = useMemo(() => FILTERS_CONFIG, []);

  return (
    <div className="filter-sidebar">
      {config.map(group => (
        <FilterGroup
          key={group.key}
          group={group}
          value={selected[group.key] ?? (group.type === "multi" ? [] : null)}
          onChange={(val) => onChange({ ...selected, [group.key]: val })}
        />
      ))}
    </div>
  );
}
