export interface FamiliaSilabica {
  id: string;
  label: string;
  silabas: string[];       // syllables in this family for display
  emoji: string;
  exemplo: string;         // example word shown in UI
}

export type CruzadinhaDificuldade = "facil" | "medio" | "dificil";

export interface PalavraItem {
  palavra: string;
  silabas: string[];
  dica: string;
  emoji: string;
  lacunas: number[];       // indices of blanked syllables
}

export const FAMILIAS: FamiliaSilabica[] = [
  { id: "B",  label: "Família do B",  silabas: ["BA","BE","BI","BO","BU"],          emoji: "🐝",  exemplo: "BOLA" },
  { id: "C",  label: "Família do C",  silabas: ["CA","CO","CU","QUE","QUI"],        emoji: "🐾",  exemplo: "CASA" },
  { id: "D",  label: "Família do D",  silabas: ["DA","DE","DI","DO","DU"],          emoji: "🦷",  exemplo: "DADO" },
  { id: "F",  label: "Família do F",  silabas: ["FA","FE","FI","FO","FU"],          emoji: "🌸",  exemplo: "FADA" },
  { id: "G",  label: "Família do G",  silabas: ["GA","GE","GI","GO","GU"],          emoji: "🐊",  exemplo: "GATO" },
  { id: "L",  label: "Família do L",  silabas: ["LA","LE","LI","LO","LU"],          emoji: "🌙",  exemplo: "LULA" },
  { id: "M",  label: "Família do M",  silabas: ["MA","ME","MI","MO","MU"],          emoji: "🍎",  exemplo: "MALA" },
  { id: "N",  label: "Família do N",  silabas: ["NA","NE","NI","NO","NU"],          emoji: "🌊",  exemplo: "NAVIO" },
  { id: "P",  label: "Família do P",  silabas: ["PA","PE","PI","PO","PU"],          emoji: "🐾",  exemplo: "PATO" },
  { id: "R",  label: "Família do R",  silabas: ["RA","RE","RI","RO","RU"],          emoji: "🐸",  exemplo: "RATO" },
  { id: "S",  label: "Família do S",  silabas: ["SA","SE","SI","SO","SU"],          emoji: "🌞",  exemplo: "SAPO" },
  { id: "T",  label: "Família do T",  silabas: ["TA","TE","TI","TO","TU"],          emoji: "🐢",  exemplo: "TATU" },
  { id: "V",  label: "Família do V",  silabas: ["VA","VE","VI","VO","VU"],          emoji: "🌿",  exemplo: "VACA" },
  { id: "LH", label: "Família do LH", silabas: ["LHA","LHE","LHI","LHO","LHU"],    emoji: "🧶",  exemplo: "MILHO" },
  { id: "NH", label: "Família do NH", silabas: ["NHA","NHE","NHI","NHO","NHU"],    emoji: "🦟",  exemplo: "NINHO" },
  { id: "CH", label: "Família do CH", silabas: ["CHA","CHE","CHI","CHO","CHU"],    emoji: "🍵",  exemplo: "CHAVE" },
];

export const DIFICULDADE_CONFIG: Record<CruzadinhaDificuldade, { label: string; desc: string; lacunasPorPalavra: number }> = {
  facil:   { label: "Fácil",   desc: "1 sílaba em branco por palavra",        lacunasPorPalavra: 1 },
  medio:   { label: "Médio",   desc: "2 sílabas em branco por palavra",       lacunasPorPalavra: 2 },
  dificil: { label: "Difícil", desc: "Quase tudo em branco — só a 1ª sílaba", lacunasPorPalavra: 99 },
};

export const BNCC_CRUZADINHA = "EI03TS · EF01LP07 · EF02LP04 — Consciência fonológica e silábica";

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function aplicarLacunas(
  item: Omit<PalavraItem, "lacunas">,
  dificuldade: CruzadinhaDificuldade,
  familiasSilabas: string[]
): PalavraItem {
  const { silabas } = item;
  const n = silabas.length;
  const maxLacunas = DIFICULDADE_CONFIG[dificuldade].lacunasPorPalavra;

  // Identify positions that belong to the target family
  const familyPositions = silabas
    .map((s, i) => ({ s: s.toUpperCase(), i }))
    .filter(({ s }) => familiasSilabas.some((f) => s.startsWith(f) || s === f))
    .map(({ i }) => i);

  // For difícil: blank everything except the first syllable
  if (dificuldade === "dificil") {
    const lacunas = Array.from({ length: n - 1 }, (_, i) => i + 1);
    return { ...item, lacunas };
  }

  // Start with family positions (up to maxLacunas)
  let selected = familyPositions.slice(0, maxLacunas);

  // If we still need more and dificuldade requires it
  if (selected.length < maxLacunas) {
    const remaining = embaralhar(
      Array.from({ length: n }, (_, i) => i).filter((i) => !selected.includes(i))
    );
    selected = [...selected, ...remaining].slice(0, maxLacunas);
  }

  // Sort for display order
  return { ...item, lacunas: selected.sort((a, b) => a - b) };
}

export function bancoDeSilabas(palavras: PalavraItem[]): string[] {
  const silabas: string[] = [];
  for (const p of palavras) {
    for (const idx of p.lacunas) {
      silabas.push(p.silabas[idx]);
    }
  }
  return embaralhar(silabas);
}
