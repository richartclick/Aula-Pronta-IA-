export interface Sequencia {
  numeros: (number | null)[];
  gabarito: number[];
  passo: number;
}

interface PassoConfig {
  passo: number;
  startMin: number;
  startMax: number;
}

export interface FaixaSeqConfig {
  label: string;
  bncc: string;
  seqLength: number;
  blanks: number;
  seqPerPage: number;
  cellSize: number;
  fontSize: number;
  passos: PassoConfig[];
}

export const FAIXAS_SEQ: Record<string, FaixaSeqConfig> = {
  "4-6": {
    label: "4 a 6 anos",
    bncc: "EI03ET — Espaços, tempos, quantidades e relações",
    seqLength: 5,
    blanks: 1,
    seqPerPage: 8,
    cellSize: 36,
    fontSize: 13,
    passos: [
      { passo: 1, startMin: 1, startMax: 10 },
    ],
  },
  "6-8": {
    label: "6 a 8 anos",
    bncc: "EF01MA02 · EF02MA03 — Sequência e contagem numérica",
    seqLength: 6,
    blanks: 2,
    seqPerPage: 10,
    cellSize: 28,
    fontSize: 10,
    passos: [
      { passo: 1, startMin: 1, startMax: 20 },
      { passo: 2, startMin: 0, startMax: 20 },
      { passo: 5, startMin: 0, startMax: 50 },
      { passo: 10, startMin: 0, startMax: 50 },
    ],
  },
  "8-10": {
    label: "8 a 10 anos",
    bncc: "EF03MA01 — Leitura e escrita de números naturais",
    seqLength: 7,
    blanks: 3,
    seqPerPage: 12,
    cellSize: 24,
    fontSize: 9,
    passos: [
      { passo: 2, startMin: 2, startMax: 50 },
      { passo: 3, startMin: 3, startMax: 30 },
      { passo: 5, startMin: 5, startMax: 100 },
      { passo: 10, startMin: 10, startMax: 100 },
      { passo: 100, startMin: 100, startMax: 500 },
    ],
  },
  "10+": {
    label: "10+ anos",
    bncc: "EF05MA01 — Números naturais e operações",
    seqLength: 8,
    blanks: 3,
    seqPerPage: 14,
    cellSize: 22,
    fontSize: 8,
    passos: [
      { passo: 25, startMin: 25, startMax: 200 },
      { passo: 50, startMin: 50, startMax: 500 },
      { passo: 100, startMin: 100, startMax: 1000 },
      { passo: 1000, startMin: 1000, startMax: 5000 },
    ],
  },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gerarUma(config: FaixaSeqConfig): Sequencia {
  const pc = config.passos[Math.floor(Math.random() * config.passos.length)];

  // Round start to nearest multiple of passo for cleaner numbers
  const raw = pc.startMin + Math.floor(Math.random() * (pc.startMax - pc.startMin + 1));
  const start = pc.passo > 1 ? Math.round(raw / pc.passo) * pc.passo : raw;

  const gabarito = Array.from({ length: config.seqLength }, (_, i) => start + i * pc.passo);

  // Blank positions: never first or last
  const candidatos = Array.from({ length: config.seqLength - 2 }, (_, i) => i + 1);
  const brancos = new Set(shuffle(candidatos).slice(0, config.blanks));

  const numeros: (number | null)[] = gabarito.map((n, i) =>
    brancos.has(i) ? null : n
  );

  return { numeros, gabarito, passo: pc.passo };
}

export interface SeqData {
  paginas: Sequencia[][];
  faixaId: string;
}

export function gerarSequencias(faixaId: string, numPaginas: number): SeqData {
  const config = FAIXAS_SEQ[faixaId] ?? FAIXAS_SEQ["6-8"];
  const paginas = Array.from({ length: numPaginas }, () =>
    Array.from({ length: config.seqPerPage }, () => gerarUma(config))
  );
  return { paginas, faixaId };
}
