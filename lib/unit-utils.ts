// ─── UNITÉS DE MESURE ─────────────────────────────────────────────────────────
// Liste des unités proposées dans l'admin (fiche produit) et logique du pas de
// quantité côté client : les produits au poids se commandent par 0,5 (0.5 kg,
// 1 kg…), les produits à la pièce se commandent à l'unité (1, 2, 3…).

export const PRODUCT_UNITS = [
  "kg",
  "pièce",
  "botte",
  "barquette",
  "filet",
  "sachet",
  "pot",
  "bouteille",
  "litre",
] as const;

// Unités vendues au poids → on autorise les demi-quantités (0,5).
const FRACTIONAL_UNITS = new Set(["kg", "kilo", "kilogramme"]);

/** Indique si l'unité se commande au poids (pas de 0,5) ou à la pièce (pas de 1). */
export function isFractionalUnit(unit?: string | null): boolean {
  if (!unit) return false;
  return FRACTIONAL_UNITS.has(unit.trim().toLowerCase());
}

/** Pas d'incrément/décrément de quantité selon l'unité. */
export function getQuantityStep(unit?: string | null): number {
  return isFractionalUnit(unit) ? 0.5 : 1;
}

/** Quantité initiale / minimale selon l'unité. */
export function getMinQuantity(unit?: string | null): number {
  return isFractionalUnit(unit) ? 0.5 : 1;
}
