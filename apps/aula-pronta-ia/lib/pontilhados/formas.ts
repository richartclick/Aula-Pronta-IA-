export type FormaTipo = "circle" | "rect" | "polygon";

export interface Forma {
  id: string;
  label: string;
  icon: string;
  tipo: FormaTipo;
  // circle
  cx?: number;
  cy?: number;
  r?: number;
  // rect
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // polygon
  points?: string;
  // start marker (blue dot)
  startX: number;
  startY: number;
}

export const FORMAS: Forma[] = [
  {
    id: "circulo",
    label: "Círculo",
    icon: "○",
    tipo: "circle",
    cx: 50,
    cy: 50,
    r: 43,
    startX: 93,
    startY: 50,
  },
  {
    id: "quadrado",
    label: "Quadrado",
    icon: "□",
    tipo: "rect",
    x: 7,
    y: 7,
    width: 86,
    height: 86,
    startX: 7,
    startY: 7,
  },
  {
    id: "triangulo",
    label: "Triângulo",
    icon: "△",
    tipo: "polygon",
    points: "50,5 94,93 6,93",
    startX: 50,
    startY: 5,
  },
  {
    id: "retangulo",
    label: "Retângulo",
    icon: "▭",
    tipo: "rect",
    x: 7,
    y: 25,
    width: 86,
    height: 50,
    startX: 7,
    startY: 25,
  },
  {
    id: "estrela",
    label: "Estrela",
    icon: "☆",
    tipo: "polygon",
    points: "50,10 60,37 88,38 65,55 74,82 50,66 27,82 35,55 12,38 41,37",
    startX: 50,
    startY: 10,
  },
  {
    id: "losango",
    label: "Losango",
    icon: "◇",
    tipo: "polygon",
    points: "50,5 93,50 50,95 7,50",
    startX: 50,
    startY: 5,
  },
  {
    id: "pentagono",
    label: "Pentágono",
    icon: "⬠",
    tipo: "polygon",
    points: "50,6 92,36 76,86 24,86 8,36",
    startX: 50,
    startY: 6,
  },
  {
    id: "coracao",
    label: "Coração",
    icon: "♡",
    tipo: "polygon",
    points: "50,89 20,54 15,36 25,20 41,15 50,24 59,15 75,20 85,36 80,54",
    startX: 50,
    startY: 89,
  },
];

export const BNCC_PONT: Record<string, string> = {
  grande: "EI03CG · EI03TS — Corpo, gestos e movimentos / Traços, sons, cores e formas",
  compacto: "EI03CG · EF01AR03 — Corpo, gestos e movimentos / Arte: formas visuais",
};
