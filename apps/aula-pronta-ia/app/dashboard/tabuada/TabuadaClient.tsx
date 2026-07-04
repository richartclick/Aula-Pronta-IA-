"use client";

import { useState } from "react";
import { POR_PAGINA, TIPO_LABELS, tabelasLabel, type TipoDesafio } from "@/lib/tabuada/gerador";

const TABELAS_OPTS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const TIPOS: { id: TipoDesafio; label: string; ex: string }[] = [
  { id: "resultado", label: "Resultado faltando", ex: "3 × 4 = ___" },
  { id: "fator", label: "Fator faltando", ex: "___ × 4 = 12" },
  { id: "misto", label: "Misto", ex: "todos os tipos" },
];
const PAGINAS_OPTS = [1, 2, 3];

export default function TabuadaClient() {
  const [tabelas, setTabelas] = useState<number[]>([]);
  const [tipo, setTipo] = useState<TipoDesafio>("resultado");
  const [numPaginas, setNumPaginas] = useState(1);
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const todasMarcadas = tabelas.length === TABELAS_OPTS.length;

  function toggleTabela(t: number) {
    setTabelas((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
    setErro(null);
  }

  function toggleTodas() {
    setTabelas(todasMarcadas ? [] : [...TABELAS_OPTS]);
    setErro(null);
  }

  const tabelasFinal = tabelas.length > 0 ? tabelas : TABELAS_OPTS;
  const totalDesafios = numPaginas * POR_PAGINA;

  async function handleBaixar() {
    setBaixando(true);
    setErro(null);
    try {
      const res = await fetch("/api/tabuada-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabelas: tabelasFinal, tipo, numPaginas }),
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
      a.download = "tabuada-desafio.pdf";
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Tabuada com Desafio</h1>
        <p className="text-slate-500 text-sm mt-1">
          Atividades de multiplicação com lacunas — sem IA, geração instantânea, gabarito incluído.
        </p>
      </div>

      {/* Tabuadas */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Quais Tabuadas?
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={toggleTodas}
            className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
              todasMarcadas
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            Todas
          </button>
          {TABELAS_OPTS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTabela(t)}
              className={`w-12 h-10 rounded-xl font-bold text-sm border-2 transition-all ${
                tabelas.includes(t)
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              ×{t}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          {tabelas.length === 0
            ? "Nenhuma selecionada — todas serão usadas"
            : tabelasLabel(tabelas)}
        </p>
      </section>

      {/* Tipo */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          2. Tipo de Desafio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIPOS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTipo(t.id)}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                tipo === t.id
                  ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="font-bold text-slate-800 text-sm mb-1">{t.label}</p>
              <p className="font-mono text-xs text-slate-500 bg-slate-100 rounded px-2 py-1">
                {t.ex}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Quantidade */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          3. Quantidade de Folhas
        </h2>
        <div className="flex gap-3 flex-wrap">
          {PAGINAS_OPTS.map((p) => (
            <button
              key={p}
              onClick={() => setNumPaginas(p)}
              className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all text-sm ${
                numPaginas === p
                  ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md shadow-orange-100"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {p} folha{p > 1 ? "s" : ""}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
          <p className="text-slate-600 text-sm">
            <span className="font-bold">{numPaginas} folha{numPaginas > 1 ? "s" : ""}</span>
            {" "}×{" "}
            <span className="font-bold">{POR_PAGINA} desafios</span>
            {" "}={" "}
            <span className="font-bold text-orange-600">{totalDesafios} desafios únicos</span>
            {" "}+ {numPaginas} gabarito{numPaginas > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Preview */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Exemplo de desafio
        </h2>
        <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-3">
          {tipo === "resultado" && (
            <>
              <span className="font-mono font-bold text-slate-700 bg-slate-200 rounded-lg px-3 py-2">7</span>
              <span className="font-bold text-slate-400 text-lg">×</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-200 rounded-lg px-3 py-2">8</span>
              <span className="font-bold text-slate-400 text-lg">=</span>
              <span className="font-mono font-bold text-slate-300 bg-white border-2 border-slate-700 rounded-lg px-3 py-2 min-w-[44px] text-center">___</span>
            </>
          )}
          {tipo === "fator" && (
            <>
              <span className="font-mono font-bold text-slate-300 bg-white border-2 border-slate-700 rounded-lg px-3 py-2 min-w-[44px] text-center">___</span>
              <span className="font-bold text-slate-400 text-lg">×</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-200 rounded-lg px-3 py-2">8</span>
              <span className="font-bold text-slate-400 text-lg">=</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-200 rounded-lg px-3 py-2">56</span>
            </>
          )}
          {tipo === "misto" && (
            <>
              <span className="font-mono font-bold text-slate-700 bg-slate-200 rounded-lg px-3 py-2">7</span>
              <span className="font-bold text-slate-400 text-lg">×</span>
              <span className="font-mono font-bold text-slate-300 bg-white border-2 border-slate-700 rounded-lg px-3 py-2 min-w-[44px] text-center">___</span>
              <span className="font-bold text-slate-400 text-lg">=</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-200 rounded-lg px-3 py-2">56</span>
            </>
          )}
          <span className="text-slate-400 text-xs ml-2">(lacuna para preencher)</span>
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
        disabled={baixando}
        className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
          baixando
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-400 to-rose-500 hover:opacity-90 shadow-lg shadow-orange-200"
        }`}
      >
        {baixando ? "Gerando PDF…" : "⬇ Baixar PDF"}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Geração instantânea · sem IA · {POR_PAGINA} desafios por folha · lacunas variadas · gabarito incluído
      </p>
    </div>
  );
}
