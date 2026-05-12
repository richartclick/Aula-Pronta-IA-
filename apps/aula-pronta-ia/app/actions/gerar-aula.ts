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
    // não bloqueia a geração se o contador falhar
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

    if (error) { console.error("Erro ao salvar aula:", error); return null; }
    return data.id;
  } catch {
    return null;
  }
}

function instrucaoPorDisciplina(disciplina: string): string {
  const mapa: Record<string, string> = {
    "Inglês": "O campo conteudo_didatico DEVE estar parcialmente em inglês: inclua vocabulário (mínimo 10 palavras EM INGLÊS com tradução em português), frases de exemplo completas em inglês, explicação da estrutura gramatical do tema e um mini-diálogo em inglês com tradução. Ex: 'Hello! My name is Ana. (Olá! Meu nome é Ana.)'",
    "Matemática": "O campo conteudo_didatico DEVE ter: definição clara do conceito matemático, fórmula(s) com notação correta, pelo menos 3 exemplos resolvidos passo a passo com números reais, e uma dica de memorização. Ex: 'Área do triângulo = (base × altura) ÷ 2. Exemplo: base=6cm, altura=4cm → Área = (6×4)÷2 = 12cm²'",
    "Física": "O campo conteudo_didatico DEVE ter: conceito físico explicado, fórmula com símbolos e unidades SI, exemplo de problema resolvido com valores numéricos reais mostrando cada passo, e conexão com o cotidiano.",
    "Química": "O campo conteudo_didatico DEVE ter: conceito químico detalhado, fórmulas moleculares ou equações de reação balanceadas, nomes dos elementos e compostos envolvidos, e exemplos do cotidiano onde este processo ocorre.",
    "Biologia": "O campo conteudo_didatico DEVE ter: terminologia científica correta, descrição detalhada do processo ou estrutura biológica, classificação científica quando aplicável, e dados/curiosidades científicas reais sobre o tema.",
    "Ciências": "O campo conteudo_didatico DEVE ter: explicação científica clara do fenômeno, causas e efeitos comprovados, experimento simples que demonstre o conceito, e exemplos observáveis no cotidiano com dados reais.",
    "Português": "O campo conteudo_didatico DEVE ter: regras gramaticais detalhadas com exemplos reais de frases corretas e incorretas, ou análise literária com trechos reais da obra/gênero trabalhado, incluindo dicas de uso e exceções.",
    "História": "O campo conteudo_didatico DEVE ter: contexto histórico detalhado do período, datas e eventos relevantes em ordem cronológica, personagens históricos reais com seus papéis e motivações, causas e consequências históricas.",
    "Geografia": "O campo conteudo_didatico DEVE ter: dados geográficos reais e atuais (localização, clima, relevo, população, PIB quando relevante), comparações entre regiões/países/biomas, e impactos humanos ou ambientais reais.",
    "Artes": "O campo conteudo_didatico DEVE ter: técnica artística específica com instruções práticas passo a passo, contexto histórico do movimento ou estilo, pelo menos 3 artistas de referência com obras conhecidas e suas características.",
    "Educação Física": "O campo conteudo_didatico DEVE ter: regras oficiais do esporte/modalidade, fundamentos técnicos com descrição dos movimentos corretos, sequência didática de ensino para iniciantes, variações e adaptações para diferentes habilidades.",
  };
  return mapa[disciplina] ?? "O campo conteudo_didatico DEVE ter o conteúdo real, específico e detalhado desta disciplina com exemplos concretos, definições precisas e informações que o aluno vai de fato aprender.";
}

export async function gerarAula(
  _prev: AulaGeradaState,
  formData: FormData
): Promise<AulaGeradaState> {
  const tema = formData.get("tema")?.toString().trim();
  const serie = formData.get("serie")?.toString().trim();
  const duracao = formData.get("duracao")?.toString().trim();
  const disciplina = formData.get("disciplina")?.toString().trim();
  const estilo = formData.get("estilo")?.toString().trim();
  const observacoes = formData.get("observacoes")?.toString().trim();

  if (!tema || !serie || !duracao || !disciplina) {
    return { status: "error", message: "Preencha os campos obrigatórios." };
  }

  const uso = await getUsoMensal();
  if (uso?.bloqueado) {
    return { status: "limit_reached", uso: { aulasNoMes: uso.aulasNoMes, limite: uso.limite } };
  }

  const webhookUrl = process.env.N8N_WEBHOOK_GERAR_AULA;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, serie, duracao, disciplina, estilo, observacoes }),
      });
      if (res.ok) {
        const aula: AulaCompleta = await res.json();
        const meta = { tema, serie, disciplina, duracao };
        const aulaId = await salvarAulaNoBanco(aula, meta);
        await incrementarGeracoes();
        return { status: "success", aula, aulaId: aulaId ?? undefined, meta };
      }
    } catch {
      // fall through to Claude direct
    }
  }

  // Geração real com Claude quando n8n não está configurado
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const prompt = `Você é um pedagogo especialista em ${disciplina} com 20 anos de experiência em sala de aula e domínio profundo da BNCC. Você cria planos de aula que REALMENTE funcionam na prática — com conteúdo real, rico e aplicável. Professores que usam seus planos se destacam.

DADOS DA AULA:
- Tema: ${tema}
- Série/Ano: ${serie}
- Disciplina: ${disciplina}
- Duração: ${duracao}
- Estilo pedagógico: ${estilo || "dinâmico, interativo e significativo"}
${observacoes ? `- Observações do professor: ${observacoes}` : ""}

REGRA FUNDAMENTAL PARA ${disciplina.toUpperCase()} — OBRIGATÓRIO SEGUIR:
${instrucaoPorDisciplina(disciplina)}

PADRÃO DE QUALIDADE EXIGIDO:
- conteudo_didatico: conteúdo científico/técnico REAL desta disciplina — não genérico, com exemplos concretos
- desenvolvimento: 2 etapas bem detalhadas com metodologia ativa
- atividades: 2 atividades (1 individual + 1 em grupo), com enunciados reais
- Códigos BNCC reais e corretos para ${disciplina} no ${serie}
- Verbos da Taxonomia de Bloom adequados à faixa etária
- Seja direto e objetivo — sem encher de palavras desnecessárias

Retorne APENAS JSON válido (sem markdown, sem texto fora do JSON) com esta estrutura exata:
{
  "titulo": "título criativo, específico e atraente para ${disciplina} — ${tema} — ${serie}",
  "bncc": ["(EFXXMAXX) código BNCC real para ${disciplina} no ${serie}", "(EFXXMAXX) segundo código relacionado", "(EFXXMAXX) terceiro código se aplicável"],
  "conteudo_didatico": "CONTEÚDO REAL E RICO — siga a regra fundamental acima. Este é o coração da aula: o conhecimento que o aluno vai construir. Inclua conceitos, definições, exemplos concretos, dados reais, fórmulas, vocabulário específico da disciplina. Mínimo 350 palavras. Escrito como referência completa para o professor.",
  "objetivos": [
    "verbo Bloom (analisar/criar/avaliar) + o que o aluno fará com ${tema} — específico e mensurável",
    "segundo objetivo com verbo diferente — aplicação prática",
    "terceiro objetivo — desenvolvimento de habilidade de comunicação ou colaboração"
  ],
  "pergunta_norteadora": "pergunta filosófica ou científica instigante que conecta ${tema} com a vida real do aluno do ${serie} — deve gerar curiosidade genuína",
  "contextualizacao": "parágrafo rico explicando onde ${tema} aparece no cotidiano deste aluno específico (faixa etária do ${serie}), com exemplos concretos e surpreendentes que criem conexão emocional com o conteúdo",
  "introducao": {
    "duracao": "X minutos",
    "descricao": "estratégia de abertura detalhada: como gerar curiosidade, o que apresentar, como fazer a transição para o conteúdo — com roteiro passo a passo para o professor",
    "dica_professor": "dica experiente e específica: o que evitar, como lidar com resistência, como adaptar se a turma estiver dispersa"
  },
  "desenvolvimento": [
    {
      "etapa": "1. Construção do Conhecimento Base",
      "duracao": "X minutos",
      "descricao": "descrição pedagógica detalhada desta etapa: o que ensinar, como apresentar o conteúdo de ${disciplina}, quais recursos usar, sequência didática passo a passo — referenciar o conteudo_didatico",
      "perguntas_mediacao": ["pergunta de verificação de compreensão sobre ${tema}", "pergunta que conecta ao conhecimento prévio", "pergunta que desafia a pensar mais fundo"],
      "dica_professor": "dica prática para conduzir esta etapa com segurança e engajamento"
    },
    {
      "etapa": "2. Aprofundamento e Prática Guiada",
      "duracao": "X minutos",
      "descricao": "como aprofundar o conteúdo, quais exemplos resolver junto com a turma, como modelar o raciocínio em voz alta, sequência de exercícios progressivos",
      "perguntas_mediacao": ["pergunta de aplicação do conteúdo a situação nova", "pergunta que estimula o raciocínio crítico", "pergunta que conecta com outras disciplinas"],
      "dica_professor": "como identificar e intervir quando alunos travam, como valorizar o erro produtivo"
    },
    {
      "etapa": "3. Produção e Sistematização",
      "duracao": "X minutos",
      "descricao": "como os alunos produzem, criam ou sistematizam o conhecimento de forma autônoma — desafio real que exige usar o que aprenderam sobre ${tema}",
      "perguntas_mediacao": ["pergunta que provoca síntese do aprendizado", "pergunta que conecta ${tema} com o próximo conteúdo", "pergunta de autoavaliação do aprendizado"],
      "dica_professor": "como circular pela sala, o que observar, como fazer mediação sem dar a resposta"
    }
  ],
  "atividades": [
    {
      "titulo": "nome específico da atividade individual",
      "tipo": "individual",
      "duracao": "X minutos",
      "descricao": "enunciado REAL e completo da atividade — escreva os exercícios, questões ou tarefas concretas que o aluno vai realizar sobre ${tema} em ${disciplina}. Inclua o enunciado exato como seria entregue para o aluno.",
      "objetivo_bloom": "nível e verbo da Taxonomia de Bloom — justifique por que este nível é adequado ao ${serie}",
      "diferenciacao": "adaptação concreta para alunos com dificuldade (o que simplificar, qual apoio dar) E desafio extra para alunos avançados (o que acrescentar)"
    },
    {
      "titulo": "nome específico da atividade em grupo",
      "tipo": "grupo",
      "duracao": "X minutos",
      "descricao": "enunciado REAL da atividade colaborativa — o que cada grupo vai fazer, produzir ou investigar sobre ${tema}. Como organizar os grupos, o que entregar ao final. Metodologia ativa aplicada.",
      "objetivo_bloom": "nível da Taxonomia de Bloom — analisar/avaliar/criar",
      "diferenciacao": "como adaptar para grupos com diferentes níveis — o que o grupo mais fraco recebe de apoio e o que o mais avançado recebe de desafio extra"
    }
  ],
  "fechamento": {
    "duracao": "X minutos",
    "descricao": "roteiro de encerramento: como retomar a pergunta norteadora, o que sistematizar no quadro, como fazer os alunos verbalizarem o aprendizado e antecipar o próximo conteúdo",
    "perguntas_reflexao": ["pergunta metacognitiva sobre o processo de aprendizagem", "pergunta que conecta ${tema} com a vida do aluno", "pergunta que lança o desafio para aprofundamento"]
  },
  "avaliacao": {
    "formativa": "estratégias concretas de avaliação durante a aula: quais comportamentos observar, como usar perguntas diagnósticas, como registrar evidências de aprendizagem sem interromper o fluxo",
    "somativa": "proposta detalhada de avaliação formal: tipo de instrumento (prova, trabalho, projeto), critérios de avaliação claros, peso de cada habilidade, exemplo de questão ou rubrica",
    "autoavaliacao": "ferramenta de autoavaliação do aluno — frase para completar, escala de confiança, ou checklist do que dominou sobre ${tema}"
  },
  "materiais": [
    "material específico 1 com instrução de uso",
    "material específico 2",
    "material específico 3",
    "recurso digital gratuito específico para ${disciplina} — ${tema} com instrução de acesso"
  ],
  "adaptacoes": {
    "inclusao": "adaptações específicas e práticas para: alunos com dificuldades de leitura/escrita, TDAH, deficiência visual, deficiência auditiva — o que concretamente mudar na atividade e nos recursos",
    "aceleracao": "3 desafios progressivos para alunos que dominam rapidamente o conteúdo — do mais simples ao mais complexo, conectados ao ${tema}",
    "recursos_digitais": "3 a 5 ferramentas digitais gratuitas específicas para ${disciplina} — ${tema}: nome da ferramenta, como acessar, o que fazer com ela nesta aula"
  },
  "interdisciplinaridade": "conexões ricas e concretas de ${tema} com pelo menos 3 outras disciplinas — o que especificamente se conecta, como o professor pode explorar essa conexão, sugestão de projeto integrado",
  "para_casa": "tarefa investigativa e significativa que o aluno quer fazer — não repetição mecânica do que foi feito em aula, mas aplicação em novo contexto ou produção criativa sobre ${tema}"
}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

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
          max_tokens: 3000,
          system: "Você é um gerador de planos de aula. Responda EXCLUSIVAMENTE com JSON válido — sem texto antes, sem texto depois, sem markdown, sem ```json. Apenas o objeto JSON puro.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const errBody = await res.text().catch(() => "sem detalhes");
        console.error(`Erro Claude API ${res.status}:`, errBody);
        return { status: "error", message: `Erro na API de IA (${res.status}). Tente novamente.` };
      }

      const data = await res.json();
      const rawText: string = data?.content?.[0]?.text ?? "";
      console.log("Resposta IA (primeiros 300 chars):", rawText.slice(0, 300));

      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}") + 1;
      if (jsonStart === -1 || jsonEnd <= jsonStart) {
        console.error("Sem JSON na resposta:", rawText.slice(0, 300));
        return { status: "error", message: "A IA retornou um formato inesperado. Tente novamente." };
      }

      let aula: AulaCompleta;
      try {
        aula = JSON.parse(rawText.slice(jsonStart, jsonEnd));
      } catch (parseErr) {
        console.error("JSON inválido:", rawText.slice(jsonStart, jsonStart + 400));
        return { status: "error", message: "A IA gerou um JSON inválido. Tente novamente." };
      }

      const meta = { tema, serie, disciplina, duracao };
      const aulaId = await salvarAulaNoBanco(aula, meta);
      await incrementarGeracoes();
      return { status: "success", aula, aulaId: aulaId ?? undefined, meta };
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === "AbortError";
      console.error("Erro geral ao chamar Claude:", err instanceof Error ? err.message : err);
      return {
        status: "error",
        message: isTimeout
          ? "A geração demorou mais que o esperado. Tente novamente."
          : "Erro de conexão com a IA. Tente novamente em alguns segundos.",
      };
    }
  }

  // Mock de fallback
  await new Promise((r) => setTimeout(r, 1500));

  const mockMeta = { tema, serie, disciplina, duracao };
  const mockAula: AulaCompleta = {
      titulo: `${tema}: Uma Jornada de Descoberta — ${serie}`,
      bncc: [
        `(EF0${serie.charAt(0)}MA01) Reconhecer e aplicar conceitos de ${tema} em situações do cotidiano`,
        `(EF0${serie.charAt(0)}MA02) Desenvolver raciocínio lógico e pensamento crítico através de ${tema}`,
      ],
      conteudo_didatico: `${tema} é um conteúdo fundamental para o ${serie}. Nesta aula, os alunos vão compreender os principais conceitos relacionados ao tema, explorando suas características, exemplos práticos e relação com o cotidiano.`,
      objetivos: [
        `Analisar os conceitos fundamentais de ${tema}, estabelecendo conexões com situações reais`,
        `Criar soluções para problemas práticos utilizando os conhecimentos de ${tema}`,
        `Avaliar diferentes estratégias de resolução, justificando suas escolhas com argumentos`,
      ],
      pergunta_norteadora: `Como ${tema} está presente na nossa vida sem que percebamos, e o que mudaria se não existisse?`,
      contextualizacao: `O tema "${tema}" está profundamente enraizado no cotidiano dos alunos, mesmo que eles não percebam. Ao conectar o conteúdo com situações reais — como compras no mercado, jogos, redes sociais e desafios do dia a dia — o professor cria pontes entre o conhecimento formal e a experiência vivida. Esta contextualização é essencial para que o aluno veja significado no que aprende e se motive a aprofundar o conhecimento.`,
      introducao: {
        duracao: "10 minutos",
        descricao: `Inicie a aula com uma situação-problema provocadora relacionada a ${tema}. Apresente um cenário do cotidiano que pareça simples, mas que esconda a complexidade do conteúdo. Faça a pergunta norteadora para toda a turma e dê 2 minutos para que os alunos discutam em duplas suas hipóteses iniciais.`,
        dica_professor: `Não revele a resposta ainda! O objetivo é criar tensão cognitiva saudável. Se os alunos ficarem em silêncio, reformule com: "Pensem no que vocês fazem todo dia que envolve isso...". Anote no quadro as hipóteses levantadas para retomar ao final da aula.`,
      },
      desenvolvimento: [
        {
          etapa: "Exploração Conceitual",
          duracao: "15 minutos",
          descricao: `Apresente os conceitos centrais de ${tema} de forma progressiva, do mais simples ao mais complexo. Use exemplos concretos e visuais. Intercale a explicação com perguntas diretas para 2 ou 3 alunos, verificando a compreensão em tempo real. Utilize o quadro para sistematizar as ideias à medida que surgem.`,
          perguntas_mediacao: [
            `O que vocês já sabiam sobre ${tema} antes de hoje?`,
            `Alguém consegue dar um exemplo disso na vida real que seja diferente do que eu apresentei?`,
          ],
          dica_professor: `Se perceber que a turma está perdida, pare e faça um "check de compreensão": peça para um aluno explicar com suas próprias palavras o que entendeu até agora. Isso revela lacunas e permite ajustar o ritmo.`,
        },
        {
          etapa: "Prática Guiada",
          duracao: "15 minutos",
          descricao: `Resolva 2 ou 3 exemplos junto com a turma, pensando em voz alta e mostrando seu raciocínio. Na terceira questão, comece a resolução e peça para os alunos continuarem. Circule pela sala observando o trabalho individual e intervenha pontualmente onde houver dificuldade.`,
          perguntas_mediacao: [
            `Por que escolhemos este caminho e não o outro? Qual seria a consequência se fizéssemos diferente?`,
            `Alguém resolveu de uma forma diferente da minha? Vamos ver se funciona também!`,
          ],
          dica_professor: `Valorize erros produtivos. Quando um aluno errar, diga "Interessante — deixa eu entender seu raciocínio" antes de corrigir. Isso mantém o engajamento e cria cultura de aprendizado seguro.`,
        },
        {
          etapa: "Aprendizagem Colaborativa",
          duracao: "10 minutos",
          descricao: `Organize a turma em grupos de 3 a 4 alunos heterogêneos (misture diferentes níveis). Cada grupo recebe um desafio diferente relacionado a ${tema} para resolver e apresentar em 2 minutos para a turma. O professor medeia as apresentações, complementando e conectando as soluções dos grupos.`,
          perguntas_mediacao: [
            `O grupo de vocês chegou numa solução diferente. Como vocês pensaram para chegar aí?`,
            `Alguém do outro grupo concorda ou discorda? Por quê?`,
          ],
          dica_professor: `Monitore os grupos, mas resista ao impulso de dar a resposta. Faça perguntas que orientem o raciocínio: "O que vocês já sabem que pode ajudar aqui?" e "Se dividissem o problema em partes menores, por onde começariam?"`,
        },
      ],
      atividades: [
        {
          titulo: "Investigação Individual",
          tipo: "individual",
          duracao: "8 minutos",
          descricao: `Cada aluno recebe (ou copia do quadro) uma situação-problema real sobre ${tema}. Deve resolver e JUSTIFICAR por escrito cada passo do raciocínio. A justificativa é obrigatória — não basta a resposta final. Critério de entrega: resolução completa com pelo menos 2 linhas de justificativa.`,
          objetivo_bloom: "Aplicar e Analisar — o aluno usa o conhecimento em contexto novo e explica seu raciocínio",
          diferenciacao: "Para alunos com dificuldade: forneça um roteiro com os primeiros passos. Para os avançados: peça que criem sua própria situação-problema usando o mesmo conceito.",
        },
        {
          titulo: "Desafio em Grupo: Conectando com o Mundo",
          tipo: "grupo",
          duracao: "12 minutos",
          descricao: `Grupos de 4 recebem um caso real (notícia, dado, situação social) que envolve ${tema}. Devem: (1) identificar onde o conceito aparece, (2) analisar o impacto, (3) propor uma solução ou intervenção usando o que aprenderam. Apresentam para a turma em 2 minutos, defendendo suas escolhas.`,
          objetivo_bloom: "Criar e Avaliar — o mais alto nível da Taxonomia de Bloom",
          diferenciacao: "Grupos com mais dificuldade recebem casos mais simples e com perguntas-guia. Grupos avançados recebem casos ambíguos que exigem maior análise crítica.",
        },
      ],
      fechamento: {
        duracao: "5 minutos",
        descricao: `Retome a pergunta norteadora do início e pergunte se a turma mudou de opinião. Compare as hipóteses iniciais (anotadas no quadro) com o que aprenderam. Faça uma síntese coletiva de 3 pontos-chave. Lance o desafio para casa e conecte com o próximo conteúdo.`,
        perguntas_reflexao: [
          "Qual foi a coisa mais surpreendente que você aprendeu hoje?",
          `Como você explicaria ${tema} para alguém da sua família que nunca estudou isso?`,
        ],
      },
      avaliacao: {
        formativa: `Durante a aula: observe a qualidade das hipóteses iniciais, monitore a participação nas discussões em grupo, verifique as justificativas nas atividades individuais. Use sinais visuais (polegar para cima/baixo) para checar compreensão antes de avançar de etapa.`,
        somativa: `Proposta para próxima aula: teste com 5 questões — 2 de reconhecimento, 2 de aplicação e 1 de criação/análise crítica. Rubrica: compreensão conceitual (40%), aplicação prática (40%), justificativa e comunicação (20%).`,
        autoavaliacao: `Pedir para o aluno completar: "Hoje eu aprendi... Ainda tenho dúvida sobre... Na próxima aula quero entender melhor..."`,
      },
      materiais: [
        "Quadro branco e marcadores coloridos (use cores diferentes para destacar conceitos-chave)",
        "Situações-problema impressas ou projetadas (uma por grupo para a atividade colaborativa)",
        "Caderno e caneta para anotações individuais",
        "Timer visível para controle do tempo das etapas (pode ser no celular projetado)",
      ],
      adaptacoes: {
        inclusao: `Para alunos com dificuldades de leitura: use materiais com mais imagens e menos texto. Para TDAH: divida as atividades em etapas menores com checklist. Para alunos de inclusão: adapte o nível de complexidade mantendo os mesmos objetivos conceituais.`,
        aceleracao: `Alunos que terminam rápido: criar variações do problema, pesquisar aplicações avançadas do tema, preparar uma explicação para ensinar um colega (técnica "ensine para aprender").`,
        recursos_digitais: `Khan Academy (exercícios adaptivos gratuitos), Kahoot ou Quizizz (quiz gamificado para revisão), Google Jamboard ou Miro (colaboração visual), YouTube EDU (vídeos curtos de contextualização).`,
      },
      interdisciplinaridade: `${tema} se conecta naturalmente com: Língua Portuguesa (interpretação de enunciados, produção de justificativas escritas), Ciências (aplicações práticas e experimentais), História e Geografia (contexto social e histórico do desenvolvimento do conhecimento). Explore essas conexões para enriquecer a aula.`,
      para_casa: `Missão investigativa: encontre 3 exemplos reais de ${tema} na sua casa, bairro ou rotina. Para cada exemplo: descreva onde encontrou, explique como o conceito aparece e conte para alguém da família o que aprendeu hoje. Registre no caderno para compartilhar na próxima aula.`,
  };

  const mockAulaId = await salvarAulaNoBanco(mockAula, mockMeta);
  await incrementarGeracoes();
  return { status: "success", meta: mockMeta, aula: mockAula, aulaId: mockAulaId ?? undefined };
}
