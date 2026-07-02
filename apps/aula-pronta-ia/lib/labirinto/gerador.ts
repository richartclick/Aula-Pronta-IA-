export type Parede = { top: boolean; right: boolean; bottom: boolean; left: boolean };
export type Celula = { paredes: Parede };

export type ConfigLabirinto = {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  linhas: number;
  colunas: number;
  tamCelulaPDF: number; // pt no PDF
};

export const DIFICULDADES: ConfigLabirinto[] = [
  { id: "facil",   label: "Fácil",   emoji: "😊", desc: "4 a 5 anos · 6×6",   linhas: 6,  colunas: 6,  tamCelulaPDF: 62 },
  { id: "medio",   label: "Médio",   emoji: "🙂", desc: "6 a 7 anos · 9×9",   linhas: 9,  colunas: 9,  tamCelulaPDF: 44 },
  { id: "dificil", label: "Difícil", emoji: "😤", desc: "8 a 9 anos · 12×12", linhas: 12, colunas: 12, tamCelulaPDF: 33 },
  { id: "desafio", label: "Desafio", emoji: "🤯", desc: "10+ anos · 15×15",   linhas: 15, colunas: 15, tamCelulaPDF: 26 },
];

export type LabirintoData = {
  celulas: Celula[][];
  solucao: [number, number][];
  dificuldadeId: string;
};

const OPOSTOS = { top: "bottom", right: "left", bottom: "top", left: "right" } as const;

// Recursive Backtracker (DFS) — gera labirinto perfeito
export function gerarLabirinto(linhas: number, colunas: number): Celula[][] {
  const celulas: Celula[][] = Array.from({ length: linhas }, () =>
    Array.from({ length: colunas }, () => ({
      paredes: { top: true, right: true, bottom: true, left: true },
    }))
  );
  const visitado: boolean[][] = Array.from({ length: linhas }, () =>
    Array.from({ length: colunas }, () => false)
  );

  const stack: [number, number][] = [];
  let cr = 0, cc = 0;
  visitado[cr][cc] = true;
  let totalVisitado = 1;
  const total = linhas * colunas;

  while (totalVisitado < total) {
    const vizinhos: [number, number, keyof Parede][] = [];
    if (cr > 0 && !visitado[cr - 1][cc]) vizinhos.push([cr - 1, cc, "top"]);
    if (cc < colunas - 1 && !visitado[cr][cc + 1]) vizinhos.push([cr, cc + 1, "right"]);
    if (cr < linhas - 1 && !visitado[cr + 1][cc]) vizinhos.push([cr + 1, cc, "bottom"]);
    if (cc > 0 && !visitado[cr][cc - 1]) vizinhos.push([cr, cc - 1, "left"]);

    if (vizinhos.length > 0) {
      const [nr, nc, dir] = vizinhos[Math.floor(Math.random() * vizinhos.length)];
      celulas[cr][cc].paredes[dir] = false;
      celulas[nr][nc].paredes[OPOSTOS[dir]] = false;
      stack.push([cr, cc]);
      cr = nr;
      cc = nc;
      visitado[cr][cc] = true;
      totalVisitado++;
    } else if (stack.length > 0) {
      [cr, cc] = stack.pop()!;
    }
  }

  // Abrir entrada (topo da 1ª célula) e saída (base da última)
  celulas[0][0].paredes.top = false;
  celulas[linhas - 1][colunas - 1].paredes.bottom = false;

  return celulas;
}

// BFS — encontra o caminho da solução
export function encontrarCaminho(
  celulas: Celula[][],
  linhas: number,
  colunas: number
): [number, number][] {
  const fila: [number, number, [number, number][]][] = [[0, 0, [[0, 0]]]];
  const visitado = new Set<string>(["0,0"]);

  while (fila.length > 0) {
    const [r, c, caminho] = fila.shift()!;
    if (r === linhas - 1 && c === colunas - 1) return caminho;

    const { top, right, bottom, left } = celulas[r][c].paredes;
    const movimentos: [number, number, boolean][] = [
      [r - 1, c, top],
      [r, c + 1, right],
      [r + 1, c, bottom],
      [r, c - 1, left],
    ];
    for (const [nr, nc, parede] of movimentos) {
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < linhas && nc >= 0 && nc < colunas && !parede && !visitado.has(key)) {
        visitado.add(key);
        fila.push([nr, nc, [...caminho, [nr, nc]]]);
      }
    }
  }
  return [];
}

export function gerarLabirintoCompleto(dificuldadeId: string): LabirintoData | null {
  const config = DIFICULDADES.find((d) => d.id === dificuldadeId);
  if (!config) return null;
  const celulas = gerarLabirinto(config.linhas, config.colunas);
  const solucao = encontrarCaminho(celulas, config.linhas, config.colunas);
  return { celulas, solucao, dificuldadeId };
}
