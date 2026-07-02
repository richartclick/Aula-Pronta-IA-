// Coordenadas em espaço 0-400 x 0-400 (viewBox do SVG)
// Conectar os pontos na ordem 1→2→3…→N→1 forma a figura
export type Ponto = [number, number];

export type Figura = {
  id: string;
  label: string;
  emoji: string;
  nivelLabel: string;
  nivelValue: "facil" | "medio" | "dificil";
  categoria: string;
  pontos: Ponto[];
};

export const FIGURAS: Figura[] = [
  // ── FÁCIL ────────────────────────────────────────────────────────────────
  {
    id: "estrela",
    label: "Estrela",
    emoji: "⭐",
    nivelLabel: "Fácil · 10 pontos",
    nivelValue: "facil",
    categoria: "Formas",
    // Estrela de 5 pontas — outer R=160, inner r=65, centro (200,200)
    pontos: [
      [200, 40],  [238, 147], [352, 151], [262, 220], [294, 329],
      [200, 265], [106, 329], [138, 220], [48,  151], [162, 147],
    ],
  },
  {
    id: "coracao",
    label: "Coração",
    emoji: "❤️",
    nivelLabel: "Fácil · 10 pontos",
    nivelValue: "facil",
    categoria: "Formas",
    pontos: [
      [200, 355], [80,  215], [60,  145], [100, 80],  [165, 60],
      [200, 95],  [235, 60],  [300, 80],  [340, 145], [320, 215],
    ],
  },
  {
    id: "casa",
    label: "Casa",
    emoji: "🏠",
    nivelLabel: "Fácil · 9 pontos",
    nivelValue: "facil",
    categoria: "Objetos",
    pontos: [
      [60,  380], [60,  210], [200, 75],  [340, 210], [340, 380],
      [255, 380], [255, 275], [145, 275], [145, 380],
    ],
  },
  // ── MÉDIO ────────────────────────────────────────────────────────────────
  {
    id: "peixe",
    label: "Peixe",
    emoji: "🐟",
    nivelLabel: "Médio · 10 pontos",
    nivelValue: "medio",
    categoria: "Animais",
    // Boca → cabeça topo → costas → junção cauda topo → cauda topo →
    // entalhe cauda → cauda baixo → junção cauda baixo → barriga → cabeça baixo
    pontos: [
      [60,  200], [100, 155], [200, 140], [300, 155], [380, 90],
      [360, 200], [380, 310], [300, 245], [200, 260], [100, 245],
    ],
  },
  {
    id: "foguete",
    label: "Foguete",
    emoji: "🚀",
    nivelLabel: "Médio · 12 pontos",
    nivelValue: "medio",
    categoria: "Objetos",
    pontos: [
      [200, 25],  [260, 100], [270, 290], [310, 370], [255, 310],
      [225, 365], [200, 355], [175, 365], [145, 310], [90,  370],
      [130, 290], [140, 100],
    ],
  },
  // ── DIFÍCIL ──────────────────────────────────────────────────────────────
  {
    id: "borboleta",
    label: "Borboleta",
    emoji: "🦋",
    nivelLabel: "Difícil · 12 pontos",
    nivelValue: "dificil",
    categoria: "Animais",
    // Percorre: corpo central → asa dir superior → asa dir inferior → corpo inferior →
    // asa esq inferior → asa esq superior → volta ao corpo
    pontos: [
      [200, 195], [245, 155], [320, 80],  [380, 155], [335, 240],
      [265, 290], [200, 275], [135, 290], [65,  240], [20,  155],
      [80,  80],  [155, 155],
    ],
  },
];

export const NIVEIS = [
  { value: "facil",   label: "Fácil",   desc: "9-10 pontos" },
  { value: "medio",   label: "Médio",   desc: "10-12 pontos" },
  { value: "dificil", label: "Difícil", desc: "12+ pontos" },
] as const;

export const QUANTIDADES_LP = [1, 2, 4, 6] as const;
