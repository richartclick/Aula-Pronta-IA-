export type TipoDesafio = "resultado" | "fator" | "misto";

export interface DesafioItem {
  fator1: number;
  fator2: number;
  resultado: number;
  blanked: "resultado" | "fator1" | "fator2";
}

export interface TabuadaData {
  paginas: DesafioItem[][];
  tabelas: number[];
  tipo: TipoDesafio;
}

export const POR_PAGINA = 30;

export const TIPO_LABELS: Record<TipoDesafio, string> = {
  resultado: "Resultado faltando  (3 × 4 = ___)",
  fator: "Fator faltando  (___ × 4 = 12)",
  misto: "Misto  (todos os tipos)",
};

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function tabelasLabel(tabelas: number[]): string {
  if (tabelas.length === 9) return "Todas as tabuadas (×2 a ×10)";
  return tabelas.map((t) => `×${t}`).join(", ");
}

export function gerarTabuada(
  tabelas: number[],
  tipo: TipoDesafio,
  numPaginas: number
): TabuadaData {
  const pool: DesafioItem[] = [];

  for (const t of tabelas) {
    for (let m = 1; m <= 10; m++) {
      const res = t * m;
      if (tipo === "resultado") {
        pool.push({ fator1: t, fator2: m, resultado: res, blanked: "resultado" });
      } else if (tipo === "fator") {
        pool.push({ fator1: t, fator2: m, resultado: res, blanked: "fator2" });
        pool.push({ fator1: t, fator2: m, resultado: res, blanked: "fator1" });
      } else {
        pool.push({ fator1: t, fator2: m, resultado: res, blanked: "resultado" });
        pool.push({ fator1: t, fator2: m, resultado: res, blanked: "fator2" });
        pool.push({ fator1: t, fator2: m, resultado: res, blanked: "fator1" });
      }
    }
  }

  const shuffled = embaralhar(pool);
  const needed = numPaginas * POR_PAGINA;
  const gerados: DesafioItem[] = Array.from(
    { length: needed },
    (_, i) => shuffled[i % shuffled.length]
  );

  const paginas: DesafioItem[][] = Array.from({ length: numPaginas }, (_, i) =>
    gerados.slice(i * POR_PAGINA, (i + 1) * POR_PAGINA)
  );

  return { paginas, tabelas, tipo };
}
