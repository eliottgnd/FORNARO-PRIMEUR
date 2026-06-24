// ─── ILLUSTRATIONS SVG ────────────────────────────────────────────────────────
// Jeu d'icônes "line-art" maison (dessinées à la main) pour remplacer les emojis.
// Trait = currentColor : la couleur se pilote via les classes Tailwind text-*.
// Pensées pour s'afficher proprement en grand (cartes catégories) comme en petit.

import type { SVGProps, ComponentType } from "react";

function Svg({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ── Étapes "Comment ça fonctionne" ───────────────────────────── */

// Panier / sac de courses — "Je choisis mes produits"
export function IconPanier(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M9.5 11h13l-1.2 14.8a1.8 1.8 0 0 1-1.8 1.6h-7a1.8 1.8 0 0 1-1.8-1.6L9.5 11Z" />
      <path d="M12.5 11V8.8a3.5 3.5 0 0 1 7 0V11" />
      <path d="M12.8 15.5h6.4" />
    </Svg>
  );
}

// Colis / paquet — "Je passe commande"
export function IconColis(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M16 5.5 26 11v10L16 26.5 6 21V11L16 5.5Z" />
      <path d="M6 11l10 5 10-5" />
      <path d="M16 16v10.5" />
      <path d="M11 8.25 21 13.75" />
    </Svg>
  );
}

// Lever de soleil — "Notre équipe prépare" (le matin, au marché)
export function IconAube(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M4 23h24" />
      <path d="M10 23a6 6 0 0 1 12 0" />
      <path d="M16 8v3" />
      <path d="M7.5 11.5l1.8 1.8" />
      <path d="M24.5 11.5l-1.8 1.8" />
      <path d="M5 17h2.6" />
      <path d="M24.4 17H27" />
    </Svg>
  );
}

// Camionnette de livraison — "Livré chez vous"
export function IconCamion(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M4 10h12.5v10.5H4z" />
      <path d="M16.5 13h4l3.5 3.5v4h-7.5z" />
      <circle cx="8.5" cy="21" r="2.1" />
      <circle cx="20.5" cy="21" r="2.1" />
      <path d="M10.6 21h7.8" />
      <path d="M4 21h2.4" />
    </Svg>
  );
}

/* ── Catégories ───────────────────────────────────────────────── */

// Pomme — Fruits
export function IconPomme(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M16 13c-1.4-1.9-3.7-2.6-5.8-1.4-2.5 1.4-3 5.4-1.2 9.2 1 2.2 2.7 4.1 4.6 4.6 1.6.4 3.2.4 4.8 0 1.9-.5 3.6-2.4 4.6-4.6 1.8-3.8 1.3-7.8-1.2-9.2-2.1-1.2-4.4-.5-5.8 1.4Z" />
      <path d="M16 13V9.4" />
      <path d="M16.6 11.2c1.3-1.7 3.5-2 5-1.4-.2 1.7-1.8 3-3.6 2.9" />
    </Svg>
  );
}

// Carotte — Légumes
export function IconCarotte(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M11 13.4 20.4 15.4 15 26.6a1 1 0 0 1-1.8.1L11 13.4Z" />
      <path d="M15.5 14.2c0-2.6 1.4-4.7 3.8-5.9" />
      <path d="M13.7 13.4c-1.4-2.1-1.6-4.4-.8-6.9" />
      <path d="M12.3 13.8C10.4 12.7 9.1 10.7 8.9 8.1" />
      <path d="m13 17.6 2.6.6" />
      <path d="m12.5 20.6 2.3.5" />
    </Svg>
  );
}

// Bocal — Épicerie
export function IconBocal(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M11 8h10" />
      <path d="M11.5 8v3l-1 1.5v13a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-13l-1-1.5V8" />
      <path d="M10.5 14h11" />
    </Svg>
  );
}

// Feuille — Direct producteur
export function IconFeuille(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M9.5 23.5C8 14 14 8 24 8c0 10-6.5 16.5-14.5 15.5Z" />
      <path d="M9.5 23.5C13 18 18 13 23 10.2" />
      <path d="M9 24.5 7.5 26.5" />
    </Svg>
  );
}

/* ── Valeurs ──────────────────────────────────────────────────── */

// Pousse / jeune plant — Fraîcheur
export function IconPousse(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M11 27h10" />
      <path d="M16 27V15" />
      <path d="M16 17.5c-1.2-3.2-4.2-4.9-8-4.5.2 3.8 3 6 8 5.5" />
      <path d="M16 15.5c1-2.7 3.6-4.3 7-3.9-.1 3.4-2.6 5.4-7 5" />
    </Svg>
  );
}

// Sceau / cocarde de confiance — Confiance
export function IconConfiance(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="16" cy="14" r="7.5" />
      <path d="M12.5 14 15 16.5 19.5 11.5" />
      <path d="M12.4 20.4 11 27.5l3-2 2 2.4" />
      <path d="M19.6 20.4 21 27.5l-3-2" />
    </Svg>
  );
}

// Globe avec feuille — Engagement
export function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="16" cy="16.5" r="9.5" />
      <path d="M16 7a13 13 0 0 0 0 19" />
      <path d="M16 7a13 13 0 0 1 0 19" />
      <path d="M6.5 16.5h19" />
    </Svg>
  );
}

// Cœur — Passion
export function IconCoeur(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M16 25.5S6 19.5 6 12.7A5.2 5.2 0 0 1 16 10.4 5.2 5.2 0 0 1 26 12.7C26 19.5 16 25.5 16 25.5Z" />
    </Svg>
  );
}

/* ── Mapping catégorie → icône ────────────────────────────────── */

const CATEGORY_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  fruits: IconPomme,
  legumes: IconCarotte,
  epicerie: IconBocal,
  local: IconFeuille,
};

export function CategoryIcon({
  id,
  ...props
}: { id: string } & SVGProps<SVGSVGElement>) {
  const Icon = CATEGORY_ICONS[id];
  if (!Icon) return null;
  return <Icon {...props} />;
}
