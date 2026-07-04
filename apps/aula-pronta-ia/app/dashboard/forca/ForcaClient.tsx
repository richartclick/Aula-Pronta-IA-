"use client";

import { useState } from "react";
import { TEMAS_FORCA, FAIXAS_FORCA } from "@/lib/forca/config";

const QTDS = [
  { value: 1, label: "1 palavra", desc: "1 página" },
  { value: 2, label: "2 palavras", desc: "1 página" },
  { value: 4, label: "4 palavras", desc: "2 páginas" },
];

export default function ForcaClient() {
  const [temaId, setTemaId] = useState<string | null>(null);
  const [faixaId, setFaixaId] = useState<string | null>(null);
  const [numPalavras, setNumPalavras] = useState(2);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const faixaAtual = FAIXAS_FORCA.find((f) => f.id === faixaId);
  const temaAtual = TEMAS_FORCA.find((t) => t.id === temaId);
  const podeGerar = !!temaId && !!faixaId && !gerando;

  async function handleGerar() {
    if (!podeGerar) return;
    setGerando(true);
    setErro(null);
    try {
      const res = await fetch("/api/forca-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temaId, faixaId, numPalavras }),
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
      a.download = `forca-${temaId}.pdf`;
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
        <h1 className="text-2xl font-bold text-slate-800">Forca Temático</h1>
        <p className="text-slate-500 text-sm mt-1">
          A IA escolhe palavras por tema — cada geração é diferente, com forca, alfabeto e dica impressos.
        </p>
      </div>

      {/* Tema */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Tema
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TEMAS_FORCA.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTemaId(t.id); setErro(null); }}
              className={`rounded-2xl p-3 text-center border-2 transition-all ${
                temaId === t.id
                  ? "border-rose-400 bg-rose-50 shadow-md shadow-rose-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-2xl block mb-1">{t.emoji}</span>
              <span className="text-xs font-semibold text-slate-700 leading-tight">{t.label}</span>
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
          {FAIXAS_FORCA.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFaixaId(f.id); setErro(null); }}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                faixaId === f.id
                  ? "border-rose-400 bg-rose-50 shadow-md shadow-rose-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-2xl">{f.emoji}</span>
              <p className="font-bold text-slate-800 mt-2">{f.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Palavras de {f.lengthMin}–{f.lengthMax} letras
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Quantidade */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          3. Quantidade de Palavras
        </h2>
        <div className="flex gap-3 flex-wrap">
          {QTDS.map((q) => (
            <button
              key={q.value}
              onClick={() => setNumPalavras(q.value)}
              className={`px-5 py-3 rounded-2xl font-bold border-2 transition-all text-sm ${
                numPalavras === q.value
                  ? "border-rose-400 bg-rose-50 text-rose-700 shadow-md shadow-rose-100"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {q.label}
              <span className="block text-[10px] font-normal opacity-70">{q.desc}</span>
            </button>
          ))}
        </div>

        {temaAtual && faixaAtual && (
          <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-slate-600 text-sm">
              <span className="font-bold">{numPalavras} palavra{numPalavras > 1 ? "s" : ""}</span>
              {" "}sobre <span className="font-bold">{temaAtual.label}</span>
              {" "}para <span className="font-bold">{faixaAtual.label}</span>
              {" "}({faixaAtual.lengthMin}–{faixaAtual.lengthMax} letras) + gabarito
            </p>
          </div>
        )}
      </section>

      {/* Destaque IA */}
      <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-4">
        <p className="text-rose-800 text-sm font-semibold mb-1">🤖 Palavra diferente a cada geração</p>
        <p className="text-rose-600 text-xs leading-relaxed">
          A IA escolhe uma palavra adequada ao tema e à faixa etária. O PDF já vem com o gabarito
          separado, o alfabeto para riscar e a dica impressa — pronto para usar em sala.
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
        onClick={handleGerar}
        disabled={!podeGerar}
        className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
          !podeGerar
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-gradient-to-r from-rose-400 to-pink-500 hover:opacity-90 shadow-lg shadow-rose-200"
        }`}
      >
        {gerando ? "A IA está escolhendo palavras…" : "⬇ Gerar e Baixar PDF"}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Palavra única por geração · forca + alfabeto + dica impressos · gabarito separado · BNCC alinhado
      </p>
    </div>
  );
}
