"use client";

import { useState } from "react";
import {
  FAIXAS_CALIGRAFIA,
  LETRAS_MAIUSCULAS,
  LETRAS_MINUSCULAS,
  NUMEROS_CAL,
  type TipoCaligrafia,
} from "@/lib/caligrafia/tipos";

type TipoOpcao = {
  value: TipoCaligrafia;
  emoji: string;
  label: string;
  desc: string;
  cor: string;
};

const TIPOS: TipoOpcao[] = [
  { value: "ambas",      emoji: "Aa", label: "Maiúscula e Minúscula", desc: "A e a juntas na mesma folha", cor: "from-indigo-500 to-purple-600" },
  { value: "maiusculas", emoji: "A",  label: "Somente Maiúsculas",    desc: "A B C D …", cor: "from-blue-500 to-indigo-600" },
  { value: "minusculas", emoji: "a",  label: "Somente Minúsculas",    desc: "a b c d …", cor: "from-cyan-500 to-blue-600" },
  { value: "numeros",    emoji: "1",  label: "Números",               desc: "0 1 2 3 … 9", cor: "from-emerald-500 to-teal-600" },
  { value: "palavras",   emoji: "✏️", label: "Palavras / Frases",     desc: "Digite as palavras que deseja", cor: "from-pink-500 to-rose-600" },
];

// Letras iniciais para seleção
function letrasDeTipo(tipo: TipoCaligrafia): string[] {
  if (tipo === "maiusculas" || tipo === "ambas") return LETRAS_MAIUSCULAS;
  if (tipo === "minusculas") return LETRAS_MINUSCULAS;
  if (tipo === "numeros") return NUMEROS_CAL;
  return [];
}

export default function CaligrafiaClient() {
  const [tipo, setTipo] = useState<TipoCaligrafia | null>(null);
  const [faixaEtaria, setFaixaEtaria] = useState<string | null>(null);
  const [letrasEscolhidas, setLetrasEscolhidas] = useState<string[]>([]);
  const [palavrasTexto, setPalavrasTexto] = useState("");
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function selecionarTipo(t: TipoCaligrafia) {
    setTipo(t);
    setLetrasEscolhidas(letrasDeTipo(t)); // default: todas selecionadas
    setErro(null);
  }

  function toggleLetra(l: string) {
    setLetrasEscolhidas((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  }

  function selecionarTodas() {
    if (tipo) setLetrasEscolhidas(letrasDeTipo(tipo));
  }

  function limparSelecao() {
    setLetrasEscolhidas([]);
  }

  async function handleBaixar() {
    if (!tipo || !faixaEtaria) return;
    if (tipo !== "palavras" && letrasEscolhidas.length === 0) {
      setErro("Selecione ao menos uma letra.");
      return;
    }
    const palavras = palavrasTexto
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    if (tipo === "palavras" && palavras.length === 0) {
      setErro("Digite ao menos uma palavra.");
      return;
    }

    setBaixando(true);
    setErro(null);

    try {
      const res = await fetch("/api/caligrafia-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, faixaEtaria, letras: letrasEscolhidas, palavras }),
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
      a.download = `caligrafia-${tipo}-${faixaEtaria}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  const tipoAtual = TIPOS.find((t) => t.value === tipo);
  const disponivelParaBaixar =
    tipo &&
    faixaEtaria &&
    (tipo === "palavras"
      ? palavrasTexto.trim().length > 0
      : letrasEscolhidas.length > 0);

  const todasDeTipo = tipo ? letrasDeTipo(tipo) : [];
  const todasSelecionadas =
    todasDeTipo.length > 0 &&
    todasDeTipo.every((l) => letrasEscolhidas.includes(l));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Caligrafia</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gere folhas de treino de escrita prontas para imprimir — sem custo de IA.
        </p>
      </div>

      {/* Passo 1 — Tipo */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. O que deseja praticar?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              onClick={() => selecionarTipo(t.value)}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                tipo === t.value
                  ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <span className="text-2xl font-black text-slate-700 block mb-1">{t.emoji}</span>
              <span className="font-semibold text-slate-800 text-sm block">{t.label}</span>
              <span className="text-slate-400 text-xs">{t.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Passo 2 — Faixa etária */}
      {tipo && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            2. Faixa etária
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FAIXAS_CALIGRAFIA.map((f) => (
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

      {/* Passo 3a — Seleção de letras / números */}
      {tipo && tipo !== "palavras" && faixaEtaria && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              3. Quais {tipo === "numeros" ? "números" : "letras"}?
            </h2>
            <div className="flex gap-2 text-xs">
              {!todasSelecionadas && (
                <button onClick={selecionarTodas} className="text-indigo-600 hover:underline font-medium">
                  Selecionar todas
                </button>
              )}
              {letrasEscolhidas.length > 0 && (
                <button onClick={limparSelecao} className="text-slate-400 hover:underline">
                  Limpar
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {todasDeTipo.map((l) => {
              const sel = letrasEscolhidas.includes(l);
              return (
                <button
                  key={l}
                  onClick={() => toggleLetra(l)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all ${
                    sel
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
          {letrasEscolhidas.length > 0 && (
            <p className="text-xs text-slate-400 mt-2">
              {letrasEscolhidas.length} {tipo === "numeros" ? "número(s)" : "letra(s)"} selecionada(s) ·{" "}
              {letrasEscolhidas.length} {letrasEscolhidas.length === 1 ? "página" : "páginas"} no PDF
            </p>
          )}
        </section>
      )}

      {/* Passo 3b — Palavras */}
      {tipo === "palavras" && faixaEtaria && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            3. Digite as palavras (uma por linha)
          </h2>
          <textarea
            value={palavrasTexto}
            onChange={(e) => { setPalavrasTexto(e.target.value); setErro(null); }}
            placeholder={"GATO\nCASA\nESCOLA\nBORBOLETA"}
            rows={6}
            className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-mono text-slate-700 focus:outline-none focus:border-indigo-400 resize-none"
          />
          {palavrasTexto.trim() && (
            <p className="text-xs text-slate-400 mt-1">
              {palavrasTexto.split("\n").filter((l) => l.trim()).length} palavra(s) · uma página por palavra
            </p>
          )}
        </section>
      )}

      {/* Erro */}
      {erro && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Botão baixar */}
      {tipo && faixaEtaria && (
        <button
          onClick={handleBaixar}
          disabled={!disponivelParaBaixar || baixando}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
            disponivelParaBaixar && !baixando
              ? `bg-gradient-to-r ${tipoAtual?.cor ?? "from-indigo-500 to-purple-600"} hover:opacity-90 shadow-lg`
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {baixando ? "Gerando PDF…" : "⬇ Baixar PDF de Caligrafia"}
        </button>
      )}

      {/* Dica */}
      <p className="text-center text-xs text-slate-400 mt-4">
        PDF pronto para imprimir · sem custo extra · alinhado à BNCC
      </p>
    </div>
  );
}
