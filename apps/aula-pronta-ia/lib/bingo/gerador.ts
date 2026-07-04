export type BingoTipo = "tabuada" | "numeros";
export type GridSize = 3 | 4 | 5;

export interface CartelaCell {
  valor: string;
  isLivre: boolean;
}

export interface Cartela {
  numero: number;
  grid: CartelaCell[][];
}

export interface ChamadaItem {
  chamada: string;
  resposta: string;
}

export interface BingoData {
  cartelas: Cartela[];
  chamadas: ChamadaItem[];
  titulo: string;
  subtitulo: string;
  bncc: string;
  gridSize: GridSize;
  tipo: BingoTipo;
}

export const CARDS_PER_PAGE: Record<GridSize, number> = { 3: 9, 4: 6, 5: 4 };
export const CARD_COLS: Record<GridSize, number> = { 3: 3, 4: 2, 5: 2 };

// Cell dimensions used in the PDF renderer
export const CELL_CONFIG: Record<GridSize, { w: number; h: number; fz: number }> = {
  3: { w: 55, h: 70, fz: 20 },
  4: { w: 63, h: 50, fz: 17 },
  5: { w: 51, h: 64, fz: 15 },
};

const BNCC: Record<BingoTipo, string> = {
  tabuada: "EF02MA04 · EF03MA01 — Multiplicação: propriedades e estratégias de cálculo mental",
  numeros: "EI03ET · EF01MA02 — Números: contagem, comparação e ordenação",
};

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function montarGrid(valores: string[], size: GridSize): CartelaCell[][] {
  // FREE space only for odd-sized grids (3×3 center=1,1 / 5×5 center=2,2)
  const hasFree = size % 2 === 1;
  const centro = Math.floor(size / 2);
  const grid: CartelaCell[][] = [];
  let idx = 0;

  for (let r = 0; r < size; r++) {
    const row: CartelaCell[] = [];
    for (let c = 0; c < size; c++) {
      if (hasFree && r === centro && c === centro) {
        row.push({ valor: "LIVRE", isLivre: true });
      } else {
        row.push({ valor: valores[idx++], isLivre: false });
      }
    }
    grid.push(row);
  }

  return grid;
}

function detectGridSize(poolSize: number): GridSize {
  if (poolSize >= 24) return 5;
  if (poolSize >= 16) return 4;
  if (poolSize >= 8) return 3;
  throw new Error(
    `Pool muito pequeno (${poolSize} resultados únicos). Selecione mais tabuadas.`
  );
}

export function gerarBingo(
  tipo: BingoTipo,
  tabelas: number[],
  rangeMax: number,
  numCartelas: number
): BingoData {
  let pool: string[] = [];
  let chamadas: ChamadaItem[] = [];
  let titulo = "";
  let subtitulo = "";

  if (tipo === "tabuada") {
    const resultsSet = new Set<number>();
    const allChamadas: ChamadaItem[] = [];

    for (const t of tabelas.sort((a, b) => a - b)) {
      for (let m = 1; m <= 10; m++) {
        const res = t * m;
        resultsSet.add(res);
        allChamadas.push({ chamada: `${t} × ${m}`, resposta: String(res) });
      }
    }

    pool = Array.from(resultsSet)
      .sort((a, b) => a - b)
      .map(String);
    chamadas = embaralhar(allChamadas);

    titulo = "Bingo da Tabuada";
    const ts = tabelas.map((t) => `do ${t}`).join(", ");
    subtitulo =
      tabelas.length >= 9
        ? "Tabuada do 2 ao 10"
        : `Tabuada ${ts}`;
  } else {
    const max = Math.min(Math.max(rangeMax, 9), 100);
    pool = Array.from({ length: max }, (_, i) => String(i + 1));
    chamadas = embaralhar(pool.map((v) => ({ chamada: v, resposta: v })));
    titulo = "Bingo de Números";
    subtitulo = `Números de 1 a ${max}`;
  }

  const gridSize = detectGridSize(pool.length);
  const hasFree = gridSize % 2 === 1;
  const cellsNeeded = gridSize * gridSize - (hasFree ? 1 : 0);

  const qtd = Math.min(Math.max(numCartelas, 10), 40);

  const cartelas: Cartela[] = Array.from({ length: qtd }, (_, i) => ({
    numero: i + 1,
    grid: montarGrid(embaralhar(pool).slice(0, cellsNeeded), gridSize),
  }));

  return {
    cartelas,
    chamadas,
    titulo,
    subtitulo,
    bncc: BNCC[tipo],
    gridSize,
    tipo,
  };
}
