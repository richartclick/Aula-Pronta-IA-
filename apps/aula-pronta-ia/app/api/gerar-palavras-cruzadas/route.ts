import { NextRequest, NextResponse } from "next/server";
import { gerarCruzada, normalizar, type PalavraComPista } from "@/lib/palavras-cruzadas/gerador";

export const maxDuration = 60;

const TEMAS_LABEL: Record<string, string> = {
  animais: "Animais",
  frutas: "Frutas e Alimentos",
  escola: "Escola e Material Escolar",
  familia: "Família",
  profissoes: "Profissões",
  natureza: "Natureza e Meio Ambiente",
  cores: "Cores e Arte",
  corpo: "Corpo Humano",
  datas: "Datas Comemorativas",
  transportes: "Meios de Transporte",
};

function faixaParaConfig(faixa: string): { minLen: number; maxLen: number; qtd: number } {
  if (faixa === "4-6") return { minLen: 3, maxLen: 5, qtd: 7 };
  if (faixa === "7-9") return { minLen: 4, maxLen: 7, qtd: 9 };
  return { minLen: 5, maxLen: 9, qtd: 10 }; // 10+
}

function extrairJSON(texto: string): PalavraComPista[] | null {
  // Tenta extrair JSON array de qualquer lugar na resposta
  const match = texto.match(/\[[\s\S]*?\]/);
  if (!match) return null;
  try {
    const arr = JSON.parse(match[0]);
    if (!Array.isArray(arr)) return null;
    return arr
      .filter((item) => typeof item?.palavra === "string" && typeof item?.pista === "string")
      .map((item) => ({ palavra: normalizar(item.palavra), pista: String(item.pista).trim() }))
      .filter((item) => item.palavra.length >= 3);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tema, faixaEtaria } = await req.json() as { tema: string; faixaEtaria: string };

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json({ error: "Chave da API não configurada." }, { status: 500 });
    }

    const temaLabel = TEMAS_LABEL[tema] ?? tema;
    const { minLen, maxLen, qtd } = faixaParaConfig(faixaEtaria);

    const prompt = `Você é um professor criativo gerando atividades para crianças brasileiras.
Crie exatamente ${qtd} palavras para um jogo de palavras cruzadas.
Tema: ${temaLabel}
Faixa etária: ${faixaEtaria} anos

REGRAS OBRIGATÓRIAS:
- Somente letras A-Z SEM acentos, SEM cedilha, SEM hífen (ex: CACHORRO, NAO, FAMILIA)
- Comprimento: entre ${minLen} e ${maxLen} letras
- Palavras bem conhecidas por crianças desta faixa etária
- Pistas curtas e claras, no máximo 7 palavras cada
- Palavras com letras em comum facilitam o encaixe

Retorne APENAS o JSON abaixo, sem nenhum texto adicional:
[{"palavra":"EXEMPLO","pista":"Uma pista simples aqui"}]`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Falha ao consultar a IA." }, { status: 500 });
    }

    const aiData = await res.json();
    const textoResposta = aiData?.content?.[0]?.text ?? "";
    const palavrasComPista = extrairJSON(textoResposta);

    if (!palavrasComPista || palavrasComPista.length < 3) {
      return NextResponse.json({ error: "A IA não gerou palavras suficientes. Tente novamente." }, { status: 500 });
    }

    const resultado = gerarCruzada(palavrasComPista);
    if (!resultado) {
      return NextResponse.json({ error: "Não foi possível montar a cruzadinha. Tente novamente." }, { status: 500 });
    }

    return NextResponse.json({
      grid: resultado.grid,
      colocadas: resultado.colocadas,
      limites: resultado.limites,
      tema,
      temaLabel,
      faixaEtaria,
    });
  } catch (err) {
    console.error("[GERAR-CRUZADAS] Erro:", err);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
