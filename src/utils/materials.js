// Normaliza string: sin tildes, lowercase, trim
export const norm = (s) =>
  s?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const includesI = (haystack, needle) => norm(haystack).includes(norm(needle));

export const sortCombosBySpecificity = (combos = []) =>
  [...combos].sort((a, b) => {
    const al = a.all?.length ?? 0, bl = b.all?.length ?? 0;
    if (bl !== al) return bl - al;
    const aLen = a.all?.join(" ").length ?? 0;
    const bLen = b.all?.join(" ").length ?? 0;
    return bLen - aLen;
  });

export const deriveFromCombos = (materialStr = "", combos = []) => {
  if (!materialStr || !Array.isArray(combos)) return null;
  const sorted = sortCombosBySpecificity(combos);
  for (const rule of sorted) {
    if (Array.isArray(rule.all) && rule.all.every((k) => includesI(materialStr, k))) {
      const out = rule.out ?? null;
      if (out == null) return null;
      return Array.isArray(out) ? out : [out];
    }
  }
  return null;
};
