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
      const prompt = `Você é um especialista em educação brasileira com domínio da BNCC. Crie um plano de aula COMPLETO e DETALHADO para:
- Tema: ${tema}
- Série/Turma: ${serie}
- Disciplina: ${disciplina}
- Duração: ${duracao}
- Estilo: ${estilo || "dinâmico e interativo"}
${observacoes ? `- Observações da professora: ${observacoes}` : ""}

Retorne APENAS um JSON válido (sem markdown, sem explicações) com esta estrutura exata:
{
  "titulo": "título criativo e específico para esta aula",
  "bncc": ["código BNCC real da disciplina/série", "outro código relacionado"],
  "objetivos": ["objetivo 1 com verbo de ação", "objetivo 2", "objetivo 3"],
  "pergunta_norteadora": "pergunta provocadora que conecta o tema com a realidade do aluno",
  "contextualizacao": "parágrafo conectando o tema com o cotidiano dos alunos desta série",
  "introducao": {
    "duracao": "X minutos",
    "descricao": "como iniciar a aula de forma envolvente",
    "dica_professor": "dica prática para a professora"
  },
  "desenvolvimento": [
    {
      "etapa": "nome da etapa",
      "duracao": "X minutos",
      "descricao": "o que fazer nesta etapa",
      "perguntas_mediacao": ["pergunta 1", "pergunta 2"],
      "dica_professor": "dica para esta etapa"
    }
  ],
  "atividades": [
    {
      "titulo": "nome da atividade",
      "tipo": "individual ou grupo",
      "duracao": "X minutos",
      "descricao": "descrição detalhada",
      "objetivo_bloom": "nível da taxonomia de Bloom",
      "diferenciacao": "como adaptar para diferentes níveis"
    }
  ],
  "fechamento": {
    "duracao": "X minutos",
    "descricao": "como encerrar e fixar o aprendizado",
    "perguntas_reflexao": ["pergunta 1", "pergunta 2"]
  },
  "avaliacao": {
    "formativa": "como avaliar durante a aula",
    "somativa": "proposta de avaliação formal",
    "autoavaliacao": "frase para o aluno completar"
  },
  "materiais": ["material 1", "material 2"],
  "adaptacoes": {
    "inclusao": "adaptações para alunos com necessidades especiais",
    "aceleracao": "desafios para alunos avançados",
    "recursos_digitais": "ferramentas digitais gratuitas para enriquecer a aula"
  },
  "interdisciplinaridade": "como conectar com outras disciplinas",
  "para_casa": "tarefa significativa e contextualizada"
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text: string = data.content[0].text;
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const aula: AulaCompleta = JSON.parse(text.slice(jsonStart, jsonEnd));
        const meta = { tema, serie, disciplina, duracao };
        const aulaId = await salvarAulaNoBanco(aula, meta);
        return { status: "success", aula, aulaId: aulaId ?? undefined, meta };
      }
    } catch (err) {
      console.error("Erro ao chamar Claude:", err);
      // fall through to mock
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
  return { status: "success", meta: mockMeta, aula: mockAula, aulaId: mockAulaId ?? undefined };
}
