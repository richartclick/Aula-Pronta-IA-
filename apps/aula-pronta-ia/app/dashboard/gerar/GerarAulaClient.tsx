"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gerarAula, type AulaGeradaState } from "@/app/actions/gerar-aula";
import { toggleFavorita } from "@/app/actions/aulas";
import BotaoAtividades from "@/app/dashboard/aula/[id]/BotaoAtividades";
import type { UsoMensal } from "@/lib/uso";

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
  { value: "dinamico", label: "Dinâmico e interativo", icon: "⚡", desc: "Discussões e participação" },
  { value: "expositivo", label: "Expositivo e organizado", icon: "📋", desc: "Estruturado e direto" },
  { value: "ludico", label: "Lúdico e criativo", icon: "🎨", desc: "Jogos e brincadeiras" },
  { value: "pratico", label: "Prático com experimentos", icon: "🔬", desc: "Mãos à obra" },
];

export default function GerarAulaClient({ uso }: { uso: UsoMensal | null }) {
  const [state, action, isPending] = useActionState(gerarAula, initialState);
  const [estiloSel, setEstiloSel] = useState("dinamico");
  const router = useRouter();

  if (state.status === "success" && state.aula) {
    return (
      <AulaResultado
        aula={state.aula}
        aulaId={state.aulaId}
        meta={state.meta!}
        onNova={() => router.push("/dashboard/gerar")}
      />
    );
  }

  if (state.status === "limit_reached") {
    return <BloqueioUpgrade aulasNoMes={state.uso?.aulasNoMes ?? 5} limite={state.uso?.limite ?? 5} />;
  }

  const pctUsado = uso && uso.plano === "gratuito" ? (uso.aulasNoMes / uso.limite) * 100 : 0;
  const corBarra =
    uso?.restantes === 0 ? "bg-red-500" : uso && uso.restantes <= 1 ? "bg-amber-500" : "bg-blue-500";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 lg:p-7 text-white shadow-xl shadow-blue-200">
        <div className="flex items-start gap-3 lg:gap-4">
          <div className="w-11 h-11 lg:w-14 lg:h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl lg:text-3xl shrink-0">
            ⚡
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black leading-tight">Gerar nova aula</h1>
            <p className="text-blue-100 text-sm mt-1 leading-relaxed">
              Preencha os detalhes e a IA cria seu plano completo em segundos.
            </p>
          </div>
        </div>
      </div>

      {/* Banner de uso — plano gratuito */}
      {uso && uso.plano === "gratuito" && (
        <div
          className={`rounded-2xl border-2 p-5 flex items-center gap-4 ${
            uso.restantes === 0
              ? "bg-red-50 border-red-200"
              : uso.restantes <= 1
              ? "bg-amber-50 border-amber-200"
              : "bg-white border-slate-100 shadow-sm"
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-sm font-bold ${
                  uso.restantes === 0
                    ? "text-red-700"
                    : uso.restantes <= 1
                    ? "text-amber-700"
                    : "text-slate-700"
                }`}
              >
                {uso.restantes === 0
                  ? "⚠️ Limite atingido"
                  : `📊 ${uso.restantes} aula${uso.restantes === 1 ? "" : "s"} restante${uso.restantes === 1 ? "" : "s"} este mês`}
              </p>
              <span className="text-xs font-black text-slate-400 tabular-nums">
                {uso.aulasNoMes} / {uso.limite}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${corBarra}`}
                style={{ width: `${Math.min(pctUsado, 100)}%` }}
              />
            </div>
            {uso.restantes > 0 && (
              <p className="text-xs text-slate-400 mt-1.5">Renova automaticamente no dia 1° de cada mês</p>
            )}
          </div>
          <Link
            href="/dashboard/plano"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shadow-md shadow-blue-200"
          >
            Fazer upgrade →
          </Link>
        </div>
      )}

      <form action={action} className="space-y-6">
        <input type="hidden" name="estilo" value={estiloSel} />

        {/* Tema — largura total */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 lg:p-7 space-y-3">
          <div>
            <label className="block font-bold text-slate-900 text-base">
              Tema da aula <span className="text-red-400">*</span>
            </label>
            <p className="text-slate-400 text-xs mt-0.5 mb-3">Descreva o conteúdo que você quer ensinar</p>
          </div>
          <input
            name="tema"
            type="text"
            required
            placeholder="Ex: Frações e números decimais, Sistema Solar, Revolução Industrial..."
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Grade duas colunas no desktop */}
        <div className="grid lg:grid-cols-2 gap-6 lg:items-start">

          {/* Coluna esquerda */}
          <div className="space-y-6">

            {/* Detalhes da turma */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Detalhes da turma</h3>
                <p className="text-slate-400 text-xs mt-0.5">Adapta o conteúdo para o nível certo</p>
              </div>
              <div className="space-y-3 lg:space-y-7">

                {/* Série / Turma — azul */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4 lg:p-6">
                  <label className="block text-blue-600 text-xs font-bold mb-2 lg:mb-4 uppercase tracking-wide">
                    Série / Turma <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="serie"
                    required
                    className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 lg:py-4 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors text-sm lg:text-base"
                  >
                    <option value="">Selecione...</option>
                    {series.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Disciplina — roxo */}
                <div className="bg-purple-50 border-2 border-purple-100 rounded-xl p-4 lg:p-6">
                  <label className="block text-purple-600 text-xs font-bold mb-2 lg:mb-4 uppercase tracking-wide">
                    Disciplina <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="disciplina"
                    required
                    className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-3 lg:py-4 text-slate-900 focus:outline-none focus:border-purple-500 transition-colors text-sm lg:text-base"
                  >
                    <option value="">Selecione...</option>
                    {disciplinas.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Duração — âmbar */}
                <div className="bg-amber-50 border-2 border-amber-100 rounded-xl p-4 lg:p-6">
                  <label className="block text-amber-600 text-xs font-bold mb-2 lg:mb-4 uppercase tracking-wide">
                    Duração <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="duracao"
                    required
                    className="w-full bg-white border-2 border-amber-200 rounded-xl px-4 py-3 lg:py-4 text-slate-900 focus:outline-none focus:border-amber-500 transition-colors text-sm lg:text-base"
                  >
                    <option value="">Selecione...</option>
                    {duracoes.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Observações */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 lg:p-7 space-y-3">
              <div>
                <label className="block font-bold text-slate-900 text-base">
                  Observações extras{" "}
                  <span className="text-slate-300 font-normal text-sm">(opcional)</span>
                </label>
                <p className="text-slate-400 text-xs mt-0.5">Diga algo específico sobre sua turma</p>
              </div>
              <textarea
                name="observacoes"
                rows={3}
                placeholder="Ex: turma agitada, alunos com dificuldade em leitura, preparar para prova, incluir atividade ao ar livre..."
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none bg-slate-50 focus:bg-white"
              />
            </div>

          </div>

          {/* Coluna direita */}
          <div className="space-y-6">

            {/* Estilo */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Estilo da aula</h3>
                <p className="text-slate-400 text-xs mt-0.5">Como você prefere conduzir a turma</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {estilos.map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => setEstiloSel(e.value)}
                    className={`flex items-center gap-3 p-3 lg:p-4 rounded-xl border-2 transition-all text-left ${
                      estiloSel === e.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-2xl shrink-0">{e.icon}</span>
                    <div>
                      <p
                        className={`text-sm font-bold leading-tight ${
                          estiloSel === e.value ? "text-blue-700" : "text-slate-800"
                        }`}
                      >
                        {e.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{e.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {state.status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                <span className="text-red-500 text-lg shrink-0">⚠️</span>
                <p className="text-red-700 text-sm font-medium">{state.message}</p>
              </div>
            )}

            {/* Botão sticky no mobile — sempre visível enquanto preenche o form */}
            <div className="sticky bottom-24 lg:static -mx-4 lg:mx-0 px-4 lg:px-0 py-3 lg:py-0 bg-white lg:bg-transparent border-t border-slate-100 lg:border-0 shadow-lg lg:shadow-none">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl text-lg transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
              >
                {isPending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Gerando sua aula...</span>
                  </>
                ) : (
                  "⚡ Gerar aula agora"
                )}
              </button>
              <p className="text-center text-slate-400 text-xs mt-2 lg:mt-3">
                Normalmente leva entre 5 e 10 segundos · Alimentado por IA
              </p>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Resultado da aula gerada
───────────────────────────────────────────── */

function AulaResultado({
  aula,
  aulaId,
  meta,
  onNova,
}: {
  aula: NonNullable<AulaGeradaState["aula"]>;
  aulaId?: string;
  meta: NonNullable<AulaGeradaState["meta"]>;
  onNova: () => void;
}) {
  const [baixando, setBaixando] = useState(false);
  const [erroPDF, setErroPDF] = useState(false);
  const [favorita, setFavorita] = useState(false);
  const [salvandoFavorito, setSalvandoFavorito] = useState(false);

  async function handleBaixarPDF() {
    setBaixando(true);
    setErroPDF(false);
    try {
      const res = await fetch("/api/aula-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aula, meta }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aula-${meta.tema.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErroPDF(true);
    } finally {
      setBaixando(false);
    }
  }

  async function handleFavoritar() {
    if (!aulaId || salvandoFavorito) return;
    setSalvandoFavorito(true);
    await toggleFavorita(aulaId, favorita);
    setFavorita(!favorita);
    setSalvandoFavorito(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      {/* Header de sucesso */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-7 text-white shadow-xl shadow-emerald-200">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
            🎉
          </div>
          <div>
            <h1 className="text-2xl font-black leading-snug">Aula gerada com sucesso!</h1>
            <p className="text-emerald-100 text-sm mt-1 leading-relaxed">{aula.titulo}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            📚 {meta.serie}
          </span>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            🎓 {meta.disciplina}
          </span>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            ⏱ {meta.duracao}
          </span>
        </div>
        {aula.pergunta_norteadora && (
          <p className="text-emerald-100 text-sm italic mt-4 border-t border-white/20 pt-4">
            💡 {aula.pergunta_norteadora}
          </p>
        )}
      </div>

      {/* Botões de ação — logo após o header para visibilidade no mobile */}
      {erroPDF && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-red-500 shrink-0">⚠️</span>
          <p className="text-red-700 text-sm">Erro ao gerar o PDF. Tente novamente.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        <button
          onClick={handleBaixarPDF}
          disabled={baixando}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-sm"
        >
          {baixando ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando PDF...
            </>
          ) : (
            "📥 Baixar PDF"
          )}
        </button>
        <button
          onClick={handleFavoritar}
          disabled={!aulaId || salvandoFavorito}
          className="bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          {favorita ? "⭐ Nos favoritos" : "☆ Favoritar"}
        </button>
        <button
          onClick={onNova}
          className="bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-colors text-sm flex items-center justify-center gap-2"
        >
          ⚡ Nova aula
        </button>
      </div>

      {/* Atividades para alunos — visível imediatamente no mobile */}
      {aulaId && (
        <div className="border-t-2 border-dashed border-slate-200 pt-6 space-y-4">
          <div className="text-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Atividades para os alunos
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Gere exercícios com gabarito a partir desta aula — com PDF para imprimir.
            </p>
          </div>
          <BotaoAtividades
            aulaId={aulaId}
            tema={meta.tema}
            serie={meta.serie}
            disciplina={meta.disciplina}
            conteudo={aula}
          />
        </div>
      )}

      {/* Divisor antes do conteúdo completo da aula */}
      <div className="border-t-2 border-slate-100 pt-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Conteúdo completo da aula</p>
      </div>

      {/* Objetivos */}
      <Secao icon="🎯" titulo="Objetivos de aprendizagem" cor="blue">
        <ul className="space-y-3">
          {aula.objetivos.map((obj, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="text-blue-500 font-black mt-0.5 shrink-0">✓</span>
              {obj}
            </li>
          ))}
        </ul>
        {aula.bncc.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-100 flex flex-wrap gap-2">
            {aula.bncc.map((cod, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-lg">
                {cod}
              </span>
            ))}
          </div>
        )}
      </Secao>

      {/* Introdução */}
      <Secao icon="📖" titulo={`Introdução (${aula.introducao.duracao})`} cor="purple">
        <p className="text-slate-700 text-sm leading-relaxed">{aula.introducao.descricao}</p>
        {aula.introducao.dica_professor && (
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2">
            <span className="text-amber-500 shrink-0">💡</span>
            <p className="text-amber-800 text-xs leading-relaxed">{aula.introducao.dica_professor}</p>
          </div>
        )}
      </Secao>

      {/* Desenvolvimento */}
      <Secao icon="📋" titulo="Desenvolvimento" cor="indigo">
        <div className="space-y-5">
          {aula.desenvolvimento.map((step, i) => (
            <div key={i} className="border-l-4 border-indigo-300 pl-5">
              <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <span className="text-sm font-bold text-indigo-700">
                  {i + 1}. {step.etapa}
                </span>
                <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                  ⏱ {step.duracao}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{step.descricao}</p>
              {step.perguntas_mediacao.length > 0 && (
                <div className="mt-3 bg-indigo-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs font-bold text-indigo-600 mb-2">Perguntas de mediação:</p>
                  {step.perguntas_mediacao.map((p, j) => (
                    <p key={j} className="text-xs text-slate-500 italic">
                      › {p}
                    </p>
                  ))}
                </div>
              )}
              {step.dica_professor && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                  💡 {step.dica_professor}
                </p>
              )}
            </div>
          ))}
        </div>
      </Secao>

      {/* Atividades */}
      <Secao icon="🎮" titulo="Atividades" cor="orange">
        <div className="space-y-4">
          {aula.atividades.map((at, i) => (
            <div key={i} className="bg-white border border-orange-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-sm font-bold text-slate-900">{at.titulo}</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    at.tipo === "grupo"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {at.tipo === "grupo" ? "👥 Grupo" : "👤 Individual"}
                </span>
                <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                  ⏱ {at.duracao}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{at.descricao}</p>
              {at.objetivo_bloom && (
                <p className="mt-2 text-xs text-indigo-600 font-semibold">
                  🧠 Bloom: {at.objetivo_bloom}
                </p>
              )}
              {at.diferenciacao && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                  🔀 {at.diferenciacao}
                </p>
              )}
            </div>
          ))}
        </div>
      </Secao>

      {/* Fechamento */}
      <Secao icon="🏁" titulo={`Fechamento (${aula.fechamento.duracao})`} cor="emerald">
        <p className="text-slate-700 text-sm leading-relaxed">{aula.fechamento.descricao}</p>
        {aula.fechamento.perguntas_reflexao.length > 0 && (
          <div className="mt-4 bg-emerald-50 rounded-xl p-4 space-y-1">
            <p className="text-xs font-bold text-emerald-700 mb-2">Perguntas de reflexão:</p>
            {aula.fechamento.perguntas_reflexao.map((p, i) => (
              <p key={i} className="text-xs text-slate-600 italic">
                › {p}
              </p>
            ))}
          </div>
        )}
      </Secao>

      {/* Avaliação */}
      <Secao icon="📝" titulo="Avaliação" cor="blue">
        <div className="space-y-4">
          <div className="bg-white border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">Formativa</p>
            <p className="text-slate-700 text-sm leading-relaxed">{aula.avaliacao.formativa}</p>
          </div>
          <div className="bg-white border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">Somativa</p>
            <p className="text-slate-700 text-sm leading-relaxed">{aula.avaliacao.somativa}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Autoavaliação do aluno</p>
            <p className="text-slate-600 text-sm italic leading-relaxed">{aula.avaliacao.autoavaliacao}</p>
          </div>
        </div>
      </Secao>

      {/* Materiais */}
      <Secao icon="📦" titulo="Materiais necessários" cor="slate">
        <ul className="grid sm:grid-cols-2 gap-2.5">
          {aula.materiais.map((m, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0" />
              {m}
            </li>
          ))}
        </ul>
      </Secao>

      {/* Para casa */}
      {aula.para_casa && (
        <Secao icon="🏠" titulo="Para casa" cor="slate">
          <p className="text-slate-700 text-sm leading-relaxed">{aula.para_casa}</p>
        </Secao>
      )}

    </div>
  );
}

/* ─────────────────────────────────────────────
   Componente de seção reutilizável
───────────────────────────────────────────── */

function Secao({
  icon,
  titulo,
  cor,
  children,
}: {
  icon: string;
  titulo: string;
  cor: string;
  children: React.ReactNode;
}) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100",
    purple: "bg-purple-50 border-purple-100",
    indigo: "bg-indigo-50 border-indigo-100",
    orange: "bg-orange-50 border-orange-100",
    emerald: "bg-emerald-50 border-emerald-100",
    slate: "bg-slate-50 border-slate-200",
  };
  const titleCor: Record<string, string> = {
    blue: "text-blue-700",
    purple: "text-purple-700",
    indigo: "text-indigo-700",
    orange: "text-orange-700",
    emerald: "text-emerald-700",
    slate: "text-slate-700",
  };
  return (
    <div className={`rounded-2xl border p-6 ${bg[cor] ?? "bg-white border-slate-100"}`}>
      <h3
        className={`font-black text-lg mb-6 flex items-center gap-2.5 ${
          titleCor[cor] ?? "text-slate-900"
        }`}
      >
        <span className="text-xl">{icon}</span>
        {titulo}
      </h3>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Bloqueio de upgrade
───────────────────────────────────────────── */

function BloqueioUpgrade({ aulasNoMes, limite }: { aulasNoMes: number; limite: number }) {
  return (
    <div className="max-w-lg mx-auto mt-6 space-y-6 pb-20 lg:pb-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mb-4">
          <span className="text-4xl">🚀</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Limite do plano gratuito atingido</h1>
        <p className="text-slate-500 text-sm mt-2">
          Você gerou{" "}
          <span className="font-bold text-slate-700">
            {aulasNoMes} de {limite} aulas
          </span>{" "}
          gratuitas este mês.
        </p>
      </div>

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
