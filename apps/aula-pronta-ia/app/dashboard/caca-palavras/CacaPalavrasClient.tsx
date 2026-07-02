"use client";

import { useState } from "react";
import type { CacaData } from "@/lib/caca-palavras/gerador";

const TEMAS = [
  { id: "animais",     label: "Animais",         emoji: "🐶", cor: "from-amber-400 to-orange-500" },
  { id: "frutas",      label: "Frutas",           emoji: "🍓", cor: "from-red-400 to-pink-500" },
  { id: "escola",      label: "Escola",           emoji: "✏️", cor: "from-blue-400 to-indigo-500" },
  { id: "familia",     label: "Família",          emoji: "👨‍👩‍👧", cor: "from-purple-400 to-violet-500" },
  { id: "profissoes",  label: "Profissões",       emoji: "👩‍⚕️", cor: "from-teal-400 to-cyan-500" },
  { id: "natureza",    label: "Natureza",         emoji: "🌿", cor: "from-green-400 to-emerald-500" },
  { id: "cores",       label: "Cores e Arte",     emoji: "🎨", cor: "from-pink-400 to-rose-500" },
  { id: "corpo",       label: "Corpo Humano",     emoji: "🧍", cor: "from-orange-400 to-red-500" },
  { id: "datas",       label: "Datas Especiais",  emoji: "🎉", cor: "from-yellow-400 to-amber-500" },
  { id: "transportes", label: "Transportes",      emoji: "🚌", cor: "from-sky-400 to-blue-500" },
];

const FAIXAS = [
  { value: "4-6", label: "4 a 6 anos", desc: "Grade 10×10 · horizontal e vertical" },
  { value: "7-9", label: "7 a 9 anos", desc: "Grade 12×12 · inclui diagonal" },
  { value: "10+", label: "10+ anos",   desc: "Grade 15×15 · todas as direções" },
];

function PreviewGrid({ dados, gabarito }: { dados: CacaData; gabarito: boolean }) {
  const wordCells = new Set(
    gabarito
      ? dados.colocadas.flatMap((p) => p.celulas.map(([r, c]) => `${r},${c}`))
      : []
  );
  const cs = dados.faixaEtaria === "4-6" ? 28 : dados.faixaEtaria === "7-9" ? 24 : 19;

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse mx-auto" style={{ fontSize: cs * 0.42 }}>
        <tbody>
          {dados.grid.map((linha, r) => (
            <tr key={r}>
              {linha.map((letra, c) => {
                const isWord = wordCells.has(`${r},${c}`);
                return (
                  <td
                    key={c}
                    style={{ width: cs, height: cs }}
                    className={`border border-slate-200 text-center font-bold select-none ${
                      isWord ? "bg-amber-200 text-amber-900" : "bg-white text-slate-700"
                    }`}
                  >
                    {letra}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CacaPalavrasClient() {
  const [tema, setTema] = useState<string | null>(null);
  const [faixaEtaria, setFaixaEtaria] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const [gabarito, setGabarito] = useState(false);
  const [resultado, setResultado] = useState<CacaData | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const temaAtual = TEMAS.find((t) => t.id === tema);

  async function handleGerar() {
    if (!tema || !faixaEtaria) return;
    setGerando(true);
    setGabarito(false);
    setErro(null);
    try {
      const res = await fetch("/api/gerar-caca-palavras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, faixaEtaria }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? "Erro ao gerar.");
        return;
      }
      setResultado(data as CacaData);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setGerando(false);
    }
  }

  async function handleBaixarPDF() {
    if (!resultado) return;
    setBaixando(true);
    try {
      const res = await fetch("/api/caca-palavras-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultado),
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
      a.download = `caca-palavras-${tema}.pdf`;
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
        <h1 className="text-2xl font-bold text-slate-800">Caça-palavras</h1>
        <p className="text-slate-500 text-sm mt-1">
          A IA escolhe as palavras por tema e monta a grade — PDF com gabarito incluso.
        </p>
      </div>

      {/* Tema */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Tema
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TEMAS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTema(t.id); setResultado(null); setErro(null); }}
              className={`rounded-2xl p-3 text-left border-2 transition-all flex items-center gap-3 ${
                tema === t.id
                  ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="font-semibold text-slate-700 text-sm">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Faixa etária */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          2. Faixa Etária
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FAIXAS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFaixaEtaria(f.value); setResultado(null); setErro(null); }}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                faixaEtaria === f.value
                  ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="font-bold text-slate-800 block mb-0.5">{f.label}</span>
              <span className="text-slate-400 text-xs">{f.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Botão gerar (estado inicial) */}
      {tema && faixaEtaria && !resultado && (
        <section className="mb-8">
          {erro && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}
          <button
            onClick={handleGerar}
            disabled={gerando}
            className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
              gerando
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : `bg-gradient-to-r ${temaAtual?.cor ?? "from-green-500 to-emerald-600"} hover:opacity-90 shadow-lg`
            }`}
          >
            {gerando ? "⏳ Gerando caça-palavras…" : "✨ Gerar Caça-palavras"}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            A IA cria as palavras e monta a grade em alguns segundos
          </p>
        </section>
      )}

      {/* Preview */}
      {resultado && (
        <>
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                3. Pré-visualização
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setGabarito((v) => !v)}
                  className="text-xs text-emerald-600 hover:underline font-medium"
                >
                  {gabarito ? "Ocultar gabarito" : "Ver gabarito"}
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={handleGerar}
                  disabled={gerando}
                  className="text-xs text-slate-500 hover:underline font-medium disabled:opacity-50"
                >
                  {gerando ? "⏳ Gerando…" : "🔄 Gerar novo"}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <PreviewGrid dados={resultado} gabarito={gabarito} />
            </div>

            {/* Lista de palavras */}
            <div className="flex flex-wrap gap-2 justify-center">
              {resultado.colocadas.map(({ original }) => (
                <span
                  key={original}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700"
                >
                  {original.toUpperCase()}
                </span>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              {resultado.colocadas.length} palavras · grade {resultado.linhas}×{resultado.colunas}
            </p>
          </section>

          {erro && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          <button
            onClick={handleBaixarPDF}
            disabled={baixando}
            className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
              baixando
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : `bg-gradient-to-r ${temaAtual?.cor ?? "from-green-500 to-emerald-600"} hover:opacity-90 shadow-lg`
            }`}
          >
            {baixando ? "Gerando PDF…" : "⬇ Baixar PDF + Gabarito"}
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            PDF com 2 páginas: folha do aluno + gabarito · BNCC por faixa etária
          </p>
        </>
      )}
    </div>
  );
}
