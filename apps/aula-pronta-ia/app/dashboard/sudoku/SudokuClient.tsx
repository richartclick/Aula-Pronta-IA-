"use client";

import { useState } from "react";
import { TAMANHOS } from "@/lib/sudoku/gerador";

const TAMANHOS_LIST = [
  { id: "4x4", ...TAMANHOS["4x4"] },
  { id: "6x6", ...TAMANHOS["6x6"] },
  { id: "9x9", ...TAMANHOS["9x9"] },
];

const QTDS = [
  { value: 1, label: "1 puzzle" },
  { value: 2, label: "2 puzzles" },
  { value: 3, label: "3 puzzles" },
];

function MiniGrid({ tamanhoId }: { tamanhoId: string }) {
  const cfg = TAMANHOS[tamanhoId];
  if (!cfg) return null;
  const { size, boxRows, boxCols } = cfg;
  const cellPx = Math.floor(156 / size);

  return (
    <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-6">
      <div
        style={{
          border: "2px solid #334155",
          display: "inline-grid",
          gridTemplateColumns: `repeat(${size}, ${cellPx}px)`,
          flexShrink: 0,
        }}
      >
        {Array.from({ length: size * size }).map((_, idx) => {
          const row = Math.floor(idx / size);
          const col = idx % size;
          const borderRight =
            col === size - 1
              ? "none"
              : (col + 1) % boxCols === 0
              ? "2px solid #334155"
              : "0.5px solid #94a3b8";
          const borderBottom =
            row === size - 1
              ? "none"
              : (row + 1) % boxRows === 0
              ? "2px solid #334155"
              : "0.5px solid #94a3b8";
          return (
            <div key={idx} style={{ width: cellPx, height: cellPx, borderRight, borderBottom }} />
          );
        })}
      </div>
      <div>
        <p className="font-bold text-slate-700 text-lg">{cfg.label}</p>
        <p className="text-xs text-slate-400 mt-1">{cfg.publico}</p>
        <p className="text-xs text-slate-400">Números: {cfg.instrNumeros}</p>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          BNCC: {cfg.bncc}
        </p>
      </div>
    </div>
  );
}

export default function SudokuClient() {
  const [tamanhoId, setTamanhoId] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const cfgAtual = tamanhoId ? TAMANHOS[tamanhoId] : null;

  async function handleBaixar() {
    if (!tamanhoId) return;
    setGerando(true);
    setErro(null);
    try {
      const res = await fetch("/api/sudoku-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tamanhoId, quantidade }),
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
      a.download = `sudoku-${tamanhoId}.pdf`;
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
        <h1 className="text-2xl font-bold text-slate-800">Sudoku</h1>
        <p className="text-slate-500 text-sm mt-1">
          Puzzles únicos verificados matematicamente — cada geração é diferente, com gabarito incluído.
        </p>
      </div>

      {/* Tamanho */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Tamanho do Puzzle
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TAMANHOS_LIST.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTamanhoId(t.id); setErro(null); }}
              className={`rounded-2xl p-5 text-left border-2 transition-all ${
                tamanhoId === t.id
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-3xl">{t.emoji}</span>
              <p className="font-bold text-slate-800 text-xl mt-2">{t.label}</p>
              <p className="text-slate-500 text-xs mt-1 font-medium">{t.publico}</p>
              <p className="text-slate-400 text-xs mt-0.5">Números: {t.instrNumeros}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Preview */}
      {tamanhoId && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Estrutura do puzzle
          </h2>
          <MiniGrid tamanhoId={tamanhoId} />
        </section>
      )}

      {/* Quantidade */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          2. Quantidade de Puzzles
        </h2>
        <div className="flex gap-3 flex-wrap">
          {QTDS.map((q) => (
            <button
              key={q.value}
              onClick={() => setQuantidade(q.value)}
              className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all text-sm ${
                quantidade === q.value
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        {cfgAtual && (
          <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-slate-600 text-sm">
              <span className="font-bold">{quantidade} puzzle{quantidade > 1 ? "s" : ""} únicos</span>
              {" "}para <span className="font-bold">{cfgAtual.publico}</span>
              {" "}+ {quantidade} gabarito{quantidade > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </section>

      {/* Destaque diferencial */}
      <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-4">
        <p className="text-blue-800 text-sm font-semibold mb-1">
          🔒 Solução única garantida
        </p>
        <p className="text-blue-600 text-xs leading-relaxed">
          Cada puzzle é verificado matematicamente para ter exatamente uma solução correta.
          O GPT não consegue fazer isso — ele gera imagens que podem ter erros na grade.
        </p>
      </div>

      {/* Erro */}
      {erro && (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleBaixar}
        disabled={!tamanhoId || gerando}
        className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
          !tamanhoId || gerando
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : `bg-gradient-to-r ${cfgAtual?.cor ?? "from-blue-500 to-indigo-600"} hover:opacity-90 shadow-lg`
        }`}
      >
        {gerando ? "Gerando puzzle único…" : "⬇ Baixar PDF"}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Verificação matemática · solução única garantida · gabarito em verde · BNCC alinhado
      </p>
    </div>
  );
}
