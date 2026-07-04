"use client";

import { useState } from "react";
import type { BingoTipo } from "@/lib/bingo/gerador";

const TABELAS = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const RANGES = [
  { value: 15, label: "1 a 15", desc: "Ed. Infantil" },
  { value: 25, label: "1 a 25", desc: "1º ano" },
  { value: 50, label: "1 a 50", desc: "2º ao 3º ano" },
  { value: 75, label: "1 a 75", desc: "Bingo clássico" },
];

const QUANTIDADES = [15, 20, 25, 30, 35, 40];

// quantos resultados únicos a combinação de tabuadas gera
function estimarPool(tabelas: number[]): number {
  const s = new Set<number>();
  for (const t of tabelas) {
    for (let m = 1; m <= 10; m++) s.add(t * m);
  }
  return s.size;
}

function gridSizeFor(pool: number): 3 | 4 | 5 | null {
  if (pool >= 24) return 5;
  if (pool >= 16) return 4;
  if (pool >= 8) return 3;
  return null;
}

export default function BingoClient() {
  const [tipo, setTipo] = useState<BingoTipo>("tabuada");
  const [tabelas, setTabelas] = useState<number[]>([2, 3, 4, 5]);
  const [rangeMax, setRangeMax] = useState(25);
  const [numCartelas, setNumCartelas] = useState(30);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function toggleTabela(t: number) {
    setErro(null);
    setTabelas((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function toggleTodasTabelas() {
    setErro(null);
    setTabelas((prev) => (prev.length === TABELAS.length ? [] : [...TABELAS]));
  }

  const poolSize = tipo === "tabuada" ? estimarPool(tabelas) : rangeMax;
  const gridSize = gridSizeFor(poolSize);

  let gridLabel = "";
  let gridWarn = "";
  if (tipo === "tabuada") {
    if (tabelas.length === 0) {
      gridWarn = "Selecione pelo menos 1 tabuada.";
    } else if (!gridSize) {
      gridWarn = `${poolSize} resultados únicos — selecione mais tabuadas (mínimo 8).`;
    } else {
      gridLabel = `Grade ${gridSize}×${gridSize} · ${poolSize} valores no pool`;
    }
  } else {
    gridSize && (gridLabel = `Grade ${gridSize}×${gridSize} · pool de 1 a ${rangeMax}`);
  }

  const podeGerar =
    !gerando &&
    !!gridSize &&
    (tipo === "tabuada" ? tabelas.length > 0 : true);

  async function handleGerar() {
    if (!podeGerar) return;
    setGerando(true);
    setErro(null);
    try {
      const res = await fetch("/api/bingo-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, tabelas, rangeMax, numCartelas }),
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
      a.download = `bingo-${tipo}-${numCartelas}cartelas.pdf`;
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
        <h1 className="text-2xl font-bold text-slate-800">Bingo Pedagógico</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gere cartelas únicas para toda a turma — cada uma diferente, todas prontas para imprimir.
        </p>
      </div>

      {/* Tipo */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Tipo de Bingo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            {
              id: "tabuada" as BingoTipo,
              emoji: "✖️",
              label: "Bingo da Tabuada",
              desc: 'A professora chama "3 × 7" — o aluno procura 21 na cartela',
              sub: "Ideal para 1º ao 5º ano · Fixação de tabuada",
            },
            {
              id: "numeros" as BingoTipo,
              emoji: "🔢",
              label: "Bingo de Números",
              desc: "A professora chama um número — o aluno marca na cartela",
              sub: "Ideal para Ed. Infantil e 1º ano · Reconhecimento numérico",
            },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => { setTipo(t.id); setErro(null); }}
              className={`rounded-2xl p-5 text-left border-2 transition-all ${
                tipo === t.id
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-3xl block mb-2">{t.emoji}</span>
              <p className="font-bold text-slate-800 text-sm">{t.label}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
              <p className="text-xs text-slate-400 mt-2">{t.sub}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Configuração por tipo */}
      {tipo === "tabuada" ? (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            2. Tabuadas
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {TABELAS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTabela(t)}
                className={`w-12 h-12 rounded-xl font-bold text-sm border-2 transition-all ${
                  tabelas.includes(t)
                    ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                }`}
              >
                ×{t}
              </button>
            ))}
            <button
              onClick={toggleTodasTabelas}
              className={`px-4 h-12 rounded-xl font-bold text-sm border-2 transition-all ${
                tabelas.length === TABELAS.length
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
              }`}
            >
              Todas
            </button>
          </div>

          {/* Feedback do pool */}
          {tabelas.length > 0 && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                gridWarn
                  ? "bg-amber-50 border border-amber-200 text-amber-700"
                  : "bg-blue-50 border border-blue-100 text-blue-700"
              }`}
            >
              {gridWarn || gridLabel}
            </div>
          )}
          {tabelas.length === 0 && (
            <div className="rounded-xl px-4 py-3 text-sm bg-red-50 border border-red-200 text-red-600">
              Selecione pelo menos 1 tabuada.
            </div>
          )}
        </section>
      ) : (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            2. Intervalo de Números
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => { setRangeMax(r.value); setErro(null); }}
                className={`rounded-2xl p-4 text-left border-2 transition-all ${
                  rangeMax === r.value
                    ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className="font-bold text-slate-800 text-sm">{r.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>
          {gridLabel && (
            <div className="mt-3 rounded-xl px-4 py-3 text-sm bg-blue-50 border border-blue-100 text-blue-700">
              {gridLabel}
            </div>
          )}
        </section>
      )}

      {/* Quantidade de cartelas */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          3. Quantidade de Cartelas
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUANTIDADES.map((q) => (
            <button
              key={q}
              onClick={() => setNumCartelas(q)}
              className={`px-5 py-3 rounded-2xl font-bold border-2 transition-all text-sm ${
                numCartelas === q
                  ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
              }`}
            >
              {q} cartelas
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Cada cartela tem um número único. A professora pode pedir "mostrem a cartela #17" para confirmar o vencedor.
        </p>
      </section>

      {/* Destaque diferencial */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-5 py-4">
        <p className="text-blue-800 text-sm font-bold mb-1">
          🏆 Isso o ChatGPT não consegue fazer
        </p>
        <p className="text-blue-600 text-xs leading-relaxed">
          Gerar {numCartelas} cartelas únicas e matematicamente válidas ao mesmo tempo exige algoritmo —
          não é texto. Cada cartela usa seleção aleatória diferente do mesmo pool de valores.
          O PDF já vem com a <strong>folha de chamadas do professor</strong> na última página.
        </p>
      </div>

      {/* Resumo do PDF */}
      {podeGerar && (
        <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4">
          <p className="text-slate-700 text-sm font-semibold mb-2">O PDF terá:</p>
          <ul className="text-slate-500 text-xs space-y-1">
            <li>✓ {numCartelas} cartelas únicas (grade {gridSize}×{gridSize})</li>
            <li>✓ Cada cartela numerada e com linha de nome</li>
            <li>✓ Casinha "LIVRE" no centro{gridSize !== 4 ? "" : " (grade par, sem LIVRE)"}</li>
            <li>✓ Folha de chamadas do professor (última página) com colunas para marcar</li>
            {tipo === "tabuada" && (
              <li>✓ Chamadas com expressão + resultado (ex: 4 × 7 = 28)</li>
            )}
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
            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-200"
        }`}
      >
        {gerando
          ? `Gerando ${numCartelas} cartelas únicas…`
          : `⬇ Gerar ${numCartelas} Cartelas + Folha do Professor`}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Cartelas únicas garantidas · folha de chamadas incluída · BNCC alinhado · pronto para imprimir
      </p>
    </div>
  );
}
