"use server";

export type QuestaoAtividade = {
  numero: number;
  enunciado: string;
  tipo: "dissertativa" | "multipla_escolha" | "desenho" | "completar" | "verdadeiro_falso";
  alternativas?: string[];
  resposta_gabarito: string;
  dica_professor?: string;
  espaco_resposta_linhas: number;
};

export type AtividadesGeradas = {
  titulo: string;
  disciplina: string;
  serie: string;
  tema: string;
  instrucoes_professor: string;
  questoes: QuestaoAtividade[];
};

export async function gerarAtividades(
  aulaId: string,
  tema: string,
  serie: string,
  disciplina: string,
  conteudoResumo: string
): Promise<{ atividades?: AtividadesGeradas; error?: string }> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return { error: "Chave da API não configurada." };

  const isEducacaoInfantil = serie.toLowerCase().includes("infantil") || serie.includes("1º ano") || serie.includes("2º ano");
  const isFundamental1 = serie.includes("3º ano") || serie.includes("4º ano") || serie.includes("5º ano");

  const tiposPermitidos = isEducacaoInfantil
    ? '"desenho", "completar", "verdadeiro_falso"'
    : isFundamental1
    ? '"multipla_escolha", "completar", "verdadeiro_falso", "dissertativa"'
    : '"multipla_escolha", "dissertativa", "verdadeiro_falso"';

  const prompt = `Você é um especialista em educação brasileira. Crie uma lista de atividades para alunos do(a) ${serie} sobre "${tema}" em ${disciplina}.

${isEducacaoInfantil ? `IMPORTANTE: Esta é Educação Infantil. As atividades devem ser:
- Para o tipo "desenho": descreva DETALHADAMENTE o que a criança deve desenhar (ex: "Desenhe um cachorro com 4 patas, orelhas grandes e rabo. Pinte de marrom."). O campo espaco_resposta_linhas deve ser 8 ou mais para dar espaço ao desenho.
- Use linguagem simples, frases curtas
- Priorize atividades lúdicas e concretas` : ""}

Retorne APENAS JSON válido (sem markdown):
{
  "titulo": "Atividades: ${tema} — ${serie}",
  "disciplina": "${disciplina}",
  "serie": "${serie}",
  "tema": "${tema}",
  "instrucoes_professor": "orientações para o professor aplicar e corrigir estas atividades",
  "questoes": [
    {
      "numero": 1,
      "enunciado": "texto da questão ou instrução da atividade",
      "tipo": um dos tipos: ${tiposPermitidos},
      "alternativas": ["A) opção 1", "B) opção 2", "C) opção 3", "D) opção 4"] (apenas se tipo for "multipla_escolha"),
      "resposta_gabarito": "resposta correta completa para o professor",
      "dica_professor": "como mediar se o aluno tiver dificuldade (opcional)",
      "espaco_resposta_linhas": número de linhas em branco para o aluno responder (entre 2 e 10)
    }
  ]
}

Crie entre 4 e 6 questões variadas e adequadas para a faixa etária. Conteúdo da aula: ${conteudoResumo}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) return { error: "Erro ao chamar a IA. Tente novamente." };

    const data = await res.json();
    const text: string = data.content[0].text;
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const atividades: AtividadesGeradas = JSON.parse(text.slice(jsonStart, jsonEnd));
    return { atividades };
  } catch {
    return { error: "Erro ao gerar atividades. Tente novamente." };
  }
}
