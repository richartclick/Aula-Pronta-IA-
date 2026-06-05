"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { gerarAulaDemo } from "@/app/actions/gerar-aula-demo";
import type { AulaGeradaState } from "@/app/actions/gerar-aula";

const STORAGE_KEY = "aula_demo_usada";

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

export default function DemoClient() {
  const [state, action, isPending] = useActionState(gerarAulaDemo, initialState);
  const [jaUsou, setJaUsou] = useState(false);
  const [estiloSel, setEstiloSel] = useState("dinamico");

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) setJaUsou(true);
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      localStorage.setItem(STORAGE_KEY, "1");
      setJaUsou(true);
    }
  }, [state.status]);

  if (jaUsou && state.status !== "success") {
    return <LimiteDemoAtingido />;
  }

  if (state.status === "success" && state.aula) {
    return <ResultadoDemo aula={state.aula} meta={state.meta!} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-black text-slate-900 text-lg">Aula Pronta IA</span>
        </Link>
        <Link href="/registro" className="text-sm text-blue-600 font-semibold hover:underline">
          Criar conta grátis →
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10 pb-20">
        <div className="text-center mb-8">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            ✓ Sem senha · Sem cartão
          </span>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Gere sua primeira aula grátis</h1>
          <p className="text-slate-500 text-base">Preencha os campos e veja o resultado em segundos.</p>
        </div>

        {state.status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-6">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-700 text-sm">{state.message}</p>
          </div>
        )}

        <form action={action} className="space-y-5">
          <input type="hidden" name="estilo" value={estiloSel} />

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <label className="block font-bold text-slate-900 text-sm mb-1">
              Tema da aula <span className="text-red-400">*</span>
            </label>
            <input
              name="tema"
              type="text"
              required
              placeholder="Ex: Frações, Sistema Solar, Revolução Industrial..."
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <label className="block font-bold text-slate-900 text-sm mb-2">
                Série <span className="text-red-400">*</span>
              </label>
              <select name="serie" required className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 text-sm">
                <option value="">Selecione...</option>
                {series.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <label className="block font-bold text-slate-900 text-sm mb-2">
                Disciplina <span className="text-red-400">*</span>
              </label>
              <select name="disciplina" required className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 text-sm">
                <option value="">Selecione...</option>
                {disciplinas.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <label className="block font-bold text-slate-900 text-sm mb-2">
                Duração <span className="text-red-400">*</span>
              </label>
              <select name="duracao" required className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 text-sm">
                <option value="">Selecione...</option>
                {duracoes.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl text-lg transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
          >
            {isPending ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gerando sua aula... (20-40 seg)</span>
              </>
            ) : (
              "⚡ Gerar minha aula grátis"
            )}
          </button>
          <p className="text-center text-slate-400 text-xs">Sem cadastro · Resultado em segundos · Alinhado à BNCC</p>
        </form>
      </div>
    </div>
  );
}

function ResultadoDemo({
  aula,
  meta,
}: {
  aula: NonNullable<AulaGeradaState["aula"]>;
  meta: NonNullable<AulaGeradaState["meta"]>;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-black text-slate-900 text-lg">Aula Pronta IA</Link>
        <Link href="/registro" className="text-sm text-blue-600 font-semibold hover:underline">
          Criar conta grátis →
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 pb-20 space-y-6">

        {/* Header sucesso */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-7 text-white shadow-xl shadow-emerald-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">🎉</div>
            <div>
              <h1 className="text-2xl font-black">Sua aula está pronta!</h1>
              <p className="text-emerald-100 text-sm mt-1">{aula.titulo}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">📚 {meta.serie}</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">🎓 {meta.disciplina}</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">⏱ {meta.duracao}</span>
          </div>
        </div>

        {/* CTA para criar conta */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
          <p className="text-2xl mb-2">🚀</p>
          <h2 className="font-black text-slate-900 text-lg mb-1">Gostou do resultado?</h2>
          <p className="text-slate-600 text-sm mb-4">Crie sua conta gratuita para salvar esta aula, baixar em PDF e gerar mais planos.</p>
          <Link
            href="/registro"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 px-8 rounded-2xl text-base hover:opacity-90 transition-opacity shadow-lg shadow-blue-200"
          >
            Criar conta grátis — 5 aulas por mês →
          </Link>
          <p className="text-slate-400 text-xs mt-3">Sem cartão de crédito · Cancele quando quiser</p>
        </div>

        {/* Preview da aula */}
        {aula.conteudo_didatico && (
          <SecaoDemo icon="📚" titulo="Conteúdo da aula" cor="indigo">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{aula.conteudo_didatico}</p>
          </SecaoDemo>
        )}

        <SecaoDemo icon="🎯" titulo="Objetivos de aprendizagem" cor="blue">
          <ul className="space-y-2">
            {aula.objetivos.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-blue-500 font-black shrink-0">✓</span>{obj}
              </li>
            ))}
          </ul>
          {aula.bncc.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {aula.bncc.map((cod, i) => (
                <span key={i} className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-lg">{cod}</span>
              ))}
            </div>
          )}
        </SecaoDemo>

        <SecaoDemo icon="📖" titulo={`Introdução (${aula.introducao.duracao})`} cor="purple">
          <p className="text-slate-700 text-sm leading-relaxed">{aula.introducao.descricao}</p>
        </SecaoDemo>

        <SecaoDemo icon="📋" titulo="Desenvolvimento" cor="indigo">
          <div className="space-y-4">
            {aula.desenvolvimento.map((step, i) => (
              <div key={i} className="border-l-4 border-indigo-300 pl-4">
                <p className="text-sm font-bold text-indigo-700 mb-1">{i + 1}. {step.etapa}</p>
                <p className="text-slate-600 text-sm">{step.descricao}</p>
              </div>
            ))}
          </div>
        </SecaoDemo>

        {/* CTA final */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center">
          <p className="text-xl font-black mb-2">Salve esta aula e gere muito mais</p>
          <p className="text-blue-200 text-sm mb-6">Crie sua conta grátis e tenha acesso a 5 aulas por mês — sem cartão.</p>
          <Link
            href="/registro"
            className="inline-block bg-white text-blue-700 font-black py-4 px-8 rounded-2xl text-base hover:bg-blue-50 transition-colors shadow-lg"
          >
            Criar minha conta grátis →
          </Link>
        </div>

      </div>
    </div>
  );
}

function LimiteDemoAtingido() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-black text-slate-900 text-lg">Aula Pronta IA</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Você já usou sua aula gratuita!</h1>
          <p className="text-slate-500">Crie sua conta para continuar gerando aulas com o Aula Pronta IA — 5 aulas por mês grátis.</p>
          <Link
            href="/registro"
            className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 px-8 rounded-2xl text-lg hover:opacity-90 transition-opacity shadow-xl shadow-blue-200"
          >
            Criar conta grátis →
          </Link>
          <p className="text-slate-400 text-xs">Sem cartão · 5 aulas/mês grátis · Cancele quando quiser</p>
        </div>
      </div>
    </div>
  );
}

function SecaoDemo({ icon, titulo, cor, children }: {
  icon: string; titulo: string; cor: string; children: React.ReactNode;
}) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100", purple: "bg-purple-50 border-purple-100",
    indigo: "bg-indigo-50 border-indigo-100",
  };
  const titleCor: Record<string, string> = {
    blue: "text-blue-700", purple: "text-purple-700", indigo: "text-indigo-700",
  };
  return (
    <div className={`rounded-2xl border p-5 ${bg[cor] ?? "bg-white border-slate-100"}`}>
      <h3 className={`font-black text-base mb-4 flex items-center gap-2 ${titleCor[cor] ?? "text-slate-900"}`}>
        <span>{icon}</span>{titulo}
      </h3>
      {children}
    </div>
  );
}
