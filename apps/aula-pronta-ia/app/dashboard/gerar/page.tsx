"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { gerarAula, type AulaGeradaState } from "@/app/actions/gerar-aula";

const initialState: AulaGeradaState = { status: "idle" };

const series = [
  "Educação Infantil", "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano",
  "6º Ano", "7º Ano", "8º Ano", "9º Ano",
  "1º Ano EM", "2º Ano EM", "3º Ano EM",
];

const disciplinas = [
  "Matemática", "Português", "Ciências", "História", "Geografia",
  "Educação Física", "Artes", "Inglês", "Biologia", "Física", "Química",
];

const duracoes = ["30 min", "45 min", "50 min", "1h", "1h30", "2h"];

const estilos = [
  { value: "dinamico", label: "Dinâmico e interativo", icon: "⚡" },
  { value: "expositivo", label: "Expositivo e organizado", icon: "📋" },
  { value: "ludico", label: "Lúdico e criativo", icon: "🎨" },
  { value: "pratico", label: "Prático com experimentos", icon: "🔬" },
];

export default function GerarAulaPage() {
  const [state, action, isPending] = useActionState(gerarAula, initialState);
  const [estiloSel, setEstiloSel] = useState("dinamico");

  if (state.status === "success" && state.aula) {
    return <AulaResultado aula={state.aula} meta={state.meta!} onNova={() => window.location.reload()} />;
  }

  if (state.status === "limit_reached") {
    return <BloqueioUpgrade aulasNoMes={state.uso?.aulasNoMes ?? 5} limite={state.uso?.limite ?? 5} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">⚡ Gerar nova aula</h1>
        <p className="text-slate-500 text-sm mt-1">
          Preencha as informações e a IA cria sua aula completa em segundos.
        </p>
      </div>

      <form action={action} className="space-y-5">
        <input type="hidden" name="estilo" value={estiloSel} />

        {/* Tema */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <label className="block font-bold text-slate-900 mb-2">
            Tema da aula <span className="text-red-500">*</span>
          </label>
          <input
            name="tema"
            type="text"
            required
            placeholder="Ex: Frações e números decimais, Sistema Solar, Revolução Industrial..."
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>

        {/* Série + Disciplina + Duração */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Detalhes da turma</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-2">
                Série / Turma <span className="text-red-500">*</span>
              </label>
              <select
                name="serie"
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {series.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-2">
                Disciplina <span className="text-red-500">*</span>
              </label>
              <select
                name="disciplina"
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {disciplinas.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-2">
                Duração <span className="text-red-500">*</span>
              </label>
              <select
                name="duracao"
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {duracoes.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Estilo */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Estilo da aula</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {estilos.map((e) => (
              <button
                key={e.value}
                type="button"
                onClick={() => setEstiloSel(e.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  estiloSel === e.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="text-2xl">{e.icon}</span>
                <span className="text-xs font-semibold text-center leading-tight">{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <label className="block font-bold text-slate-900 mb-2">
            Observações extras <span className="text-slate-400 font-normal text-sm">(opcional)</span>
          </label>
          <textarea
            name="observacoes"
            rows={3}
            placeholder="Ex: turma agitada, alunos com dificuldade em leitura, preparar para prova, incluir atividade ao ar livre..."
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
          />
        </div>

        {state.status === "error" && (
          <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-lg transition-all shadow-lg shadow-blue-200"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando sua aula...
            </span>
          ) : (
            "⚡ Gerar aula agora"
          )}
        </button>

        <p className="text-center text-slate-400 text-xs">
          A IA leva cerca de 5 a 10 segundos para criar sua aula completa.
        </p>
      </form>
    </div>
  );
}

function AulaResultado({
  aula,
  meta,
  onNova,
}: {
  aula: NonNullable<AulaGeradaState["aula"]>;
  meta: NonNullable<AulaGeradaState["meta"]>;
  onNova: () => void;
}) {
  const [baixando, setBaixando] = useState(false);

  async function handleBaixarPDF() {
    setBaixando(true);
    try {
      const res = await fetch("/api/aula-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aula, meta }),
      });
      if (!res.ok) throw new Error("Falha ao gerar PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aula-${meta.tema.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20 lg:pb-0">
      {/* Success header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎉</span>
          <div>
            <h1 className="text-xl font-black">Aula gerada com sucesso!</h1>
            <p className="text-emerald-100 text-sm">{aula.titulo} • {meta.serie} • {meta.duracao}</p>
          </div>
        </div>
        {aula.pergunta_norteadora && (
          <p className="text-emerald-100 text-sm italic mt-2">💡 {aula.pergunta_norteadora}</p>
        )}
      </div>

      {/* Objetivos */}
      <Section icon="🎯" title="Objetivos de aprendizagem" color="blue">
        <ul className="space-y-2">
          {aula.objetivos.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-blue-500 font-bold mt-0.5">✓</span> {obj}
            </li>
          ))}
        </ul>
      </Section>

      {/* Introdução */}
      <Section icon="📖" title={`Introdução (${aula.introducao.duracao})`} color="purple">
        <p className="text-slate-700 text-sm leading-relaxed">{aula.introducao.descricao}</p>
        {aula.introducao.dica_professor && (
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
            💡 {aula.introducao.dica_professor}
          </p>
        )}
      </Section>

      {/* Desenvolvimento */}
      <Section icon="📋" title="Desenvolvimento" color="indigo">
        <div className="space-y-4">
          {aula.desenvolvimento.map((step, i) => (
            <div key={i} className="border-l-4 border-indigo-300 pl-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-indigo-700">{i + 1}. {step.etapa}</span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{step.duracao}</span>
              </div>
              <p className="text-slate-600 text-sm">{step.descricao}</p>
              {step.perguntas_mediacao.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-indigo-600 mb-1">Perguntas de mediação:</p>
                  {step.perguntas_mediacao.map((p, j) => (
                    <p key={j} className="text-xs text-slate-500 italic">› {p}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Atividades */}
      <Section icon="🎮" title="Atividades" color="orange">
        <div className="space-y-3">
          {aula.atividades.map((at, i) => (
            <div key={i} className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-900">{at.titulo}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${at.tipo === "grupo" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                  {at.tipo === "grupo" ? "👥 Grupo" : "👤 Individual"}
                </span>
                <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full border">⏱ {at.duracao}</span>
              </div>
              <p className="text-slate-600 text-sm">{at.descricao}</p>
              {at.diferenciacao && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1">🔀 {at.diferenciacao}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Fechamento */}
      <Section icon="🏁" title={`Fechamento (${aula.fechamento.duracao})`} color="emerald">
        <p className="text-slate-700 text-sm leading-relaxed">{aula.fechamento.descricao}</p>
        {aula.fechamento.perguntas_reflexao.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-emerald-700 mb-1">Perguntas de reflexão:</p>
            {aula.fechamento.perguntas_reflexao.map((p, i) => (
              <p key={i} className="text-xs text-slate-600 italic">› {p}</p>
            ))}
          </div>
        )}
      </Section>

      {/* Avaliação */}
      <Section icon="📝" title="Avaliação" color="blue">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-blue-700 mb-1">Formativa</p>
            <p className="text-slate-700 text-sm leading-relaxed">{aula.avaliacao.formativa}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-700 mb-1">Somativa</p>
            <p className="text-slate-700 text-sm leading-relaxed">{aula.avaliacao.somativa}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-600 mb-1">Autoavaliação do aluno</p>
            <p className="text-slate-600 text-sm italic">{aula.avaliacao.autoavaliacao}</p>
          </div>
        </div>
      </Section>

      {/* Materiais */}
      <Section icon="📦" title="Materiais necessários" color="slate">
        <ul className="grid sm:grid-cols-2 gap-2">
          {aula.materiais.map((m, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-slate-400">•</span> {m}
            </li>
          ))}
        </ul>
      </Section>

      {/* Para casa */}
      {aula.para_casa && (
        <Section icon="🏠" title="Para casa" color="slate">
          <p className="text-slate-700 text-sm leading-relaxed">{aula.para_casa}</p>
        </Section>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleBaixarPDF}
          disabled={baixando}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        >
          {baixando ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando PDF...
            </>
          ) : (
            "📥 Baixar em PDF"
          )}
        </button>
        <button className="flex-1 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-colors">
          ⭐ Salvar nos favoritos
        </button>
        <button
          onClick={onNova}
          className="flex-1 bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-colors"
        >
          ⚡ Gerar outra aula
        </button>
      </div>
    </div>
  );
}

function Section({
  icon, title, color, children,
}: {
  icon: string;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100",
    purple: "bg-purple-50 border-purple-100",
    indigo: "bg-indigo-50 border-indigo-100",
    orange: "bg-orange-50 border-orange-100",
    emerald: "bg-emerald-50 border-emerald-100",
    slate: "bg-slate-50 border-slate-200",
  };
  const headerColors: Record<string, string> = {
    blue: "text-blue-700",
    purple: "text-purple-700",
    indigo: "text-indigo-700",
    orange: "text-orange-700",
    emerald: "text-emerald-700",
    slate: "text-slate-700",
  };
  return (
    <div className={`rounded-2xl border p-6 ${colors[color] ?? "bg-white border-slate-100"}`}>
      <h3 className={`font-black text-base mb-4 flex items-center gap-2 ${headerColors[color] ?? "text-slate-900"}`}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function BloqueioUpgrade({ aulasNoMes, limite }: { aulasNoMes: number; limite: number }) {
  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6 pb-20 lg:pb-0">
      {/* Ícone animado */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mb-4">
          <span className="text-4xl">🚀</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Limite do plano gratuito atingido</h1>
        <p className="text-slate-500 text-sm mt-2">
          Você já gerou <span className="font-bold text-slate-700">{aulasNoMes} de {limite} aulas</span> gratuitas este mês.
        </p>
      </div>

      {/* Card principal */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-200">
        <p className="text-xl font-black mb-1">Assine e gere sem limites ✨</p>
        <p className="text-purple-200 text-sm mb-6">
          Acesso ilimitado a todas as funcionalidades da plataforma.
        </p>

        <ul className="space-y-3 mb-8">
          {[
            { icon: "⚡", text: "Aulas ilimitadas todos os meses" },
            { icon: "📥", text: "Download em PDF e Word" },
            { icon: "🎯", text: "Todos os estilos e formatos" },
            { icon: "💬", text: "Suporte prioritário" },
          ].map((f) => (
            <li key={f.text} className="flex items-center gap-3 text-sm">
              <span className="text-lg">{f.icon}</span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <Link
            href="/dashboard/plano"
            className="block text-center bg-white text-purple-700 font-black py-4 rounded-2xl hover:bg-purple-50 transition-colors shadow-lg text-base"
          >
            Ver planos — a partir de R$29,90/mês
          </Link>
          <Link
            href="/dashboard/plano"
            className="block text-center text-purple-200 text-sm hover:text-white transition-colors"
          >
            Plano Premium com suporte VIP WhatsApp por R$39,90/mês →
          </Link>
        </div>
      </div>

      {/* Quando renova */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <span className="text-2xl">🗓️</span>
        <div>
          <p className="font-bold text-slate-800 text-sm">Suas aulas gratuitas renovam no dia 1°</p>
          <p className="text-slate-400 text-xs mt-0.5">
            Ou assine agora para não esperar e ter acesso imediato.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="block text-center text-slate-400 text-sm hover:text-slate-600 transition-colors"
      >
        ← Voltar ao dashboard
      </Link>
    </div>
  );
}
