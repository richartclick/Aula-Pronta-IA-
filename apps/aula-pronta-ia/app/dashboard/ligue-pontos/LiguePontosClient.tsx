"use client";

import { useState } from "react";
import { FIGURAS, QUANTIDADES_LP } from "@/lib/ligue-pontos/figuras";

const NIVEL_COR: Record<string, string> = {
  facil:   "bg-emerald-100 text-emerald-700 border-emerald-300",
  medio:   "bg-amber-100  text-amber-700  border-amber-300",
  dificil: "bg-red-100    text-red-700    border-red-300",
};

export default function LiguePontosClient() {
  const [figuraId, setFiguraId] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleBaixar() {
    if (!figuraId) return;
    setBaixando(true);
    setErro(null);
    try {
      const res = await fetch("/api/ligue-pontos-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ figuraId, quantidade }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro((data as { error?: string }).error ?? "Erro ao gerar PDF.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ligue-pontos-${figuraId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  const figuraAtual = FIGURAS.find((f) => f.id === figuraId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Ligue os Pontos</h1>
        <p className="text-slate-500 text-sm mt-1">
          Escolha uma figura, imprima e deixe as crianças descobrirem a surpresa!
        </p>
      </div>

      {/* Seleção de figura */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Escolha a figura
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FIGURAS.map((fig) => (
            <button
              key={fig.id}
              onClick={() => { setFiguraId(fig.id); setErro(null); }}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                figuraId === fig.id
                  ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <span className="text-3xl block mb-2">{fig.emoji}</span>
              <span className="font-bold text-slate-800 block text-sm">{fig.label}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border mt-1 inline-block ${NIVEL_COR[fig.nivelValue]}`}
              >
                {fig.nivelLabel}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Quantidade de cópias */}
      {figuraId && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            2. Quantas cópias?
          </h2>
          <div className="flex gap-3 flex-wrap">
            {QUANTIDADES_LP.map((q) => (
              <button
                key={q}
                onClick={() => setQuantidade(q)}
                className={`w-16 h-16 rounded-2xl font-bold text-lg border-2 transition-all ${
                  quantidade === q
                    ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md shadow-pink-100"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {quantidade} {quantidade === 1 ? "página" : "páginas"} no PDF
          </p>
        </section>
      )}

      {/* Erro */}
      {erro && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Botão */}
      {figuraId && (
        <button
          onClick={handleBaixar}
          disabled={baixando}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
            !baixando
              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 shadow-lg shadow-amber-200"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {baixando
            ? "Gerando PDF…"
            : `⬇ Baixar PDF — ${figuraAtual?.label} (${quantidade} ${quantidade === 1 ? "cópia" : "cópias"})`}
        </button>
      )}

      <p className="text-center text-xs text-slate-400 mt-4">
        PDF pronto para imprimir · alinhado à BNCC EI03TS
      </p>
    </div>
  );
}
