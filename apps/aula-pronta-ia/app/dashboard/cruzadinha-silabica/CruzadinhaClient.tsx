"use client";

import { useState } from "react";
import { FAMILIAS, DIFICULDADE_CONFIG, type CruzadinhaDificuldade } from "@/lib/cruzadinha-silabica/config";

const NUM_PALAVRAS_OPTS = [4, 5, 6, 7, 8];

const DIFICULDADES = (
  Object.entries(DIFICULDADE_CONFIG) as [CruzadinhaDificuldade, typeof DIFICULDADE_CONFIG[CruzadinhaDificuldade]][]
);

export default function CruzadinhaClient() {
  const [familiaId, setFamiliaId] = useState<string | null>(null);
  const [dificuldade, setDificuldade] = useState<CruzadinhaDificuldade>("medio");
  const [numPalavras, setNumPalavras] = useState(6);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const familiaAtual = FAMILIAS.find((f) => f.id === familiaId);
  const podeGerar = !!familiaId && !gerando;

  async function handleGerar() {
    if (!podeGerar) return;
    setGerando(true);
    setErro(null);
    try {
      const res = await fetch("/api/cruzadinha-silabica-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familiaId, dificuldade, numPalavras }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErro((d as { error?: string }).error ?? "Erro ao gerar. Tente novamente.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cruzadinha-${familiaId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Cruzadinha Silábica</h1>
        <p className="text-slate-500 text-sm mt-1">
          A IA seleciona palavras e divide em sílabas corretamente — o aluno preenche as lacunas usando o banco de sílabas.
        </p>
      </div>

      {/* Família Silábica */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Família Silábica
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {FAMILIAS.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFamiliaId(f.id); setErro(null); }}
              className={`rounded-2xl p-3 text-center border-2 transition-all ${
                familiaId === f.id
                  ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                  : "border-slate-200 bg-white hover:border-indigo-300"
              }`}
            >
              <span className="text-xl block mb-1">{f.emoji}</span>
              <span className="text-xs font-bold text-slate-700 block leading-tight">
                {f.id === "B" || f.id === "C" || f.id === "D" || f.id === "F" ||
                 f.id === "G" || f.id === "L" || f.id === "M" || f.id === "N" ||
                 f.id === "P" || f.id === "R" || f.id === "S" || f.id === "T" ||
                 f.id === "V"
                  ? `Família ${f.id}`
                  : f.id}
              </span>
              <span className="text-[9px] text-slate-400 leading-tight">
                {f.silabas.slice(0, 3).join("·")}
              </span>
            </button>
          ))}
        </div>

        {familiaAtual && (
          <div className="mt-3 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
            <p className="text-indigo-700 text-sm">
              <span className="font-bold">{familiaAtual.label}:</span>{" "}
              {familiaAtual.silabas.join(" · ")} · Exemplo: {familiaAtual.exemplo}
            </p>
          </div>
        )}
      </section>

      {/* Dificuldade */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          2. Dificuldade
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIFICULDADES.map(([id, cfg]) => (
            <button
              key={id}
              onClick={() => { setDificuldade(id); setErro(null); }}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                dificuldade === id
                  ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                  : "border-slate-200 bg-white hover:border-indigo-300"
              }`}
            >
              <p className="font-bold text-slate-800 text-sm mb-1">{cfg.label}</p>
              <p className="text-xs text-slate-500">{cfg.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Quantidade de palavras */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          3. Quantidade de Palavras
        </h2>
        <div className="flex flex-wrap gap-2">
          {NUM_PALAVRAS_OPTS.map((n) => (
            <button
              key={n}
              onClick={() => setNumPalavras(n)}
              className={`px-5 py-3 rounded-2xl font-bold border-2 transition-all text-sm ${
                numPalavras === n
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
              }`}
            >
              {n} palavras
            </button>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 px-5 py-4">
        <p className="text-indigo-800 text-sm font-bold mb-1">
          🤖 A IA divide as sílabas corretamente
        </p>
        <p className="text-indigo-600 text-xs leading-relaxed">
          A IA seleciona palavras conhecidas pelas crianças e separa cada uma em sílabas com precisão.
          O PDF já vem com o <strong>banco de sílabas</strong> embaralhado para o aluno usar e
          o <strong>gabarito</strong> separado para a professora. Cada geração traz palavras diferentes.
        </p>
      </div>

      {/* Prévia do que vem no PDF */}
      {familiaAtual && (
        <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4">
          <p className="text-slate-700 text-sm font-semibold mb-2">O PDF terá:</p>
          <ul className="text-slate-500 text-xs space-y-1">
            <li>✓ {numPalavras} palavras da {familiaAtual.label} com emoji e dica</li>
            <li>✓ Caixas de sílabas — as em branco destacadas em azul</li>
            <li>✓ Banco de sílabas embaralhado (aluno monta as palavras)</li>
            <li>✓ Gabarito na página 2 (sílabas corretas em azul)</li>
          </ul>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleGerar}
        disabled={!podeGerar}
        className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
          !podeGerar
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 shadow-lg shadow-indigo-200"
        }`}
      >
        {gerando
          ? "A IA está escolhendo palavras e sílabas…"
          : "⬇ Gerar Cruzadinha + Gabarito"}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Sílabas verificadas pela IA · banco embaralhado · gabarito incluído · BNCC alinhado
      </p>
    </div>
  );
}
