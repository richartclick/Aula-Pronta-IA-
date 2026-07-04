"use client";

import { useState } from "react";
import { FORMAS } from "@/lib/pontilhados/formas";

const FORMATOS = [
  {
    id: "grande" as const,
    label: "Formato Grande",
    emoji: "🖊️",
    desc: "4 formas por página · 2 páginas · ideal para Ed. Infantil (4-8 anos)",
    cor: "from-sky-400 to-blue-500",
    shapes: "4 formas/pág",
    pages: "2 páginas",
  },
  {
    id: "compacto" as const,
    label: "Formato Compacto",
    emoji: "📝",
    desc: "8 formas por página · 1 página · ideal para Fund. I (8+ anos)",
    cor: "from-violet-400 to-purple-500",
    shapes: "8 formas/pág",
    pages: "1 página",
  },
];

export default function PontilhadosClient() {
  const [formato, setFormato] = useState<"grande" | "compacto" | null>(null);
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const formatoAtual = FORMATOS.find((f) => f.id === formato);

  async function handleBaixar() {
    if (!formato) return;
    setBaixando(true);
    setErro(null);
    try {
      const res = await fetch("/api/pontilhados-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formato }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErro((d as { error?: string }).error ?? "Erro ao gerar PDF.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pontilhados-${formato}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Pontilhados</h1>
        <p className="text-slate-500 text-sm mt-1">
          Atividade de traçado de formas geométricas — sem IA, geração instantânea.
        </p>
      </div>

      {/* Formato */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Escolha o Formato
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FORMATOS.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFormato(f.id); setErro(null); }}
              className={`rounded-2xl p-5 text-left border-2 transition-all ${
                formato === f.id
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{f.emoji}</span>
                <div>
                  <p className="font-bold text-slate-800">{f.label}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                      {f.shapes}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                      {f.pages}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Formas incluídas */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          2. Formas Incluídas (8 no total)
        </h2>
        <div className="bg-slate-50 rounded-2xl p-5">
          <div className="grid grid-cols-4 gap-3">
            {FORMAS.map((f) => (
              <div
                key={f.id}
                className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm"
              >
                <span className="text-2xl text-slate-600">{f.icon}</span>
                <span className="text-[11px] font-medium text-slate-600 text-center">{f.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Cada forma tem um ponto azul indicando onde começar o traçado
          </p>
        </div>
      </section>

      {/* Erro */}
      {erro && (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleBaixar}
        disabled={!formato || baixando}
        className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
          !formato || baixando
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : `bg-gradient-to-r ${formatoAtual?.cor ?? "from-blue-500 to-indigo-600"} hover:opacity-90 shadow-lg`
        }`}
      >
        {baixando ? "Gerando PDF…" : "⬇ Baixar PDF"}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Geração instantânea · sem IA · 8 formas geométricas · ponto azul indica início · BNCC alinhado
      </p>
    </div>
  );
}
