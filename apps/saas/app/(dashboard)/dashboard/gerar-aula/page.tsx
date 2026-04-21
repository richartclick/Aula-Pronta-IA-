"use client";

import { useActionState } from "react";
import { gerarAula } from "@/app/actions/aula";
import Link from "next/link";

const series = [
  "Educação Infantil — 3 a 5 anos",
  "1º Ano — Fundamental I",
  "2º Ano — Fundamental I",
  "3º Ano — Fundamental I",
  "4º Ano — Fundamental I",
  "5º Ano — Fundamental I",
  "6º Ano — Fundamental II",
  "7º Ano — Fundamental II",
  "8º Ano — Fundamental II",
  "9º Ano — Fundamental II",
  "1º Ano — Ensino Médio",
  "2º Ano — Ensino Médio",
  "3º Ano — Ensino Médio",
];

const estilos = [
  "Expositivo com atividades",
  "Dinâmico e lúdico",
  "Trabalho em grupo",
  "Resolução de problemas",
  "Projeto interdisciplinar",
];

export default function GerarAulaPage() {
  const [state, action, isPending] = useActionState(gerarAula, { success: false });

  if (state.error === "LIMITE_ATINGIDO") {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Limite atingido</h2>
        <p className="text-slate-600 mb-6">
          Você usou todas as aulas do seu plano gratuito. Faça upgrade para continuar gerando aulas.
        </p>
        <Link
          href="/dashboard/conta"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Ver planos →
        </Link>
      </div>
    );
  }

  if (state.success && state.aula) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-green-600 text-xl">✅</span>
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-lg">Aula gerada com sucesso!</h2>
            <p className="text-slate-500 text-sm">Pronta para usar em sala de aula</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed font-sans">
              {state.aula}
            </pre>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            📥 Imprimir / Salvar PDF
          </button>
          <Link
            href="/dashboard/gerar-aula"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            ⚡ Gerar outra aula
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">⚡ Gerar nova aula</h1>
        <p className="text-slate-500 mt-1">Preencha os campos e a IA cria sua aula em segundos</p>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Tema da aula <span className="text-red-500">*</span>
          </label>
          <input
            name="tema"
            type="text"
            required
            placeholder="Ex: Frações, Revolução Industrial, Fotossíntese..."
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Série / Turma <span className="text-red-500">*</span>
          </label>
          <select
            name="serie"
            required
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors bg-white"
          >
            <option value="">Selecione a série</option>
            {series.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duração da aula</label>
          <div className="grid grid-cols-3 gap-2">
            {["30 minutos", "45 minutos", "60 minutos"].map((d) => (
              <label key={d} className="cursor-pointer">
                <input type="radio" name="duracao" value={d} defaultChecked={d === "45 minutos"} className="sr-only peer" />
                <div className="border-2 border-slate-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 rounded-xl py-2.5 text-center text-sm font-semibold text-slate-600 peer-checked:text-blue-700 transition-all">
                  {d}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estilo de aula</label>
          <select
            name="estilo"
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors bg-white"
          >
            {estilos.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {state.error && state.error !== "LIMITE_ATINGIDO" && (
          <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-4 rounded-xl text-lg transition-colors"
        >
          {isPending ? "⏳ Gerando sua aula..." : "⚡ Gerar aula agora"}
        </button>

        <p className="text-center text-slate-400 text-xs">
          Tempo médio: menos de 30 segundos
        </p>
      </form>
    </div>
  );
}
