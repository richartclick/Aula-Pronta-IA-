"use server";

import type { AulaCompleta, AulaGeradaState } from "./gerar-aula";

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

function nivelEducacional(serie: string): "infantil" | "fund1" | "fund2" | "medio" {
  if (serie === "Educação Infantil") return "infantil";
  if (serie.includes("EM")) return "medio";
  const ano = parseInt(serie);
  if (!isNaN(ano)) return ano <= 5 ? "fund1" : "fund2";
  return "fund1";
}

function instrucoesPorNivel(nivel: ReturnType<typeof nivelEducacional>, serie: string): string {
  const map: Record<string, string> = {
    infantil: `NÍVEL EDUCAÇÃO INFANTIL: use linguagem MUITO simples, atividades lúdicas, sem leitura/escrita, foco em exploração sensorial.`,
    fund1: `NÍVEL FUNDAMENTAL I (${serie}): linguagem acessível, exemplos do cotidiano da criança, misture atividades escritas simples com práticas.`,
    fund2: `NÍVEL FUNDAMENTAL II (${serie}): linguagem mais formal, aprofundamento conceitual, atividades com argumentação e pensamento crítico.`,
    medio: `NÍVEL ENSINO MÉDIO (${serie}): linguagem técnica, conecte com ENEM/vestibular, aprofundamento avançado.`,
  };
  return map[nivel];
}

// Versão demo: gera aula sem autenticação e sem salvar no banco
export async function gerarAulaDemo(
  _prev: AulaGeradaState,
  formData: FormData
): Promise<AulaGeradaState> {
  const tema = formData.get("tema")?.toString().trim();
  const serie = formData.get("serie")?.toString().trim();
  const duracao = formData.get("duracao")?.toString().trim();
  const disciplina = formData.get("disciplina")?.toString().trim();
  const estilo = formData.get("estilo")?.toString().trim();

  if (!tema || !serie || !duracao || !disciplina) {
    return { status: "error", message: "Preencha os campos obrigatórios." };
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return { status: "error", message: "IA não configurada." };

  const nivel = nivelEducacional(serie);
  const instrucaoNivel = instrucoesPorNivel(nivel, serie);

  const prompt = `Crie um plano de aula para professor brasileiro. Responda APENAS com JSON puro, sem markdown.

DADOS:
- Tema: ${tema}
- Série: ${serie}
- Disciplina: ${disciplina}
- Duração: ${duracao}
- Estilo pedagógico: ${estilo || "dinâmico e interativo"}

${instrucaoNivel}

LIMITES DE TAMANHO:
- conteudo_didatico: máximo 150 palavras
- introducao.descricao: máximo 50 palavras
- Cada desenvolvimento[].descricao: máximo 60 palavras
- Cada atividade[].descricao: máximo 70 palavras
- fechamento.descricao: máximo 40 palavras
- Cada campo de avaliacao: máximo 40 palavras

JSON EXATO:
{
  "titulo": "título criativo — ${disciplina}, ${tema}, ${serie}",
  "bncc": ["código BNCC real 1", "código BNCC real 2"],
  "conteudo_didatico": "conteúdo real e específico",
  "objetivos": ["verbo Bloom + aprendizagem 1", "verbo Bloom + aprendizagem 2", "verbo Bloom + habilidade 3"],
  "pergunta_norteadora": "pergunta instigante conectando ${tema} à vida real",
  "contextualizacao": "onde ${tema} aparece no cotidiano — 2 exemplos",
  "introducao": { "duracao": "X min", "descricao": "como iniciar", "dica_professor": "dica prática" },
  "desenvolvimento": [
    { "etapa": "1. Construção do conhecimento", "duracao": "X min", "descricao": "sequência para apresentar ${tema}", "perguntas_mediacao": ["pergunta 1", "pergunta 2"], "dica_professor": "dica" },
    { "etapa": "2. Prática e aprofundamento", "duracao": "X min", "descricao": "como os alunos praticam", "perguntas_mediacao": ["pergunta 1", "pergunta 2"], "dica_professor": "dica" }
  ],
  "atividades": [
    { "titulo": "atividade individual", "tipo": "individual", "duracao": "X min", "descricao": "enunciado real", "objetivo_bloom": "nível Bloom", "diferenciacao": "apoio/desafio" },
    { "titulo": "atividade em grupo", "tipo": "grupo", "duracao": "X min", "descricao": "enunciado real", "objetivo_bloom": "nível Bloom", "diferenciacao": "apoio/desafio" }
  ],
  "fechamento": { "duracao": "X min", "descricao": "como encerrar", "perguntas_reflexao": ["pergunta 1", "pergunta 2"] },
  "avaliacao": { "formativa": "como avaliar durante", "somativa": "avaliação formal", "autoavaliacao": "checklist do aluno" },
  "materiais": ["material 1", "material 2", "material 3"],
  "adaptacoes": { "inclusao": "apoio para dificuldades", "aceleracao": "desafio para avançados", "recursos_digitais": "recurso digital opcional" },
  "interdisciplinaridade": "conexão com outra disciplina",
  "para_casa": "atividade opcional para casa"
}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 55000);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        system: "Você é especialista em educação brasileira. Responda APENAS com JSON puro, sem markdown.",
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return { status: "error", message: "Erro ao chamar a IA. Tente novamente." };

    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const jsonStr = extrairJSON(text);
    if (!jsonStr) return { status: "error", message: "A IA não conseguiu gerar a aula. Tente novamente." };

    let aula: AulaCompleta;
    try {
      aula = JSON.parse(jsonStr);
    } catch {
      return { status: "error", message: "Erro no formato da resposta. Tente novamente." };
    }

    return {
      status: "success",
      aula,
      // aulaId é undefined — não salva no banco
      meta: { tema: tema!, serie: serie!, disciplina: disciplina!, duracao: duracao! },
    };
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return {
      status: "error",
      message: isTimeout ? "A geração demorou demais. Tente novamente." : "Erro de conexão. Tente novamente.",
    };
  }
}
