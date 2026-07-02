const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export interface PalavraColocada {
  original: string;
  normalizada: string;
  celulas: [number, number][];
}

export interface CacaData {
  grid: string[][];
  colocadas: PalavraColocada[];
  linhas: number;
  colunas: number;
  tema: string;
  temaLabel: string;
  faixaEtaria: string;
}

type Dir = [number, number];

const DIRECOES: Record<string, Dir[]> = {
  "4-6": [[0, 1], [1, 0]],
  "7-9": [[0, 1], [1, 0], [1, 1]],
  "10+": [[0, 1], [1, 0], [1, 1], [0, -1], [1, -1]],
};

const TAMANHO: Record<string, [number, number]> = {
  "4-6": [10, 10],
  "7-9": [12, 12],
  "10+": [15, 15],
};

export const CELL_PDF: Record<string, number> = {
  "4-6": 36,
  "7-9": 30,
  "10+": 24,
};

export const BNCC_CACA: Record<string, string> = {
  "4-6": "EI03TS — Traços, sons, cores e formas",
  "7-9": "EF01LP07 — Leitura e escrita de palavras",
  "10+": "EF03LP11 — Autonomia e fluência na escrita",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function colocar(
  grid: string[][],
  palavra: string,
  r0: number,
  c0: number,
  dl: number,
  dc: number,
  linhas: number,
  colunas: number
): [number, number][] | null {
  const cells: [number, number][] = [];
  for (let i = 0; i < palavra.length; i++) {
    const r = r0 + i * dl;
    const c = c0 + i * dc;
    if (r < 0 || r >= linhas || c < 0 || c >= colunas) return null;
    if (grid[r][c] !== "" && grid[r][c] !== palavra[i]) return null;
    cells.push([r, c]);
  }
  for (let i = 0; i < palavra.length; i++) {
    grid[cells[i][0]][cells[i][1]] = palavra[i];
  }
  return cells;
}

export function gerarCaca(
  palavrasOriginais: string[],
  faixaEtaria: string,
  tema: string,
  temaLabel: string
): CacaData {
  const [linhas, colunas] = TAMANHO[faixaEtaria] ?? TAMANHO["7-9"];
  const dirs = DIRECOES[faixaEtaria] ?? DIRECOES["7-9"];

  const palavras = palavrasOriginais
    .map((p) => ({ original: p.trim(), normalizada: normalizar(p.trim()) }))
    .filter((p) => p.normalizada.length >= 3 && p.normalizada.length <= Math.max(linhas, colunas));

  palavras.sort((a, b) => b.normalizada.length - a.normalizada.length);

  const grid: string[][] = Array.from({ length: linhas }, () =>
    Array(colunas).fill("")
  );
  const colocadas: PalavraColocada[] = [];

  for (const { original, normalizada } of palavras) {
    const candidatos = shuffle(
      dirs.flatMap(([dl, dc]) =>
        Array.from({ length: linhas * colunas }, (_, i) => ({
          r: Math.floor(i / colunas),
          c: i % colunas,
          dl,
          dc,
        }))
      )
    );

    for (const { r, c, dl, dc } of candidatos) {
      const cells = colocar(grid, normalizada, r, c, dl, dc, linhas, colunas);
      if (cells) {
        colocadas.push({ original, normalizada, celulas: cells });
        break;
      }
    }
  }

  for (let r = 0; r < linhas; r++) {
    for (let c = 0; c < colunas; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = LETRAS[Math.floor(Math.random() * LETRAS.length)];
      }
    }
  }

  return { grid, colocadas, linhas, colunas, tema, temaLabel, faixaEtaria };
}
