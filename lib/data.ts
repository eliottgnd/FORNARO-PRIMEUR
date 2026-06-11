// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Produit {
  id: string;
  nom: string;
  emoji: string;
  prix: number;
  unite: string;
  origine: string;
  categorie: "fruits" | "legumes" | "epicerie" | "local";
  sousTags: string[];
  badge?: string;
  bgColor: string;
  description: string;
}

export interface Commande {
  id: string;
  date: string;
  statut: "en-cours" | "terminee" | "annulee";
  paiement: "payee" | "en-attente";
  total: number;
  produits: { nom: string; qte: number; prix: number }[];
}

export interface Marche {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  emoji: string;
  image?: string; // URL de l'image — à remplir quand les photos sont prêtes
}

export interface Client {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  commandes: number;
  total: number;
}

// ─── PRODUITS ─────────────────────────────────────────────────────────────────

export const produits: Produit[] = [
  {
    id: "p1",
    nom: "Poire",
    emoji: "🍐",
    prix: 2.4,
    unite: "kg",
    origine: "🇫🇷 France",
    categorie: "fruits",
    sousTags: ["saison", "croquer"],
    badge: "Saison",
    bgColor: "#fff9e6",
    description: "Poire juteuse et sucrée de saison.",
  },
  {
    id: "p2",
    nom: "Fraise",
    emoji: "🍓",
    prix: 4.9,
    unite: "barq.",
    origine: "🇫🇷 Pays Basque",
    categorie: "fruits",
    sousTags: ["saison", "smoothie"],
    bgColor: "#fff0f0",
    description: "Fraises locales gorgées de soleil.",
  },
  {
    id: "p3",
    nom: "Orange",
    emoji: "🍊",
    prix: 3.2,
    unite: "kg",
    origine: "🇪🇸 Espagne",
    categorie: "fruits",
    sousTags: ["smoothie", "jus"],
    bgColor: "#fff8e1",
    description: "Oranges à jus, parfaites pour le matin.",
  },
  {
    id: "p4",
    nom: "Kiwi",
    emoji: "🥝",
    prix: 4.5,
    unite: "kg",
    origine: "🇫🇷 Adour",
    categorie: "fruits",
    sousTags: ["saison", "smoothie"],
    bgColor: "#f0fff4",
    description: "Kiwis doux et vitaminés du Sud-Ouest.",
  },
  {
    id: "p5",
    nom: "Abricot",
    emoji: "🍑",
    prix: 5.8,
    unite: "kg",
    origine: "🇫🇷 Provence",
    categorie: "fruits",
    sousTags: ["saison", "patisserie"],
    badge: "Local",
    bgColor: "#fffde7",
    description: "Abricots fondants, idéaux en tarte.",
  },
  {
    id: "p6",
    nom: "Cerise",
    emoji: "🍒",
    prix: 7.2,
    unite: "kg",
    origine: "🇫🇷 Itxassou",
    categorie: "fruits",
    sousTags: ["saison", "croquer"],
    bgColor: "#fce4ec",
    description: "Cerises d'Itxassou, emblème du Pays Basque.",
  },
  {
    id: "p7",
    nom: "Tomate",
    emoji: "🍅",
    prix: 3.8,
    unite: "kg",
    origine: "🇫🇷 Pays Basque",
    categorie: "legumes",
    sousTags: ["saison", "salade"],
    badge: "Local",
    bgColor: "#fff3e0",
    description: "Tomates charnues cultivées localement.",
  },
  {
    id: "p8",
    nom: "Courgette",
    emoji: "🥒",
    prix: 2.1,
    unite: "kg",
    origine: "🇫🇷 France",
    categorie: "legumes",
    sousTags: ["saison"],
    bgColor: "#e8f5e9",
    description: "Courgettes tendres de saison.",
  },
  {
    id: "p9",
    nom: "Poivron",
    emoji: "🫑",
    prix: 3.4,
    unite: "kg",
    origine: "🇪🇸 Espagne",
    categorie: "legumes",
    sousTags: ["salade", "saison"],
    bgColor: "#f1f8e9",
    description: "Poivrons colorés et croquants.",
  },
  {
    id: "p10",
    nom: "Carotte",
    emoji: "🥕",
    prix: 1.9,
    unite: "kg",
    origine: "🇫🇷 France",
    categorie: "legumes",
    sousTags: ["saison"],
    bgColor: "#fff8e1",
    description: "Carottes sucrées, parfaites crues ou cuites.",
  },
  {
    id: "p11",
    nom: "Miel",
    emoji: "🍯",
    prix: 8.5,
    unite: "pot",
    origine: "🇫🇷 Pays Basque",
    categorie: "epicerie",
    sousTags: ["local"],
    badge: "Artisan",
    bgColor: "#fff3e0",
    description: "Miel artisanal du Pays Basque.",
  },
  {
    id: "p12",
    nom: "Confiture",
    emoji: "🫙",
    prix: 6.0,
    unite: "pot",
    origine: "🇫🇷 Itxassou",
    categorie: "local",
    sousTags: ["local"],
    badge: "Local",
    bgColor: "#fce4ec",
    description: "Confiture de cerises noires d'Itxassou.",
  },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export const categories = [
  {
    id: "fruits",
    label: "Fruits",
    emoji: "🍎",
    description: "Retrouvez une sélection de fruits de saison",
    bg: "from-yellow-50 to-yellow-100",
  },
  {
    id: "legumes",
    label: "Légumes",
    emoji: "🥦",
    description: "Retrouvez une sélection de légumes frais",
    bg: "from-green-50 to-green-100",
  },
  {
    id: "epicerie",
    label: "Épicerie",
    emoji: "🫙",
    description: "Retrouvez la sélection de l'épicerie",
    bg: "from-orange-50 to-orange-100",
  },
  {
    id: "local",
    label: "Direct producteur",
    emoji: "🌿",
    description:
      "Retrouvez une sélection de produits de qualité en circuit court",
    bg: "from-purple-50 to-purple-100",
  },
];

export const sousTags = [
  "Saison",
  "À jus & Smoothie",
  "À croquer",
  "Pour pâtisserie",
  "Pour salade",
  "Nouveautés",
];

// ─── MARCHÉS ──────────────────────────────────────────────────────────────────

export const marches: Marche[] = [
  {
    id: "m1",
    nom: "Marché de Biarritz",
    adresse: "(Entre les 2 Halles) — Rue des Halles",
    ville: "64200 Biarritz",
    emoji: "🏛️",
    image: "/images/marche-biarritz.webp",
  },
  {
    id: "m2",
    nom: "Marché d'Hendaye",
    adresse: "(Hendaye plage) — Marché de Sokoburu",
    ville: "64700 Hendaye",
    emoji: "🏪",
    image: "/images/marche-hendaye.jpg", // à remplacer par la vraie photo
  },
];

// ─── COMMANDES ────────────────────────────────────────────────────────────────

export const commandes: Commande[] = [
  {
    id: "CMD-2026-001",
    date: "2026-03-25",
    statut: "terminee",
    paiement: "payee",
    total: 32.4,
    produits: [
      { nom: "Fraise", qte: 2, prix: 4.9 },
      { nom: "Tomate", qte: 1, prix: 3.8 },
      { nom: "Miel", qte: 1, prix: 8.5 },
    ],
  },
  {
    id: "CMD-2026-002",
    date: "2026-03-27",
    statut: "en-cours",
    paiement: "payee",
    total: 18.7,
    produits: [
      { nom: "Orange", qte: 2, prix: 3.2 },
      { nom: "Kiwi", qte: 1, prix: 4.5 },
    ],
  },
  {
    id: "CMD-2026-003",
    date: "2026-03-20",
    statut: "terminee",
    paiement: "payee",
    total: 24.1,
    produits: [
      { nom: "Abricot", qte: 1, prix: 5.8 },
      { nom: "Confiture", qte: 2, prix: 6.0 },
    ],
  },
];

// ─── PROMOTIONS ───────────────────────────────────────────────────────────────

export const promotions = [
  { id: "promo1", produitId: "p2", reduction: 20, label: "−20%", actif: true },
  { id: "promo2", produitId: "p7", reduction: 15, label: "−15%", actif: true },
  {
    id: "promo3",
    produitId: "p6",
    reduction: 10,
    label: "Offre limitée",
    actif: false,
  },
];

// ─── CLIENTS (admin) ──────────────────────────────────────────────────────────

export const clients: Client[] = [
  {
    id: "c1",
    prenom: "Jean",
    nom: "Dupont",
    email: "jean.dupont@email.fr",
    commandes: 12,
    total: 284.5,
  },
  {
    id: "c2",
    prenom: "Marie",
    nom: "Leroy",
    email: "marie.leroy@email.fr",
    commandes: 7,
    total: 156.8,
  },
  {
    id: "c3",
    prenom: "Pierre",
    nom: "Martin",
    email: "pierre.martin@email.fr",
    commandes: 3,
    total: 67.2,
  },
  {
    id: "c4",
    prenom: "Sophie",
    nom: "Bernard",
    email: "sophie.bernard@email.fr",
    commandes: 21,
    total: 512.4,
  },
];

// ─── UTILISATEUR MOCK (compte) ────────────────────────────────────────────────

export const utilisateur = {
  prenom: "Jean",
  nom: "Dupont",
  email: "jean.dupont@email.fr",
  telephone: "06 00 00 00 00",
  adresses: [
    {
      id: "a1",
      label: "Domicile",
      rue: "1 Rue du Théâtre",
      ville: "64200 Biarritz",
      principale: true,
    },
    {
      id: "a2",
      label: "Bureau",
      rue: "12 Avenue de la Plage",
      ville: "64200 Biarritz",
      principale: false,
    },
  ],
};
