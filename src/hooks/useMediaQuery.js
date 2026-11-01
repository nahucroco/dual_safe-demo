// src/hooks/useMediaQuery.js
import { useEffect, useState } from "react";

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = e => setMatches(e.matches);
    mql.addEventListener?.("change", onChange) ?? mql.addListener(onChange);
    return () => mql.removeEventListener?.("change", onChange) ?? mql.removeListener(onChange);
  }, [query]);
  return matches;
}
