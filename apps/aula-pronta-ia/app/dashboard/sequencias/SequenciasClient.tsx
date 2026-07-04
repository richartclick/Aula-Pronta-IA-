"use client";

import { useState } from "react";
import { FAIXAS_SEQ } from "@/lib/sequencias/gerador";

const FAIXAS = [
  {
    id: "4-6",
    label: "4 a 6 anos",
    emoji: "🌱",
    desc: "Conta de 1 em 1 · sequências de 5 números · 1 lacuna",
    cor: "from-green-400 to-teal-500",
  },
  {
    id: "6-8",
    label: "6 a 8 anos",
    emoji: "📘",
    desc: "+1, +2, +5, +10 · sequências de 6 números · 2 lacunas",
    cor: "from-blue-400 to-indigo-500",
  },
  {
    id: "8-10",
    label: "8 a 10 anos",
    emoji: "📗",
    desc: "+2, +3, +5, +10, +100 · sequências de 7 números · 3 lacunas",
    cor: "from-violet-400 to-purple-500",
  },
  {
    id: "10+",
    label: "10+ anos",
    emoji: "📙",
    desc: "+25, +50, +100, +1000 · sequências de 8 números · 3 lacunas",
    cor: "from-orange-400 to-rose-500",
  },
];

const PAGINAS_OPTS = [
  { value: 1, label: "1 folha" },
  { value: 2, label: "2 folhas" },
  { value: 3, label: "3 folhas" },
];

export default function SequenciasClient() {
  const [faixaId, setFaixaId] = useState<string | null>(null);
  const [numPaginas, setNumPaginas] = useState(1);
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const faixaAtual = FAIXAS.find((f) => f.id === faixaId);
  const config = faixaId ? FAIXAS_SEQ[faixaId] : null;

  async function handleBaixar() {
    if (!faixaId) return;
    setBaixando(true);
    setErro(null);
    try {
      const res = await fetch("/api/sequencias-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faixaId, numPaginas }),
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
      a.download = `sequencias-${faixaId}.pdf`;
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
        <h1 className="text-2xl font-bold text-slate-800">Sequências Numéricas</h1>
        <p className="text-slate-500 text-sm mt-1">
          Atividades de padrão numérico para imprimir — sem IA, geração instantânea.
        </p>
      </div>

      {/* Faixa etária */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Faixa Etária
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FAIXAS.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFaixaId(f.id); setErro(null); }}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                faixaId === f.id
                  ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{f.emoji}</span>
                <span className="font-bold text-slate-800">{f.label}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Quantidade de folhas */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          2. Quantidade de Folhas
        </h2>
        <div className="flex gap-3 flex-wrap">
          {PAGINAS_OPTS.map((op) => (
            <button
              key={op.value}
              onClick={() => setNumPaginas(op.value)}
              className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all text-sm ${
                numPaginas === op.value
                  ? "border-violet-500 bg-violet-50 text-violet-700 shadow-md shadow-violet-100"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        {config && (
          <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-slate-600 text-sm">
              <span className="font-bold">{numPaginas} folha{numPaginas > 1 ? "s" : ""}</span>
              {" "}×{" "}
              <span className="font-bold">{config.seqPerPage} sequências</span>
              {" "}={" "}
              <span className="font-bold text-violet-700">{numPaginas * config.seqPerPage} atividades</span>
              {" "}+ {numPaginas} gabarito{numPaginas > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </section>

      {/* Exemplo visual */}
      {config && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Exemplo de sequência
          </h2>
          <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-2 flex-wrap">
            {[3, 4, null, 6, 7].slice(0, config.seqLength).map((n, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-slate-400 text-xs">→</span>}
                <div
                  style={{ width: config.cellSize, height: config.cellSize }}
                  className={`flex items-center justify-center rounded-lg border-2 font-bold text-sm ${
                    n === null
                      ? "border-slate-700 bg-white text-transparent"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {n !== null ? n : ""}
                </div>
              </div>
            ))}
            <span className="text-slate-400 text-xs ml-2">(lacunas para preencher)</span>
          </div>
        </section>
      )}

      {/* Erro */}
      {erro && (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleBaixar}
        disabled={!faixaId || baixando}
        className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
          !faixaId || baixando
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : `bg-gradient-to-r ${faixaAtual?.cor ?? "from-violet-500 to-purple-600"} hover:opacity-90 shadow-lg`
        }`}
      >
        {baixando ? "Gerando PDF…" : "⬇ Baixar PDF"}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Geração instantânea · sem IA · cada folha tem sequências únicas · BNCC por faixa etária
      </p>
    </div>
  );
}
