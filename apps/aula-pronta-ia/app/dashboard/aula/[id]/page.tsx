import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { AulaCompleta } from "@/app/actions/gerar-aula";
import BotaoPDF from "./BotaoPDF";
import BotaoAtividades from "./BotaoAtividades";

type AulaRow = {
  id: string;
  titulo: string;
  serie: string;
  disciplina: string;
  duracao: string;
  tema: string;
  favorita: boolean;
  created_at: string;
  conteudo: AulaCompleta;
};

export default async function AulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("aulas")
    .select("id, titulo, serie, disciplina, duracao, tema, favorita, created_at, conteudo")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!data) notFound();

  const aula = data as AulaRow;
  const conteudo = aula.conteudo;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-7 text-white shadow-lg shadow-blue-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black leading-snug">{aula.titulo}</h1>
            <p className="text-blue-100 text-sm mt-2">{aula.disciplina} • {aula.serie} • {aula.duracao}</p>
            {conteudo.pergunta_norteadora && (
              <p className="text-blue-200 text-sm italic mt-3">💡 {conteudo.pergunta_norteadora}</p>
            )}
          </div>
          <Link href="/dashboard/minhas-aulas" className="text-blue-200 hover:text-white text-sm font-bold shrink-0">← Voltar</Link>
        </div>
      </div>

      {/* Objetivos */}
      <Section icon="🎯" title="Objetivos de aprendizagem" cor="blue">
        <ul className="space-y-3">
          {conteudo.objetivos.map((obj, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="text-blue-500 font-bold mt-0.5 shrink-0">✓</span> {obj}
            </li>
          ))}
        </ul>
      </Section>

      {/* Introdução */}
      <Section icon="📖" title={`Introdução (${conteudo.introducao.duracao})`} cor="purple">
        <p className="text-slate-700 text-sm leading-relaxed">{conteudo.introducao.descricao}</p>
        {conteudo.introducao.dica_professor && (
          <p className="mt-4 text-xs text-amber-700 bg-amber-50 rounded-xl px-4 py-3">💡 {conteudo.introducao.dica_professor}</p>
        )}
      </Section>

      {/* Desenvolvimento */}
      <Section icon="📋" title="Desenvolvimento" cor="indigo">
        <div className="space-y-5">
          {conteudo.desenvolvimento.map((step, i) => (
            <div key={i} className="border-l-4 border-indigo-300 pl-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-indigo-700">{i + 1}. {step.etapa}</span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{step.duracao}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{step.descricao}</p>
              {step.perguntas_mediacao.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-indigo-600 mb-2">Perguntas de mediação:</p>
                  {step.perguntas_mediacao.map((p, j) => (
                    <p key={j} className="text-xs text-slate-500 italic mb-1">› {p}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Atividades da aula */}
      <Section icon="🎮" title="Atividades da aula" cor="orange">
        <div className="space-y-4">
          {conteudo.atividades.map((at, i) => (
            <div key={i} className="bg-orange-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm font-bold text-slate-900">{at.titulo}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${at.tipo === "grupo" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                  {at.tipo === "grupo" ? "👥 Grupo" : "👤 Individual"}
                </span>
                <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full border">⏱ {at.duracao}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{at.descricao}</p>
              {at.diferenciacao && (
                <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">🔀 {at.diferenciacao}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Fechamento */}
      <Section icon="🏁" title={`Fechamento (${conteudo.fechamento.duracao})`} cor="emerald">
        <p className="text-slate-700 text-sm leading-relaxed">{conteudo.fechamento.descricao}</p>
        {conteudo.fechamento.perguntas_reflexao.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-emerald-700 mb-2">Perguntas de reflexão:</p>
            {conteudo.fechamento.perguntas_reflexao.map((p, i) => (
              <p key={i} className="text-xs text-slate-600 italic mb-1">› {p}</p>
            ))}
          </div>
        )}
      </Section>

      {/* Avaliação */}
      <Section icon="📝" title="Avaliação" cor="blue">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-blue-700 mb-2">Formativa</p>
            <p className="text-slate-700 text-sm leading-relaxed">{conteudo.avaliacao.formativa}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-700 mb-2">Somativa</p>
            <p className="text-slate-700 text-sm leading-relaxed">{conteudo.avaliacao.somativa}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-600 mb-2">Autoavaliação</p>
            <p className="text-slate-600 text-sm italic leading-relaxed">{conteudo.avaliacao.autoavaliacao}</p>
          </div>
        </div>
      </Section>

      {/* Materiais */}
      <Section icon="📦" title="Materiais necessários" cor="slate">
        <ul className="grid sm:grid-cols-2 gap-3">
          {conteudo.materiais.map((m, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-slate-400">•</span> {m}
            </li>
          ))}
        </ul>
      </Section>

      {conteudo.para_casa && (
        <Section icon="🏠" title="Para casa" cor="slate">
          <p className="text-slate-700 text-sm leading-relaxed">{conteudo.para_casa}</p>
        </Section>
      )}

      {/* Ações — PDF da aula + nova aula */}
      <div className="flex flex-col sm:flex-row gap-3">
        <BotaoPDF aula={conteudo} meta={{ tema: aula.tema ?? conteudo.titulo, serie: aula.serie, disciplina: aula.disciplina, duracao: aula.duracao }} />
        <Link
          href="/dashboard/gerar"
          className="flex-1 bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-colors text-center flex items-center justify-center"
        >
          ⚡ Gerar outra aula
        </Link>
      </div>

      {/* Divisor */}
      <div className="border-t-2 border-dashed border-slate-200 pt-2">
        <p className="text-xs text-slate-400 text-center mb-4">Atividades para os alunos</p>
        <BotaoAtividades
          aulaId={aula.id}
          tema={aula.tema ?? conteudo.titulo}
          serie={aula.serie}
          disciplina={aula.disciplina}
          conteudo={conteudo}
        />
      </div>
    </div>
  );
}

function Section({ icon, title, cor, children }: { icon: string; title: string; cor: string; children: React.ReactNode }) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100", purple: "bg-purple-50 border-purple-100",
    indigo: "bg-indigo-50 border-indigo-100", orange: "bg-orange-50 border-orange-100",
    emerald: "bg-emerald-50 border-emerald-100", slate: "bg-slate-50 border-slate-200",
  };
  const title_color: Record<string, string> = {
    blue: "text-blue-700", purple: "text-purple-700", indigo: "text-indigo-700",
    orange: "text-orange-700", emerald: "text-emerald-700", slate: "text-slate-700",
  };
  return (
    <div className={`rounded-2xl border p-7 ${bg[cor] ?? "bg-white border-slate-100"}`}>
      <h3 className={`font-black text-base mb-5 flex items-center gap-2 ${title_color[cor] ?? "text-slate-900"}`}>
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
