export const TEMAS_FORCA = [
  { id: "animais", label: "Animais", emoji: "🦁" },
  { id: "frutas", label: "Frutas e Verduras", emoji: "🍎" },
  { id: "profissoes", label: "Profissões", emoji: "👩‍🏫" },
  { id: "esportes", label: "Esportes", emoji: "⚽" },
  { id: "paises", label: "Países", emoji: "🌍" },
  { id: "objetos", label: "Objetos Escolares", emoji: "📚" },
  { id: "alimentos", label: "Alimentos", emoji: "🍕" },
  { id: "natureza", label: "Natureza", emoji: "🌿" },
  { id: "transporte", label: "Transportes", emoji: "🚗" },
  { id: "corpo", label: "Corpo Humano", emoji: "🫀" },
];

export interface FaixaForca {
  id: string;
  label: string;
  lengthMin: number;
  lengthMax: number;
  boxSize: number;
  alphBox: number;
  gallowsSize: number;
  emoji: string;
}

export const FAIXAS_FORCA: FaixaForca[] = [
  {
    id: "4-6",
    label: "4-6 anos",
    lengthMin: 3,
    lengthMax: 5,
    boxSize: 28,
    alphBox: 18,
    gallowsSize: 160,
    emoji: "🌱",
  },
  {
    id: "7-9",
    label: "7-9 anos",
    lengthMin: 5,
    lengthMax: 8,
    boxSize: 22,
    alphBox: 17,
    gallowsSize: 155,
    emoji: "📘",
  },
  {
    id: "10+",
    label: "10+ anos",
    lengthMin: 7,
    lengthMax: 12,
    boxSize: 18,
    alphBox: 16,
    gallowsSize: 148,
    emoji: "📙",
  },
];

export interface ForcaItem {
  palavra: string;
  dica: string;
  temaLabel: string;
}

export const BNCC_FORCA =
  "EF01LP07 — Reconhecimento e escrita de palavras · EF02LP04 — Ortografia e vocabulário";
