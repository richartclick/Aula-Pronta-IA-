"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { GridData, PalavraColocada } from "@/lib/palavras-cruzadas/gerador";

const STORAGE_KEY = "demo_cruzadinha_usada";

type ResultadoAPI = GridData & { temaLabel: string; faixaEtaria: string };

const TEMAS = [
  { id: "animais",     label: "Animais",        emoji: "🐶", cor: "from-amber-400 to-orange-500" },
  { id: "frutas",      label: "Frutas",          emoji: "🍓", cor: "from-red-400 to-pink-500" },
  { id: "escola",      label: "Escola",          emoji: "✏️", cor: "from-blue-400 to-indigo-500" },
  { id: "natureza",    label: "Natureza",        emoji: "🌿", cor: "from-green-400 to-emerald-500" },
  { id: "transportes", label: "Transportes",     emoji: "🚌", cor: "from-sky-400 to-blue-500" },
  { id: "familia",     label: "Família",         emoji: "👨‍👩‍👧", cor: "from-purple-400 to-violet-500" },
];

const FAIXAS = [
  { value: "4-6", label: "4 a 6 anos",  desc: "Palavras simples, 3–5 letras" },
  { value: "7-9", label: "7 a 9 anos",  desc: "Palavras médias, 4–7 letras" },
  { value: "10+", label: "10+ anos",    desc: "Palavras longas, 5–9 letras" },
];

// ── Preview do grid ────────────────────────────────────────────────────────────

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
  for (const w of colocadas) numMap.set(`${w.linha},${w.coluna}`, w.numero);

  const CELL = 26;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden inline-block shadow-sm" style={{ lineHeight: 0 }}>
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
                  <span className="absolute top-0.5 left-0.5 text-[8px] leading-none text-slate-400 select-none">{num}</span>
                )}
              </div>
            ) : (
              <div key={ci} className="bg-slate-900 flex-shrink-0" style={{ width: CELL, height: CELL }} />
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
    <div className="grid grid-cols-2 gap-6 text-sm">
      <div>
        <p className="font-bold text-slate-500 mb-2 text-xs uppercase tracking-wide">→ Horizontal</p>
        {h.map((w) => (
          <p key={w.numero} className="text-slate-600 mb-1 leading-snug">
            <span className="font-bold text-slate-800">{w.numero}.</span> {w.pista}
          </p>
        ))}
      </div>
      <div>
        <p className="font-bold text-slate-500 mb-2 text-xs uppercase tracking-wide">↓ Vertical</p>
        {v.map((w) => (
          <p key={w.numero} className="text-slate-600 mb-1 leading-snug">
            <span className="font-bold text-slate-800">{w.numero}.</span> {w.pista}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Tela de limite atingido ────────────────────────────────────────────────────

function LimiteDemoAtingido() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-black text-slate-900 text-lg">Aula Pronta IA</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-3xl">
            <span className="text-4xl">🧩</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Você já usou sua atividade gratuita!</h1>
          <p className="text-slate-500">Crie sua conta para continuar gerando Palavras Cruzadas e mais 14 tipos de atividades — 5 por mês, grátis.</p>
          <Link
            href="/registro"
            className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 px-8 rounded-2xl text-lg hover:opacity-90 transition-opacity shadow-xl shadow-indigo-200"
          >
            Criar conta grátis →
          </Link>
          <p className="text-slate-400 text-xs">Sem cartão · 5 atividades/mês grátis · Cancele quando quiser</p>
        </div>
      </div>
    </div>
  );
}

// ── Demo principal ─────────────────────────────────────────────────────────────

export default function DemoClient() {
  const [jaUsou, setJaUsou] = useState(false);
  const [tema, setTema] = useState<string | null>(null);
  const [faixaEtaria, setFaixaEtaria] = useState<string | null>(null);
  const [estado, setEstado] = useState<"idle" | "gerando" | "pronto">("idle");
  const [baixando, setBaixando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAPI | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) setJaUsou(true);
  }, []);

  if (jaUsou && estado !== "pronto") return <LimiteDemoAtingido />;

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
        setErro((data as { error?: string }).error ?? "Erro ao gerar. Tente novamente.");
        setEstado("idle");
        return;
      }
      setResultado(data as ResultadoAPI);
      setEstado("pronto");
      localStorage.setItem(STORAGE_KEY, "1");
      setJaUsou(true);
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
      a.download = `cruzadinha-${tema}-demo.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  const temaAtual = TEMAS.find((t) => t.id === tema);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-black text-slate-900 text-lg">Aula Pronta IA</Link>
        <Link href="/registro" className="text-sm text-indigo-600 font-semibold hover:underline">
          Criar conta grátis →
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10 pb-20">

        {/* Formulário */}
        {estado !== "pronto" && (
          <>
            <div className="text-center mb-8">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                ✓ Sem senha · Sem cartão
              </span>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Gere sua Palavras Cruzadas grátis</h1>
              <p className="text-slate-500 text-base">Escolha o tema, a faixa etária e receba o PDF em segundos.</p>
            </div>

            {/* Temas */}
            <section className="mb-7">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">1. Escolha o tema</p>
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
              <section className="mb-7">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">2. Faixa etária</p>
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
              <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            {/* Botão gerar */}
            {tema && faixaEtaria && (
              <>
                <button
                  onClick={handleGerar}
                  disabled={estado === "gerando"}
                  className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                    estado === "gerando"
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : `bg-gradient-to-r ${temaAtual?.cor ?? "from-indigo-500 to-purple-600"} hover:opacity-90 shadow-indigo-200`
                  }`}
                >
                  {estado === "gerando" ? (
                    <>
                      <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                      Gerando com IA… (15–30 seg)
                    </>
                  ) : (
                    `✨ Gerar Palavras Cruzadas — ${temaAtual?.label}`
                  )}
                </button>
                {estado === "gerando" && (
                  <p className="text-center text-xs text-slate-400 mt-3 animate-pulse">
                    A IA está criando as palavras e montando o jogo…
                  </p>
                )}
                <p className="text-center text-slate-400 text-xs mt-3">
                  Sem cadastro · PDF com gabarito incluso · Alinhado à BNCC
                </p>
              </>
            )}
          </>
        )}

        {/* Resultado */}
        {estado === "pronto" && resultado && (
          <div className="space-y-5">
            {/* Sucesso */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">🧩</div>
                <div>
                  <h1 className="text-xl font-black">Cruzadinha pronta!</h1>
                  <p className="text-indigo-100 text-sm mt-0.5">
                    {temaAtual?.emoji} {resultado.temaLabel} · {resultado.faixaEtaria} anos · {resultado.colocadas.length} palavras
                  </p>
                </div>
              </div>
            </div>

            {/* Grid preview */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm overflow-auto">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preview do jogo</p>
              <div className="flex justify-center">
                <PreviewGrid grid={resultado.grid} colocadas={resultado.colocadas} limites={resultado.limites} />
              </div>
            </div>

            {/* Pistas */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pistas</p>
              <ListaPistas colocadas={resultado.colocadas} />
            </div>

            {/* Erro */}
            {erro && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{erro}</div>
            )}

            {/* Botão PDF */}
            <button
              onClick={handleBaixarPDF}
              disabled={baixando}
              className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                baixando
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : `bg-gradient-to-r ${temaAtual?.cor ?? "from-indigo-500 to-purple-600"} hover:opacity-90 shadow-indigo-200`
              }`}
            >
              {baixando ? (
                <>
                  <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                  Gerando PDF…
                </>
              ) : (
                "⬇ Baixar PDF + Gabarito grátis"
              )}
            </button>
            <p className="text-center text-slate-400 text-xs">PDF com 2 páginas: folha do aluno + gabarito</p>

            {/* CTA criar conta */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 text-white text-center">
              <p className="text-2xl mb-2">🚀</p>
              <h2 className="font-black text-xl mb-1">Gostou? Acesse os outros 14 módulos</h2>
              <p className="text-slate-300 text-sm mb-5">
                Caça-palavras, Bingo, Sudoku, Labirinto, Caligrafia, Forca e muito mais — 5 atividades por mês grátis.
              </p>
              <Link
                href="/registro"
                className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-4 px-8 rounded-2xl text-base hover:opacity-90 transition-opacity shadow-lg shadow-indigo-900"
              >
                Criar conta grátis — 5 atividades/mês →
              </Link>
              <p className="text-slate-500 text-xs mt-3">Sem cartão · Cancele quando quiser</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
