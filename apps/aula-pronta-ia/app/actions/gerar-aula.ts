"use server";

import { createClient } from "@/lib/supabase/server";
import { getUsoMensal } from "@/lib/uso";

export type EtapaDesenvolvimento = {
  etapa: string;
  duracao: string;
  descricao: string;
  perguntas_mediacao: string[];
  dica_professor: string;
};

export type Atividade = {
  titulo: string;
  tipo: "individual" | "grupo";
  duracao: string;
  descricao: string;
  objetivo_bloom: string;
  diferenciacao: string;
};

export type AulaCompleta = {
  titulo: string;
  bncc: string[];
  conteudo_didatico: string;
  objetivos: string[];
  pergunta_norteadora: string;
  contextualizacao: string;
  introducao: { duracao: string; descricao: string; dica_professor: string };
  desenvolvimento: EtapaDesenvolvimento[];
  atividades: Atividade[];
  fechamento: { duracao: string; descricao: string; perguntas_reflexao: string[] };
  avaliacao: { formativa: string; somativa: string; autoavaliacao: string };
  materiais: string[];
  adaptacoes: { inclusao: string; aceleracao: string; recursos_digitais: string };
  interdisciplinaridade: string;
  para_casa: string;
};

export type AulaGeradaState = {
  status: "idle" | "success" | "error" | "limit_reached";
  aula?: AulaCompleta;
  aulaId?: string;
  meta?: { tema: string; serie: string; disciplina: string; duracao: string };
  message?: string;
  uso?: { aulasNoMes: number; limite: number };
};

// ─── Extração segura de JSON com contagem de chaves balanceadas ───────────────
// Corrige o bug de lastIndexOf("}") que encontrava chaves internas incorretas.
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
  return null; // JSON truncado — objeto raiz nunca fechou
}

// ─── Nível educacional a partir da série ─────────────────────────────────────
function nivelEducacional(serie: string): "infantil" | "fund1" | "fund2" | "medio" {
  if (serie === "Educação Infantil") return "infantil";
  if (serie.includes("EM")) return "medio";
  const ano = parseInt(serie);
  if (!isNaN(ano)) return ano <= 5 ? "fund1" : "fund2";
  return "fund1";
}

function instrucoesPorNivel(nivel: ReturnType<typeof nivelEducacional>, serie: string): string {
  const map: Record<string, string> = {
    infantil: `NÍVEL EDUCAÇÃO INFANTIL (4-6 anos): linguagem MUITO simples, atividades lúdicas e de movimento, SEM leitura ou escrita formal, foco em exploração sensorial e brincadeiras dirigidas. Objetivos com 1 linha apenas. Códigos BNCC no formato (EI03XX0X) — nunca use formato EF.`,
    fund1: `NÍVEL FUNDAMENTAL I (${serie}): linguagem acessível, exemplos do cotidiano da criança, misture atividades escritas simples com práticas concretas.`,
    fund2: `NÍVEL FUNDAMENTAL II (${serie}): linguagem mais formal, aprofundamento conceitual, atividades que exigem argumentação e pensamento crítico.`,
    medio: `NÍVEL ENSINO MÉDIO (${serie}): linguagem técnica e precisa, conecte com ENEM/vestibular, aprofundamento avançado, interdisciplinaridade obrigatória.`,
  };
  return map[nivel];
}

// ─── Instrução específica por disciplina ─────────────────────────────────────
function instrucaoPorDisciplina(disciplina: string): string {
  const mapa: Record<string, string> = {
    // Disciplinas do Fundamental / Médio
    "Inglês": "conteudo_didatico DEVE ter: min 8 palavras em inglês com tradução, 2 frases de exemplo em inglês e mini-diálogo.",
    "Matemática": "conteudo_didatico DEVE ter: definição do conceito, fórmula com notação correta e 2 exemplos resolvidos passo a passo.",
    "Física": "conteudo_didatico DEVE ter: conceito físico, fórmula com unidades SI e 1 exemplo resolvido com valores reais.",
    "Química": "conteudo_didatico DEVE ter: conceito, fórmulas moleculares ou equação balanceada e exemplo do cotidiano.",
    "Biologia": "conteudo_didatico DEVE ter: terminologia científica correta, descrição do processo/estrutura e dado científico real.",
    "Ciências": "conteudo_didatico DEVE ter: explicação do fenômeno, causas/efeitos e experimento simples possível em sala.",
    "Português": "conteudo_didatico DEVE ter: regras gramaticais com exemplos corretos/incorretos OU análise literária com trecho real.",
    "História": "conteudo_didatico DEVE ter: contexto histórico, datas/eventos relevantes e personagens reais com seus papéis.",
    "Geografia": "conteudo_didatico DEVE ter: dados geográficos reais e atuais, comparações entre regiões e impactos humanos/ambientais.",
    "Artes": "conteudo_didatico DEVE ter: técnica artística com instruções práticas, 2 artistas de referência e contexto histórico.",
    "Educação Física": "conteudo_didatico DEVE ter: regras oficiais, fundamentos técnicos com descrição dos movimentos e sequência didática.",
    // Campos de Experiência BNCC — Educação Infantil
    "O eu, o outro e o nós": "conteudo_didatico DEVE ter: situação real do cotidiano com conflito social simples, emoção nomeada (alegria, tristeza, raiva) e regra de convivência clara. Linguagem para crianças de 4-6 anos. BNCC: códigos no formato EI03EO0X.",
    "Corpo, gestos e movimentos": "conteudo_didatico DEVE ter: sequência de movimentos corporais descrita passo a passo (ex: pular, rolar, equilibrar, dançar), sugestão de música ou ritmo e adaptação para o espaço da sala de aula. BNCC: códigos no formato EI03CG0X.",
    "Traços, sons, cores e formas": "conteudo_didatico DEVE ter: técnica artística com material concreto acessível (tinta, argila, colagem, papel), referência a um artista ou obra brasileira e instrução passo a passo para conduzir com crianças pequenas. BNCC: códigos no formato EI03TS0X.",
    "Escuta, fala, pensamento e imaginação": "conteudo_didatico DEVE ter: história curta OU música com repetição e rima, 3 palavras novas com descrição do que representam e atividade 100% oral (SEM escrita). Foco em oralidade, narrativa e vocabulário. BNCC: códigos no formato EI03EF0X.",
    "Espaços, tempos, quantidades, relações e transformações": "conteudo_didatico DEVE ter: conceito matemático ou científico explorado com material concreto (blocos, sementes, água, argila), sequência de exploração sensorial e pergunta investigativa para crianças descobrirem por si mesmas. BNCC: códigos no formato EI03ET0X.",
  };
  return mapa[disciplina] ?? "conteudo_didatico DEVE ter conteúdo específico e real desta disciplina com exemplos concretos.";
}

// ─── Helpers de banco de dados ────────────────────────────────────────────────
async function incrementarGeracoes(): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: perfil } = await supabase
      .from("profiles")
      .select("geracoes_este_mes, geracoes_reset_em")
      .eq("id", user.id)
      .single();

    const agora = new Date();
    const resetEm = perfil?.geracoes_reset_em ? new Date(perfil.geracoes_reset_em) : null;
    const mesAtual = agora.getFullYear() * 12 + agora.getMonth();
    const mesReset = resetEm ? resetEm.getFullYear() * 12 + resetEm.getMonth() : -1;
    const novoValor = mesReset === mesAtual ? (perfil?.geracoes_este_mes ?? 0) + 1 : 1;

    await supabase
      .from("profiles")
      .update({ geracoes_este_mes: novoValor, geracoes_reset_em: agora.toISOString() })
      .eq("id", user.id);
  } catch {
    // não bloqueia a geração
  }
}

async function salvarAulaNoBanco(
  aula: AulaCompleta,
  meta: { tema: string; serie: string; disciplina: string; duracao: string }
): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("aulas")
      .insert({
        user_id: user.id,
        titulo: aula.titulo,
        tema: meta.tema,
        serie: meta.serie,
        disciplina: meta.disciplina,
        duracao: meta.duracao,
        conteudo: aula,
      })
      .select("id")
      .single();

    if (error) { console.error("[AULA] Erro ao salvar:", error.message); return null; }
    return data.id;
  } catch {
    return null;
  }
}

// ─── Action principal ─────────────────────────────────────────────────────────
export async function gerarAula(
  _prev: AulaGeradaState,
  formData: FormData
): Promise<AulaGeradaState> {
  const inicio = Date.now();

  const tema = formData.get("tema")?.toString().trim();
  const serie = formData.get("serie")?.toString().trim();
  const duracao = formData.get("duracao")?.toString().trim();
  const disciplina = formData.get("disciplina")?.toString().trim();
  const estilo = formData.get("estilo")?.toString().trim();
  const observacoes = formData.get("observacoes")?.toString().trim();

  if (!tema || !serie || !duracao || !disciplina) {
    return { status: "error", message: "Preencha os campos obrigatórios." };
  }

  console.log(`[AULA] Iniciando geração — tema="${tema}" serie="${serie}" disciplina="${disciplina}" duracao="${duracao}"`);

  const uso = await getUsoMensal();
  if (uso?.bloqueado) {
    return { status: "limit_reached", uso: { aulasNoMes: uso.aulasNoMes, limite: uso.limite } };
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    console.warn("[AULA] ANTHROPIC_API_KEY não configurada — usando mock");
    return gerarMock(tema, serie, disciplina, duracao);
  }

  const nivel = nivelEducacional(serie);
  const instrucaoNivel = instrucoesPorNivel(nivel, serie);
  const instrucaoDisciplina = instrucaoPorDisciplina(disciplina);

  const prompt = `Crie um plano de aula para professor brasileiro. Responda APENAS com JSON puro, sem markdown.

DADOS:
- Tema: ${tema}
- Série: ${serie}
- Disciplina: ${disciplina}
- Duração: ${duracao}
- Estilo pedagógico: ${estilo || "dinâmico e interativo"}
${observacoes ? `- Observações: ${observacoes}` : ""}

${instrucaoNivel}

REGRA DA DISCIPLINA — ${disciplina.toUpperCase()}:
${instrucaoDisciplina}

LIMITES OBRIGATÓRIOS DE TAMANHO (respeite para caber no tempo de geração):
- conteudo_didatico: máximo 150 palavras — seja denso e específico
- introducao.descricao: máximo 50 palavras
- Cada desenvolvimento[].descricao: máximo 60 palavras
- Cada atividade[].descricao: máximo 70 palavras
- fechamento.descricao: máximo 40 palavras
- Cada campo de avaliacao: máximo 40 palavras
- adaptacoes.*: máximo 30 palavras cada
- interdisciplinaridade, para_casa, contextualizacao: máximo 40 palavras cada

JSON EXATO (preencha todos os campos):
{
  "titulo": "título criativo e específico — ${disciplina}, ${tema}, ${serie}",
  "bncc": ["código BNCC real 1 para ${disciplina} no ${serie}", "código BNCC real 2"],
  "conteudo_didatico": "conteúdo real — siga a regra da disciplina acima",
  "objetivos": [
    "verbo Bloom + aprendizagem específica 1",
    "verbo Bloom + aprendizagem específica 2",
    "verbo Bloom + habilidade prática 3"
  ],
  "pergunta_norteadora": "pergunta instigante conectando ${tema} à vida real do aluno",
  "contextualizacao": "onde ${tema} aparece no cotidiano — 2 exemplos concretos",
  "introducao": {
    "duracao": "X min",
    "descricao": "como iniciar e gerar curiosidade",
    "dica_professor": "dica prática de engajamento"
  },
  "desenvolvimento": [
    {
      "etapa": "1. Construção do conhecimento",
      "duracao": "X min",
      "descricao": "sequência para apresentar ${tema}",
      "perguntas_mediacao": ["pergunta de verificação", "pergunta de conexão"],
      "dica_professor": "dica para conduzir esta etapa"
    },
    {
      "etapa": "2. Prática e aprofundamento",
      "duracao": "X min",
      "descricao": "como os alunos praticam ${tema}",
      "perguntas_mediacao": ["pergunta de aplicação", "pergunta de análise"],
      "dica_professor": "dica para lidar com dificuldades"
    }
  ],
  "atividades": [
    {
      "titulo": "nome da atividade individual",
      "tipo": "individual",
      "duracao": "X min",
      "descricao": "enunciado real e completo do que o aluno fará",
      "objetivo_bloom": "nível Bloom aplicado",
      "diferenciacao": "apoio para dificuldade / desafio para avançados"
    },
    {
      "titulo": "nome da atividade em grupo",
      "tipo": "grupo",
      "duracao": "X min",
      "descricao": "enunciado real do que os grupos farão ou produzirão",
      "objetivo_bloom": "nível Bloom — analisar/criar/avaliar",
      "diferenciacao": "suporte para dificuldade / desafio extra"
    }
  ],
  "fechamento": {
    "duracao": "X min",
    "descricao": "como encerrar e sistematizar o aprendizado",
    "perguntas_reflexao": ["pergunta metacognitiva", "pergunta de conexão à vida"]
  },
  "avaliacao": {
    "formativa": "como avaliar durante a aula",
    "somativa": "proposta de avaliação formal",
    "autoavaliacao": "frase ou checklist de autoavaliação do aluno"
  },
  "materiais": ["material 1", "material 2", "ferramenta digital gratuita"],
  "adaptacoes": {
    "inclusao": "adaptações para inclusão e dificuldades",
    "aceleracao": "desafios para alunos avançados",
    "recursos_digitais": "2 ferramentas digitais gratuitas com instruções"
  },
  "interdisciplinaridade": "conexões com outras 2 disciplinas",
  "para_casa": "tarefa significativa aplicando ${tema}"
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    console.log("[AULA] Chamando Claude API...");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        system: "Você é um gerador de planos de aula para professores brasileiros. Responda EXCLUSIVAMENTE com JSON puro — sem markdown, sem texto antes ou depois, sem ```json. Apenas o objeto JSON.",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    clearTimeout(timeoutId);

    const tempoAPI = Date.now() - inicio;
    console.log(`[AULA] Claude respondeu em ${tempoAPI}ms — status ${res.status}`);

    if (!res.ok) {
      const errBody = await res.text().catch(() => "sem detalhes");
      console.error(`[AULA] Erro Claude API ${res.status}:`, errBody);
      return { status: "error", message: `Erro na IA (${res.status}). Verifique a chave API na Vercel e tente novamente.` };
    }

    const data = await res.json();
    const rawText: string = data?.content?.[0]?.text ?? "";

    console.log(`[AULA] Resposta IA (${rawText.length} chars): ${rawText.slice(0, 200)}`);

    // Extração segura com contagem de chaves balanceadas
    const jsonStr = extrairJSON(rawText);

    if (!jsonStr) {
      const usageTokens = data?.usage?.output_tokens ?? "?";
      console.error(`[AULA] JSON truncado — output_tokens=${usageTokens}. Início da resposta: ${rawText.slice(0, 300)}`);
      return {
        status: "error",
        message: "A IA não conseguiu gerar o plano completo desta vez. Tente novamente — normalmente funciona na segunda tentativa.",
      };
    }

    let aula: AulaCompleta;
    try {
      aula = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("[AULA] JSON inválido após extração:", jsonStr.slice(0, 400));
      return { status: "error", message: "A IA retornou um formato inesperado. Tente novamente." };
    }

    const meta = { tema, serie, disciplina, duracao };
    const aulaId = await salvarAulaNoBanco(aula, meta);
    await incrementarGeracoes();

    const tempoTotal = Date.now() - inicio;
    console.log(`[AULA] Sucesso! Aula gerada em ${tempoTotal}ms — id=${aulaId}`);

    return { status: "success", aula, aulaId: aulaId ?? undefined, meta };

  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    const tempoTotal = Date.now() - inicio;
    console.error(`[AULA] Erro após ${tempoTotal}ms:`, err instanceof Error ? err.message : err);

    return {
      status: "error",
      message: isTimeout
        ? "A geração ultrapassou o tempo limite. Tente novamente ou use um tema mais curto."
        : "Erro de conexão com a IA. Aguarde alguns segundos e tente novamente.",
    };
  }
}

// ─── Mock de fallback (quando não há chave API configurada) ───────────────────
async function gerarMock(
  tema: string,
  serie: string,
  disciplina: string,
  duracao: string
): Promise<AulaGeradaState> {
  await new Promise((r) => setTimeout(r, 800));

  const mockMeta = { tema, serie, disciplina, duracao };
  const mockAula: AulaCompleta = {
    titulo: `${tema} — ${disciplina} para o ${serie}`,
    bncc: [
      `(EF${serie.charAt(0)}${serie.charAt(1) === "º" ? "0" : ""}${disciplina.substring(0, 2).toUpperCase()}01) Reconhecer e aplicar conceitos de ${tema}`,
      `(EF${serie.charAt(0)}${serie.charAt(1) === "º" ? "0" : ""}${disciplina.substring(0, 2).toUpperCase()}02) Desenvolver habilidades relacionadas a ${tema}`,
    ],
    conteudo_didatico: `${tema} é um tema central em ${disciplina} para o ${serie}. Configure sua chave ANTHROPIC_API_KEY na Vercel para ativar a geração real com IA e obter conteúdo específico, rico e alinhado à BNCC.`,
    objetivos: [
      `Identificar os conceitos fundamentais de ${tema}`,
      `Aplicar o conhecimento de ${tema} em situações práticas`,
      `Analisar e relacionar ${tema} com o cotidiano`,
    ],
    pergunta_norteadora: `Como ${tema} está presente na nossa vida sem que percebamos?`,
    contextualizacao: `O tema "${tema}" conecta-se ao cotidiano dos alunos do ${serie} de formas surpreendentes que o professor pode explorar para criar engajamento genuíno.`,
    introducao: {
      duracao: "10 min",
      descricao: `Inicie com uma situação-problema relacionada a ${tema}. Lance a pergunta norteadora e registre as hipóteses dos alunos no quadro.`,
      dica_professor: `Não corrija os erros iniciais — anote tudo. Você vai retomar ao final mostrando a evolução do pensamento.`,
    },
    desenvolvimento: [
      {
        etapa: "1. Exploração Conceitual",
        duracao: "15 min",
        descricao: `Apresente os conceitos centrais de ${tema} com exemplos progressivos. Intercale com perguntas para verificar compreensão.`,
        perguntas_mediacao: [`O que vocês já sabiam sobre ${tema}?`, `Alguém consegue dar um exemplo diferente?`],
        dica_professor: `Se a turma travar, peça a um aluno para explicar o que entendeu até agora com suas próprias palavras.`,
      },
      {
        etapa: "2. Prática Guiada",
        duracao: "15 min",
        descricao: `Resolva exemplos junto com a turma. Na última questão, comece e peça aos alunos que continuem. Circule pela sala.`,
        perguntas_mediacao: [`Por que escolhemos este caminho?`, `Alguém resolveu de forma diferente?`],
        dica_professor: `Valorize erros produtivos — eles revelam o raciocínio e criam oportunidades de aprendizado coletivo.`,
      },
    ],
    atividades: [
      {
        titulo: "Investigação Individual",
        tipo: "individual",
        duracao: "8 min",
        descricao: `Resolva uma situação-problema real sobre ${tema} e justifique cada passo do raciocínio por escrito.`,
        objetivo_bloom: "Aplicar e Analisar",
        diferenciacao: "Dificuldade: roteiro com primeiros passos. Avançados: crie sua própria situação-problema.",
      },
      {
        titulo: "Desafio em Grupo",
        tipo: "grupo",
        duracao: "12 min",
        descricao: `Grupos analisam um caso real envolvendo ${tema}, identificam o conceito, analisam o impacto e propõem solução.`,
        objetivo_bloom: "Criar e Avaliar",
        diferenciacao: "Grupos com dificuldade: casos mais simples com perguntas-guia. Avançados: casos ambíguos.",
      },
    ],
    fechamento: {
      duracao: "5 min",
      descricao: `Retome a pergunta norteadora. Compare hipóteses iniciais com o aprendido. Faça síntese dos 3 pontos-chave.`,
      perguntas_reflexao: [
        "O que foi mais surpreendente hoje?",
        `Como você explicaria ${tema} para sua família?`,
      ],
    },
    avaliacao: {
      formativa: `Observe participação, qualidade das hipóteses e justificativas escritas nas atividades.`,
      somativa: `Teste com 5 questões: 2 de reconhecimento, 2 de aplicação, 1 de análise crítica.`,
      autoavaliacao: `"Hoje aprendi... Ainda tenho dúvida sobre... Quero entender melhor..."`,
    },
    materiais: [
      "Quadro branco e marcadores coloridos",
      "Caderno e caneta para anotações",
      "Kahoot ou Quizizz para revisão gamificada",
    ],
    adaptacoes: {
      inclusao: `Materiais com imagens para dificuldades de leitura; checklist para TDAH; nível simplificado para inclusão.`,
      aceleracao: `Criar variações do problema, pesquisar aplicações avançadas, preparar explicação para ensinar um colega.`,
      recursos_digitais: `Khan Academy (exercícios adaptativos) e Canva Edu (produção visual) — ambos gratuitos.`,
    },
    interdisciplinaridade: `${tema} conecta-se com Língua Portuguesa (argumentação) e com pelo menos mais uma disciplina que o professor pode explorar.`,
    para_casa: `Encontre 3 exemplos reais de ${tema} no seu cotidiano e registre no caderno para compartilhar na próxima aula.`,
  };

  const mockAulaId = await salvarAulaNoBanco(mockAula, mockMeta);
  await incrementarGeracoes();
  return { status: "success", meta: mockMeta, aula: mockAula, aulaId: mockAulaId ?? undefined };
}
