export type MagicoTamanho = "3x3" | "4x4" | "5x5";
export type MagicoDificuldade = "facil" | "medio" | "dificil";

export interface QuadradoData {
  grade: (number | null)[][];
  solucao: number[][];
  soma: number;
  tamanho: MagicoTamanho;
  dificuldade: MagicoDificuldade;
  numerosDisponiveis: number[];
  id: number;
}

// Casas em branco por tamanho e dificuldade
const BLANKS: Record<MagicoTamanho, Record<MagicoDificuldade, number>> = {
  "3x3": { facil: 3, medio: 5, dificil: 7 },
  "4x4": { facil: 6, medio: 10, dificil: 13 },
  "5x5": { facil: 10, medio: 16, dificil: 22 },
};

export const SOMA_MAGICA: Record<MagicoTamanho, number> = {
  "3x3": 15,
  "4x4": 34,
  "5x5": 65,
};

export const TAMANHO_N: Record<MagicoTamanho, number> = {
  "3x3": 3,
  "4x4": 4,
  "5x5": 5,
};

export const PUZZLES_POR_PAGINA: Record<MagicoTamanho, number> = {
  "3x3": 4,
  "4x4": 2,
  "5x5": 1,
};

export const CELL_SIZE: Record<MagicoTamanho, number> = {
  "3x3": 56,
  "4x4": 46,
  "5x5": 38,
};

// ── Siamese method (odd n: 3, 5) ─────────────────────────────────────────────

function siamese(n: number): number[][] {
  const g: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  let r = 0;
  let c = Math.floor(n / 2);

  for (let k = 1; k <= n * n; k++) {
    g[r][c] = k;
    const nr = ((r - 1) + n) % n;
    const nc = (c + 1) % n;
    if (g[nr][nc] !== 0) {
      r = (r + 1) % n;
    } else {
      r = nr;
      c = nc;
    }
  }
  return g;
}

// ── Doubly-even method (n divisible by 4) ────────────────────────────────────

function doublyEven(n: number): number[][] {
  const g: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => i * n + j + 1)
  );
  const swap = n * n + 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // main and anti-diagonal positions
      if (i === j || i + j === n - 1) {
        g[i][j] = swap - g[i][j];
      }
    }
  }
  return g;
}

// ── Transforms (8 isometries of the square) ──────────────────────────────────

function rotate90(g: number[][]): number[][] {
  const n = g.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => g[n - 1 - j][i])
  );
}

function flipH(g: number[][]): number[][] {
  return g.map((row) => [...row].reverse());
}

function randomTransform(g: number[][]): number[][] {
  const rotations = Math.floor(Math.random() * 4);
  let result = g;
  for (let i = 0; i < rotations; i++) result = rotate90(result);
  if (Math.random() < 0.5) result = flipH(result);
  return result;
}

// ── Base grid by tamanho ──────────────────────────────────────────────────────

function baseGrid(tamanho: MagicoTamanho): number[][] {
  const n = TAMANHO_N[tamanho];
  if (n % 2 === 1) return siamese(n);
  return doublyEven(n);
}

// ── Remove cells ──────────────────────────────────────────────────────────────

function embaralharIndices(total: number): number[] {
  const arr = Array.from({ length: total }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Main generator ─────────────────────────────────────────────────────────

export function gerarQuadrados(
  tamanho: MagicoTamanho,
  dificuldade: MagicoDificuldade,
  quantidade: number
): QuadradoData[] {
  const n = TAMANHO_N[tamanho];
  const numBlanks = BLANKS[tamanho][dificuldade];
  const soma = SOMA_MAGICA[tamanho];

  return Array.from({ length: quantidade }, (_, id) => {
    const solucao = randomTransform(baseGrid(tamanho));

    // Pick blank positions
    const indices = embaralharIndices(n * n).slice(0, numBlanks);
    const blankedSet = new Set(indices);

    const grade: (number | null)[][] = solucao.map((row, ri) =>
      row.map((val, ci) => (blankedSet.has(ri * n + ci) ? null : val))
    );

    const numerosDisponiveis = indices
      .map((idx) => solucao[Math.floor(idx / n)][idx % n])
      .sort((a, b) => a - b);

    return { grade, solucao, soma, tamanho, dificuldade, numerosDisponiveis, id: id + 1 };
  });
}
