"use server";

export type QuestaoAtividade = {
  numero: number;
  enunciado: string;
  tipo: "dissertativa" | "multipla_escolha" | "desenho" | "completar" | "verdadeiro_falso";
  alternativas?: string[];
  resposta_gabarito: string;
  dica_professor?: string;
  espaco_resposta_linhas: number;
  objeto_desenho?: string;
};

export type AtividadesGeradas = {
  titulo: string;
  disciplina: string;
  serie: string;
  tema: string;
  instrucoes_professor: string;
  questoes: QuestaoAtividade[];
};

// Extração segura de JSON com contagem balanceada de chaves
function extrairJSON(texto: string): string | null {
  const inicio = texto.indexOf("{");
  if (inicio === -1) return null;

  let profundidade = 0;
  let emString = false;
  let escapado = false;

  for (let i = inicio; i < texto.length; i++) {
    const c = texto[i];
    if (escapado) { escapado = false; continue; }
    if (c === "\\" && emString) { escapado = true; continue; }
    if (c === '"') { emString = !emString; continue; }
    if (emString) continue;
    if (c === "{") profundidade++;
    else if (c === "}") {
      profundidade--;
      if (profundidade === 0) return texto.slice(inicio, i + 1);
    }
  }
  return null;
}

export async function gerarAtividades(
  aulaId: string,
  tema: string,
  serie: string,
  disciplina: string,
  conteudoResumo: string
): Promise<{ atividades?: AtividadesGeradas; error?: string }> {
  const inicio = Date.now();
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return { error: "Chave da API não configurada." };

  console.log(`[ATIVIDADES] Iniciando — tema="${tema}" serie="${serie}" disciplina="${disciplina}"`);

  const isInfantil = serie.toLowerCase().includes("infantil");
  const isFund1 = serie.includes("1º ano") || serie.includes("2º ano") || serie.includes("3º ano") || serie.includes("4º ano") || serie.includes("5º ano");

  // Distribuição de tipos por nível
  const distribuicao = isInfantil
    ? `4 questões do tipo "desenho" e 2 do tipo "completar"`
    : isFund1
    ? `2 do tipo "multipla_escolha", 2 do tipo "completar", 1 do tipo "verdadeiro_falso", 1 do tipo "dissertativa"`
    : `2 do tipo "multipla_escolha", 2 do tipo "dissertativa", 1 do tipo "verdadeiro_falso", 1 do tipo "completar"`;

  const tiposPermitidos = isInfantil
    ? '"desenho", "completar"'
    : isFund1
    ? '"multipla_escolha", "completar", "verdadeiro_falso", "dissertativa"'
    : '"multipla_escolha", "dissertativa", "verdadeiro_falso", "completar"';

  const instrucaoInfantil = isInfantil ? `
REGRAS OBRIGATÓRIAS PARA EDUCAÇÃO INFANTIL (crianças de 4 a 6 anos):
- Enunciados com NO MÁXIMO 8 palavras simples — sem palavras difíceis
- Para tipo "desenho": o PDF já vai imprimir um desenho para colorir. Escreva um enunciado curto como "Pinte o sol com cores bonitas!" ou "Pinte o peixinho de vermelho!"
- Para tipo "desenho": campo "objeto_desenho" é OBRIGATÓRIO — escolha EXATAMENTE uma palavra da lista: sol, nuvem, flor, borboleta, peixe, cachorro, gato, casa, arvore, estrela, maca, coracao
- Para tipo "completar": frases com lacuna única, palavra simples, ex: "O cachorro faz ___"
- espaco_resposta_linhas DEVE ser 10 para todos os tipos (espaço grande para crianças)
- instrucoes_professor: inclua SEMPRE orientação sobre materiais de colorir (ex: "Distribua lápis de cor e giz de cera antes de entregar a folha")
- resposta_gabarito: diga o que é esperado, ex: "Sol colorido" ou "au au"
- NÃO use leitura complexa, cálculos, análise crítica ou questões dissertativas
` : "";

  const prompt = `Você é especialista em educação brasileira. Crie 6 questões para alunos do(a) ${serie} sobre "${tema}" em ${disciplina}.
${instrucaoInfantil}
DISTRIBUIÇÃO OBRIGATÓRIA: ${distribuicao}.

LIMITE DE TAMANHO: enunciados em no máximo 2 frases (8 palavras para Infantil). Alternativas em no máximo 6 palavras cada. Gabaritos em 1 frase.

Retorne APENAS JSON puro (sem markdown):
{
  "titulo": "Atividades: ${tema} — ${serie}",
  "disciplina": "${disciplina}",
  "serie": "${serie}",
  "tema": "${tema}",
  "instrucoes_professor": "orientações rápidas para aplicar e corrigir (máximo 2 frases)",
  "questoes": [
    {
      "numero": 1,
      "enunciado": "enunciado da questão",
      "tipo": um de: ${tiposPermitidos},
      "alternativas": ["A) opção", "B) opção", "C) opção", "D) opção"] (SOMENTE se tipo for "multipla_escolha"),
      "resposta_gabarito": "resposta correta para o professor",
      "dica_professor": "dica se aluno tiver dificuldade",
      "espaco_resposta_linhas": número entre 2 e 10,
      "objeto_desenho": "OBRIGATORIO quando tipo=desenho — escolha UMA palavra: sol, nuvem, flor, borboleta, peixe, cachorro, gato, casa, arvore, estrela, maca, coracao"
    }
  ]
}

Gere exatamente 6 questões numeradas de 1 a 6. Conteúdo da aula: ${conteudoResumo}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    console.log("[ATIVIDADES] Chamando Claude API...");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1800,
        system: "Você gera atividades escolares. Responda APENAS com JSON puro, sem markdown, sem texto fora do JSON.",
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const tempoAPI = Date.now() - inicio;
    console.log(`[ATIVIDADES] Claude respondeu em ${tempoAPI}ms — status ${res.status}`);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[ATIVIDADES] Erro API ${res.status}:`, errText.slice(0, 200));
      return { error: "Erro ao chamar a IA. Tente novamente." };
    }

    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const outputTokens = data?.usage?.output_tokens ?? "?";

    console.log(`[ATIVIDADES] Resposta: ${text.length} chars, ${outputTokens} tokens. Início: ${text.slice(0, 100)}`);

    const jsonStr = extrairJSON(text);
    if (!jsonStr) {
      console.error(`[ATIVIDADES] JSON truncado — tokens usados: ${outputTokens}. Texto: ${text.slice(0, 300)}`);
      return { error: "A IA não conseguiu gerar as atividades completas. Tente novamente." };
    }

    let atividades: AtividadesGeradas;
    try {
      atividades = JSON.parse(jsonStr);
    } catch {
      console.error("[ATIVIDADES] JSON inválido:", jsonStr.slice(0, 300));
      return { error: "Erro no formato da resposta. Tente novamente." };
    }

    // Proteção: garante que questoes é array e aceita 4+ questões
    if (!Array.isArray(atividades.questoes) || atividades.questoes.length < 4) {
      console.warn(`[ATIVIDADES] Poucas questões geradas: ${atividades.questoes?.length ?? 0}`);
      return { error: "A IA gerou poucas questões. Tente novamente." };
    }

    // Normaliza numeração caso venha errada
    atividades.questoes = atividades.questoes.map((q, i) => ({ ...q, numero: i + 1 }));

    const tempoTotal = Date.now() - inicio;
    console.log(`[ATIVIDADES] Sucesso! ${atividades.questoes.length} questões geradas em ${tempoTotal}ms`);

    return { atividades };
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    const tempoTotal = Date.now() - inicio;
    console.error(`[ATIVIDADES] Erro após ${tempoTotal}ms:`, err instanceof Error ? err.message : err);
    return {
      error: isTimeout
        ? "A geração demorou demais. Tente novamente."
        : "Erro de conexão. Tente novamente.",
    };
  }
}
