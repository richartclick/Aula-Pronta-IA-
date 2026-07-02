export type TipoCaligrafia = "maiusculas" | "minusculas" | "ambas" | "numeros" | "palavras";

export type FaixaCaligrafia = {
  value: string;
  label: string;
  desc: string;
  tamanhoModelo: number;
  tamanhoTracado: number;
  letrasFileira: number;
  linhasTracado: number;
  linhasLivres: number;
  bncc: string;
};

export const FAIXAS_CALIGRAFIA: FaixaCaligrafia[] = [
  {
    value: "4-5",
    label: "4 a 5 anos",
    desc: "Letras muito grandes — pré-escrita",
    tamanhoModelo: 150,
    tamanhoTracado: 70,
    letrasFileira: 4,
    linhasTracado: 2,
    linhasLivres: 2,
    bncc: "EI03TS — Traços, sons, cores e formas (BNCC — Ed. Infantil)",
  },
  {
    value: "6-7",
    label: "6 a 7 anos",
    desc: "1º e 2º ano — iniciação à escrita",
    tamanhoModelo: 110,
    tamanhoTracado: 54,
    letrasFileira: 6,
    linhasTracado: 3,
    linhasLivres: 3,
    bncc: "EF01LP07 — Escrever, com letra legível, palavras e frases (BNCC — Anos Iniciais)",
  },
  {
    value: "8-9",
    label: "8 a 9 anos",
    desc: "3º e 4º ano — aperfeiçoamento",
    tamanhoModelo: 90,
    tamanhoTracado: 42,
    letrasFileira: 8,
    linhasTracado: 3,
    linhasLivres: 4,
    bncc: "EF03LP11 — Escrever com autonomia e legibilidade (BNCC — Anos Iniciais)",
  },
];

export const LETRAS_MAIUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const LETRAS_MINUSCULAS = "abcdefghijklmnopqrstuvwxyz".split("");
export const NUMEROS_CAL = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export type CaligrafiaPayload = {
  tipo: TipoCaligrafia;
  faixaEtaria: string;
  letras?: string[];
  palavras?: string[];
};
