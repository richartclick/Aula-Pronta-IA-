import { NextRequest, NextResponse } from "next/server";
import { gerarCaca } from "@/lib/caca-palavras/gerador";

export const maxDuration = 60;

const TEMAS_LABELS: Record<string, string> = {
  animais: "Animais", frutas: "Frutas", escola: "Escola",
  familia: "Família", profissoes: "Profissões", natureza: "Natureza",
  cores: "Cores e Arte", corpo: "Corpo Humano", datas: "Datas Especiais",
  transportes: "Transportes",
};

const FAIXA_DESC: Record<string, string> = {
  "4-6": "crianças de 4 a 6 anos (Educação Infantil), palavras simples de 3 a 5 letras",
  "7-9": "crianças de 7 a 9 anos (1º ao 3º ano), palavras de 4 a 7 letras",
  "10+": "crianças de 10 anos ou mais (4º ao 5º ano), palavras de 5 a 9 letras",
};

const NUM_PALAVRAS: Record<string, string> = {
  "4-6": "6 a 8",
  "7-9": "8 a 10",
  "10+": "10 a 12",
};

function extrairJSON(text: string): string[] {
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) return [];
  try {
    const arr = JSON.parse(match[0]);
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { tema, faixaEtaria } = await req.json() as { tema: string; faixaEtaria: string };
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "Chave API não configurada." }, { status: 500 });

  const temaLabel = TEMAS_LABELS[tema] ?? tema;
  const n = NUM_PALAVRAS[faixaEtaria] ?? "8 a 10";
  const desc = FAIXA_DESC[faixaEtaria] ?? FAIXA_DESC["7-9"];

  const prompt = `Você é um assistente educacional brasileiro. Gere ${n} palavras em português sobre o tema "${temaLabel}" para um caça-palavras para ${desc}.

Regras:
- Palavras simples e conhecidas por crianças brasileiras
- Uma palavra por item, sem espaços ou hífens
- Sem repetições
- Responda APENAS com um array JSON de strings, exemplo: ["GATO","LEÃO","PATO"]`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return NextResponse.json({ error: "Erro na API de IA." }, { status: 500 });

    const aiData = await res.json();
    const text = (aiData.content?.[0]?.text ?? "") as string;
    const palavras = extrairJSON(text);

    if (palavras.length < 4) {
      return NextResponse.json({ error: "IA não gerou palavras suficientes. Tente novamente." }, { status: 500 });
    }

    const caca = gerarCaca(palavras, faixaEtaria, tema, temaLabel);

    if (caca.colocadas.length < 4) {
      return NextResponse.json({ error: "Não foi possível montar o caça-palavras. Tente novamente." }, { status: 500 });
    }

    return NextResponse.json(caca);
  } catch (err) {
    console.error("[GERAR-CACA]", err);
    return NextResponse.json({ error: "Erro ao gerar caça-palavras." }, { status: 500 });
  }
}
