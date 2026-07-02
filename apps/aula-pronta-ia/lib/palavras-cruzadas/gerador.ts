export type PalavraComPista = { palavra: string; pista: string };
export type DirecaoPalavra = "horizontal" | "vertical";

export type PalavraColocada = {
  palavra: string;
  pista: string;
  linha: number;
  coluna: number;
  direcao: DirecaoPalavra;
  numero: number;
};

export type CelulaGrid = { letra: string | null };

export type ResultadoCruzada = {
  grid: CelulaGrid[][];
  colocadas: PalavraColocada[];
  limites: { minLinha: number; maxLinha: number; minCol: number; maxCol: number };
};

export type GridData = {
  grid: CelulaGrid[][];
  colocadas: PalavraColocada[];
  limites: { minLinha: number; maxLinha: number; minCol: number; maxCol: number };
  tema: string;
  faixaEtaria: string;
};

const TAMANHO = 17;

export function normalizar(s: string): string {
  return s
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z]/g, "");
}

function criar(): CelulaGrid[][] {
  return Array.from({ length: TAMANHO }, () =>
    Array.from({ length: TAMANHO }, () => ({ letra: null }))
  );
}

function porPalavra(
  grid: CelulaGrid[][],
  palavra: string,
  linha: number,
  col: number,
  dir: DirecaoPalavra
): void {
  for (let i = 0; i < palavra.length; i++) {
    const r = dir === "horizontal" ? linha : linha + i;
    const c = dir === "horizontal" ? col + i : col;
    grid[r][c] = { letra: palavra[i] };
  }
}

function podePor(
  grid: CelulaGrid[][],
  palavra: string,
  linha: number,
  col: number,
  dir: DirecaoPalavra
): boolean {
  const len = palavra.length;
  const horiz = dir === "horizontal";

  // Limites do grid
  if (linha < 0 || col < 0) return false;
  if (horiz && (col + len > TAMANHO || linha >= TAMANHO)) return false;
  if (!horiz && (linha + len > TAMANHO || col >= TAMANHO)) return false;

  // Célula imediatamente antes da palavra
  const avLinha = horiz ? linha : linha - 1;
  const avCol = horiz ? col - 1 : col;
  if (avLinha >= 0 && avCol >= 0 && grid[avLinha][avCol].letra !== null) return false;

  // Célula imediatamente depois da palavra
  const dpLinha = horiz ? linha : linha + len;
  const dpCol = horiz ? col + len : col;
  if (dpLinha < TAMANHO && dpCol < TAMANHO && grid[dpLinha][dpCol].letra !== null) return false;

  let temIntersecao = false;

  for (let i = 0; i < len; i++) {
    const r = horiz ? linha : linha + i;
    const c = horiz ? col + i : col;
    const celula = grid[r][c];

    if (celula.letra !== null) {
      if (celula.letra !== palavra[i]) return false;
      temIntersecao = true;
    } else {
      // Checar vizinhos perpendiculares para não criar palavras paralelas
      if (horiz) {
        if (r > 0 && grid[r - 1][c].letra !== null) return false;
        if (r < TAMANHO - 1 && grid[r + 1][c].letra !== null) return false;
      } else {
        if (c > 0 && grid[r][c - 1].letra !== null) return false;
        if (c < TAMANHO - 1 && grid[r][c + 1].letra !== null) return false;
      }
    }
  }

  return temIntersecao;
}

function contarIntersecoes(
  grid: CelulaGrid[][],
  palavra: string,
  linha: number,
  col: number,
  dir: DirecaoPalavra
): number {
  let n = 0;
  for (let i = 0; i < palavra.length; i++) {
    const r = dir === "horizontal" ? linha : linha + i;
    const c = dir === "horizontal" ? col + i : col;
    if (r >= 0 && r < TAMANHO && c >= 0 && c < TAMANHO && grid[r][c].letra !== null) n++;
  }
  return n;
}

export function gerarCruzada(entradas: PalavraComPista[]): ResultadoCruzada | null {
  const palavras = entradas
    .map((e) => ({ ...e, palavra: normalizar(e.palavra) }))
    .filter((e) => e.palavra.length >= 3 && e.palavra.length <= 14)
    .sort((a, b) => b.palavra.length - a.palavra.length);

  if (palavras.length === 0) return null;

  const grid = criar();
  type Candidato = { palavra: string; pista: string; linha: number; coluna: number; direcao: DirecaoPalavra };
  const colocadas: Candidato[] = [];

  // Primeira palavra — horizontal no centro
  const p0 = palavras[0];
  const l0 = Math.floor(TAMANHO / 2);
  const c0 = Math.floor((TAMANHO - p0.palavra.length) / 2);
  porPalavra(grid, p0.palavra, l0, c0, "horizontal");
  colocadas.push({ palavra: p0.palavra, pista: p0.pista, linha: l0, coluna: c0, direcao: "horizontal" });

  // Palavras seguintes — encaixar perpendicularmente
  for (let wi = 1; wi < palavras.length; wi++) {
    const { palavra, pista } = palavras[wi];
    let melhor: { linha: number; coluna: number; direcao: DirecaoPalavra; score: number } | null = null;

    for (const placed of colocadas) {
      const perpDir: DirecaoPalavra = placed.direcao === "horizontal" ? "vertical" : "horizontal";

      for (let pi = 0; pi < placed.palavra.length; pi++) {
        const letra = placed.palavra[pi];
        const pLinha = placed.direcao === "horizontal" ? placed.linha : placed.linha + pi;
        const pCol = placed.direcao === "horizontal" ? placed.coluna + pi : placed.coluna;

        for (let wi2 = 0; wi2 < palavra.length; wi2++) {
          if (palavra[wi2] !== letra) continue;

          const tryLinha = perpDir === "horizontal" ? pLinha : pLinha - wi2;
          const tryCol = perpDir === "horizontal" ? pCol - wi2 : pCol;

          if (podePor(grid, palavra, tryLinha, tryCol, perpDir)) {
            const score = contarIntersecoes(grid, palavra, tryLinha, tryCol, perpDir);
            if (!melhor || score > melhor.score) {
              melhor = { linha: tryLinha, coluna: tryCol, direcao: perpDir, score };
            }
          }
        }
      }
    }

    if (melhor) {
      porPalavra(grid, palavra, melhor.linha, melhor.coluna, melhor.direcao);
      colocadas.push({ palavra, pista, linha: melhor.linha, coluna: melhor.coluna, direcao: melhor.direcao });
    }
  }

  if (colocadas.length < 3) return null;

  // Numerar por ordem de leitura (cima→baixo, esq→dir)
  const ordenadas = [...colocadas].sort(
    (a, b) => a.linha !== b.linha ? a.linha - b.linha : a.coluna - b.coluna
  );
  const posParaNum = new Map<string, number>();
  let contador = 0;
  for (const w of ordenadas) {
    const key = `${w.linha},${w.coluna}`;
    if (!posParaNum.has(key)) posParaNum.set(key, ++contador);
  }

  const comNumeros: PalavraColocada[] = ordenadas.map((w) => ({
    ...w,
    numero: posParaNum.get(`${w.linha},${w.coluna}`)!,
  }));

  // Bounding box + padding de 1 célula
  let minLinha = TAMANHO, maxLinha = 0, minCol = TAMANHO, maxCol = 0;
  for (const w of comNumeros) {
    minLinha = Math.min(minLinha, w.linha);
    maxLinha = Math.max(maxLinha, w.direcao === "horizontal" ? w.linha : w.linha + w.palavra.length - 1);
    minCol = Math.min(minCol, w.coluna);
    maxCol = Math.max(maxCol, w.direcao === "horizontal" ? w.coluna + w.palavra.length - 1 : w.coluna);
  }
  minLinha = Math.max(0, minLinha - 1);
  maxLinha = Math.min(TAMANHO - 1, maxLinha + 1);
  minCol = Math.max(0, minCol - 1);
  maxCol = Math.min(TAMANHO - 1, maxCol + 1);

  return { grid, colocadas: comNumeros, limites: { minLinha, maxLinha, minCol, maxCol } };
}
