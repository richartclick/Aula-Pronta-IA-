"use client";

import { useState } from "react";
import type { GridData, PalavraColocada } from "@/lib/palavras-cruzadas/gerador";

type ResultadoAPI = GridData & { temaLabel: string };

const TEMAS = [
  { id: "animais",    label: "Animais",       emoji: "🐶", cor: "from-amber-400 to-orange-500" },
  { id: "frutas",     label: "Frutas",         emoji: "🍓", cor: "from-red-400 to-pink-500" },
  { id: "escola",     label: "Escola",         emoji: "✏️", cor: "from-blue-400 to-indigo-500" },
  { id: "familia",    label: "Família",        emoji: "👨‍👩‍👧", cor: "from-purple-400 to-violet-500" },
  { id: "profissoes", label: "Profissões",     emoji: "👩‍⚕️", cor: "from-teal-400 to-cyan-500" },
  { id: "natureza",   label: "Natureza",       emoji: "🌿", cor: "from-green-400 to-emerald-500" },
  { id: "cores",      label: "Cores e Arte",   emoji: "🎨", cor: "from-pink-400 to-rose-500" },
  { id: "corpo",      label: "Corpo Humano",   emoji: "🧍", cor: "from-orange-400 to-red-500" },
  { id: "datas",      label: "Datas Especiais",emoji: "🎉", cor: "from-yellow-400 to-amber-500" },
  { id: "transportes",label: "Transportes",    emoji: "🚌", cor: "from-sky-400 to-blue-500" },
];

const FAIXAS = [
  { value: "4-6",  label: "4 a 6 anos", desc: "Palavras curtas, 3–5 letras" },
  { value: "7-9",  label: "7 a 9 anos", desc: "Palavras médias, 4–7 letras" },
  { value: "10+",  label: "10+ anos",   desc: "Palavras longas, 5–9 letras" },
];

// Pré-visualização HTML do grid (sem PDF)
function PreviewGrid({
  grid,
  colocadas,
  limites,
}: {
  grid: GridData["grid"];
  colocadas: PalavraColocada[];
  limites: GridData["limites"];
}) {
  const { minLinha, maxLinha, minCol, maxCol } = limites;
  const rows = maxLinha - minLinha + 1;
  const cols = maxCol - minCol + 1;

  const numMap = new Map<string, number>();
  for (const w of colocadas) {
    numMap.set(`${w.linha},${w.coluna}`, w.numero);
  }

  const CELL = 28; // px

  return (
    <div
      className="border border-slate-200 rounded-xl overflow-hidden inline-block shadow-sm"
      style={{ lineHeight: 0 }}
    >
      {Array.from({ length: rows }, (_, ri) => (
        <div key={ri} className="flex" style={{ height: CELL }}>
          {Array.from({ length: cols }, (_, ci) => {
            const gridR = ri + minLinha;
            const gridC = ci + minCol;
            const cell = grid[gridR]?.[gridC];
            const ativa = cell?.letra != null;
            const num = numMap.get(`${gridR},${gridC}`);

            return ativa ? (
              <div
                key={ci}
                className="relative bg-white border border-slate-300 flex-shrink-0"
                style={{ width: CELL, height: CELL }}
              >
                {num !== undefined && (
                  <span className="absolute top-0.5 left-0.5 text-[8px] leading-none text-slate-400 select-none">
                    {num}
                  </span>
                )}
              </div>
            ) : (
              <div
                key={ci}
                className="bg-slate-900 flex-shrink-0"
                style={{ width: CELL, height: CELL }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ListaPistas({ colocadas }: { colocadas: PalavraColocada[] }) {
  const h = colocadas.filter((w) => w.direcao === "horizontal").sort((a, b) => a.numero - b.numero);
  const v = colocadas.filter((w) => w.direcao === "vertical").sort((a, b) => a.numero - b.numero);
  return (
    <div className="grid grid-cols-2 gap-6 text-sm mt-4">
      <div>
        <p className="font-bold text-slate-600 mb-2 text-xs uppercase tracking-wide">→ Horizontal</p>
        {h.map((w) => (
          <p key={w.numero} className="text-slate-600 mb-1 leading-snug">
            <span className="font-bold text-slate-800">{w.numero}.</span> {w.pista}
          </p>
        ))}
      </div>
      <div>
        <p className="font-bold text-slate-600 mb-2 text-xs uppercase tracking-wide">↓ Vertical</p>
        {v.map((w) => (
          <p key={w.numero} className="text-slate-600 mb-1 leading-snug">
            <span className="font-bold text-slate-800">{w.numero}.</span> {w.pista}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function PalavrasCruzadasClient() {
  const [tema, setTema] = useState<string | null>(null);
  const [faixaEtaria, setFaixaEtaria] = useState<string | null>(null);
  const [estado, setEstado] = useState<"idle" | "gerando" | "pronto">("idle");
  const [baixando, setBaixando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAPI | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function handleGerar() {
    if (!tema || !faixaEtaria) return;
    setEstado("gerando");
    setErro(null);
    setResultado(null);
    try {
      const res = await fetch("/api/gerar-palavras-cruzadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, faixaEtaria }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? "Erro ao gerar.");
        setEstado("idle");
        return;
      }
      setResultado(data as ResultadoAPI);
      setEstado("pronto");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setEstado("idle");
    }
  }

  async function handleBaixarPDF() {
    if (!resultado) return;
    setBaixando(true);
    try {
      const res = await fetch("/api/palavras-cruzadas-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultado),
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
      a.download = `cruzadinha-${tema}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  function handleNovaGeracao() {
    setResultado(null);
    setEstado("idle");
    setErro(null);
  }

  const temaAtual = TEMAS.find((t) => t.id === tema);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Palavras Cruzadas</h1>
        <p className="text-slate-500 text-sm mt-1">
          A IA cria palavras e pistas no tema escolhido — PDF com gabarito incluso.
        </p>
      </div>

      {estado !== "pronto" && (
        <>
          {/* Tema */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              1. Escolha o tema
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TEMAS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTema(t.id); setErro(null); }}
                  className={`rounded-2xl p-4 text-left border-2 transition-all ${
                    tema === t.id
                      ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <span className="text-2xl block mb-1">{t.emoji}</span>
                  <span className="font-semibold text-slate-800 text-sm">{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Faixa etária */}
          {tema && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                2. Faixa etária
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FAIXAS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setFaixaEtaria(f.value); setErro(null); }}
                    className={`rounded-2xl p-4 text-left border-2 transition-all ${
                      faixaEtaria === f.value
                        ? "border-pink-500 bg-pink-50 shadow-md shadow-pink-100"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <span className="font-bold text-slate-800 block">{f.label}</span>
                    <span className="text-slate-400 text-xs">{f.desc}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Erro */}
          {erro && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          {/* Botão gerar */}
          {tema && faixaEtaria && (
            <button
              onClick={handleGerar}
              disabled={estado === "gerando"}
              className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
                estado === "gerando"
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : `bg-gradient-to-r ${temaAtual?.cor ?? "from-indigo-500 to-purple-600"} hover:opacity-90 shadow-lg`
              }`}
            >
              {estado === "gerando"
                ? "✨ Gerando cruzadinha com IA…"
                : `✨ Gerar Palavras Cruzadas — ${temaAtual?.label}`}
            </button>
          )}

          {estado === "gerando" && (
            <p className="text-center text-xs text-slate-400 mt-3 animate-pulse">
              A IA está criando as palavras e montando o jogo… aguarde alguns segundos
            </p>
          )}
        </>
      )}

      {/* Preview do resultado */}
      {estado === "pronto" && resultado && (
        <div>
          {/* Info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-800">
                {temaAtual?.emoji} {resultado.temaLabel} · {resultado.faixaEtaria} anos
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {resultado.colocadas.length} palavras encaixadas
              </p>
            </div>
            <button
              onClick={handleNovaGeracao}
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              ↩ Trocar tema
            </button>
          </div>

          {/* Grid preview */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 overflow-auto">
            <PreviewGrid
              grid={resultado.grid}
              colocadas={resultado.colocadas}
              limites={resultado.limites}
            />
          </div>

          {/* Pistas */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 shadow-sm">
            <ListaPistas colocadas={resultado.colocadas} />
          </div>

          {/* Erro */}
          {erro && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={handleGerar}
              disabled={baixando}
              className="flex-1 py-3 rounded-2xl font-semibold text-indigo-700 border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-all text-sm"
            >
              🔄 Gerar novamente
            </button>
            <button
              onClick={handleBaixarPDF}
              disabled={baixando}
              className={`flex-1 py-3 rounded-2xl font-bold text-white transition-all ${
                baixando
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : `bg-gradient-to-r ${temaAtual?.cor ?? "from-indigo-500 to-purple-600"} hover:opacity-90 shadow-lg`
              }`}
            >
              {baixando ? "Gerando PDF…" : "⬇ Baixar PDF + Gabarito"}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            PDF com 2 páginas: folha do aluno + gabarito · BNCC EF01LP07
          </p>
        </div>
      )}
    </div>
  );
}
