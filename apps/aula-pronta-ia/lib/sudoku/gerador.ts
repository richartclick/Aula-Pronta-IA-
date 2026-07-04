export interface TamanhoConfig {
  size: number;
  boxRows: number;
  boxCols: number;
  remover: number;
  label: string;
  publico: string;
  bncc: string;
  cellSize: number;
  fontSize: number;
  instrNumeros: string;
  emoji: string;
  cor: string;
}

export const TAMANHOS: Record<string, TamanhoConfig> = {
  "4x4": {
    size: 4,
    boxRows: 2,
    boxCols: 2,
    remover: 7,
    label: "4×4",
    publico: "4-8 anos",
    bncc: "EI03ET — Raciocínio lógico e pensamento matemático",
    cellSize: 72,
    fontSize: 26,
    instrNumeros: "1, 2, 3 e 4",
    emoji: "🌱",
    cor: "from-green-400 to-teal-500",
  },
  "6x6": {
    size: 6,
    boxRows: 2,
    boxCols: 3,
    remover: 16,
    label: "6×6",
    publico: "7-10 anos",
    bncc: "EF01MA02 — Sequências e padrões numéricos",
    cellSize: 48,
    fontSize: 18,
    instrNumeros: "1, 2, 3, 4, 5 e 6",
    emoji: "📘",
    cor: "from-blue-400 to-indigo-500",
  },
  "9x9": {
    size: 9,
    boxRows: 3,
    boxCols: 3,
    remover: 35,
    label: "9×9",
    publico: "10+ anos",
    bncc: "EF03MA01 — Raciocínio lógico e combinatório",
    cellSize: 36,
    fontSize: 14,
    instrNumeros: "1 a 9",
    emoji: "📙",
    cor: "from-orange-400 to-rose-500",
  },
};

export interface SudokuData {
  puzzle: number[][];
  solucao: number[][];
  tamanhoId: string;
}

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isValido(
  grid: number[][],
  row: number,
  col: number,
  num: number,
  size: number,
  boxRows: number,
  boxCols: number
): boolean {
  for (let c = 0; c < size; c++) {
    if (grid[row][c] === num) return false;
  }
  for (let r = 0; r < size; r++) {
    if (grid[r][col] === num) return false;
  }
  const startR = Math.floor(row / boxRows) * boxRows;
  const startC = Math.floor(col / boxCols) * boxCols;
  for (let r = startR; r < startR + boxRows; r++) {
    for (let c = startC; c < startC + boxCols; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

function resolverBacktrack(
  grid: number[][],
  pos: number,
  size: number,
  boxRows: number,
  boxCols: number,
  aleatorio: boolean
): boolean {
  if (pos === size * size) return true;
  const row = Math.floor(pos / size);
  const col = pos % size;
  if (grid[row][col] !== 0) {
    return resolverBacktrack(grid, pos + 1, size, boxRows, boxCols, aleatorio);
  }
  let nums = Array.from({ length: size }, (_, i) => i + 1);
  if (aleatorio) nums = embaralhar(nums);
  for (const num of nums) {
    if (isValido(grid, row, col, num, size, boxRows, boxCols)) {
      grid[row][col] = num;
      if (resolverBacktrack(grid, pos + 1, size, boxRows, boxCols, aleatorio)) {
        return true;
      }
      grid[row][col] = 0;
    }
  }
  return false;
}

function contarSolucoes(
  grid: number[][],
  pos: number,
  size: number,
  boxRows: number,
  boxCols: number,
  count: { n: number }
): void {
  if (count.n >= 2) return;
  if (pos === size * size) {
    count.n++;
    return;
  }
  const row = Math.floor(pos / size);
  const col = pos % size;
  if (grid[row][col] !== 0) {
    contarSolucoes(grid, pos + 1, size, boxRows, boxCols, count);
    return;
  }
  for (let num = 1; num <= size; num++) {
    if (isValido(grid, row, col, num, size, boxRows, boxCols)) {
      grid[row][col] = num;
      contarSolucoes(grid, pos + 1, size, boxRows, boxCols, count);
      grid[row][col] = 0;
    }
    if (count.n >= 2) return;
  }
}

export function gerarSudoku(tamanhoId: string): SudokuData {
  const config = TAMANHOS[tamanhoId] ?? TAMANHOS["4x4"];
  const { size, boxRows, boxCols, remover } = config;

  // 1. Gera solução completa com números embaralhados
  const solucao = Array.from({ length: size }, () => new Array<number>(size).fill(0));
  resolverBacktrack(solucao, 0, size, boxRows, boxCols, true);

  // 2. Remove células mantendo solução única garantida
  const puzzle = solucao.map((r) => [...r]);
  const positions = embaralhar(Array.from({ length: size * size }, (_, i) => i));

  let removidos = 0;
  for (const pos of positions) {
    if (removidos >= remover) break;
    const row = Math.floor(pos / size);
    const col = pos % size;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const testGrid = puzzle.map((r) => [...r]);
    const count = { n: 0 };
    contarSolucoes(testGrid, 0, size, boxRows, boxCols, count);

    if (count.n === 1) {
      removidos++;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return { puzzle, solucao, tamanhoId };
}
