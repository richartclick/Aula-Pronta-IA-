"use client";

import { useState } from "react";

const ANOS = [
  { value: "1", label: "1º ano", sub: "Números até 100 · somar e subtrair" },
  { value: "2", label: "2º ano", sub: "Números até 1.000 · introdução à multiplicação" },
  { value: "3", label: "3º ano", sub: "Tabuada · divisão exata" },
  { value: "4", label: "4º ano", sub: "Números grandes · as 4 operações" },
  { value: "5", label: "5º ano", sub: "Frações simples · problemas complexos" },
];

const OPERACOES = [
  { value: "adição",           label: "Adição",                emoji: "➕" },
  { value: "subtração",        label: "Subtração",             emoji: "➖" },
  { value: "multiplicação",    label: "Multiplicação",         emoji: "✖️" },
  { value: "divisão",          label: "Divisão",               emoji: "➗" },
  { value: "adição e subtração",     label: "Adição e Subtração",    emoji: "🔢" },
  { value: "as 4 operações",   label: "As 4 Operações",        emoji: "🧮" },
];

const TEMAS = [
  { value: "Mercado",     emoji: "🛒" },
  { value: "Fazenda",     emoji: "🐄" },
  { value: "Escola",      emoji: "📚" },
  { value: "Parque",      emoji: "🌳" },
  { value: "Cozinha",     emoji: "🍳" },
  { value: "Viagem",      emoji: "✈️" },
  { value: "Esportes",    emoji: "⚽" },
  { value: "Natureza",    emoji: "🌿" },
  { value: "Tecnologia",  emoji: "💻" },
  { value: "Festa",       emoji: "🎉" },
];

const QUANTIDADES = [3, 4, 5, 6, 9];

export default function ProblemasClient() {
  const [ano, setAno] = useState("2");
  const [operacao, setOperacao] = useState("adição e subtração");
  const [tema, setTema] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(6);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const podeGerar = !!tema && !gerando;
  const paginas = Math.ceil(quantidade / 3);

  async function handleGerar() {
    if (!podeGerar) return;
    setGerando(true);
    setErro(null);
    try {
      const res = await fetch("/api/problemas-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ano, operacao, tema, quantidade }),
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
      a.download = `problemas-matematicos-${ano}ano.pdf`;
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
        <h1 className="text-2xl font-bold text-slate-800">Problemas Matemáticos</h1>
        <p className="text-slate-500 text-sm mt-1">
          A IA gera situações-problema contextualizadas — cada PDF traz espaços prontos para
          Dados, Operação e Resposta, do jeito que os professores ensinam.
        </p>
      </div>

      {/* Ano */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Ano Escolar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ANOS.map((a) => (
            <button
              key={a.value}
              onClick={() => { setAno(a.value); setErro(null); }}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                ano === a.value
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <p className="font-bold text-slate-800 text-sm">{a.label}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-tight">{a.sub}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Operação */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          2. Tipo de Operação
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {OPERACOES.map((op) => (
            <button
              key={op.value}
              onClick={() => { setOperacao(op.value); setErro(null); }}
              className={`rounded-2xl px-4 py-3 text-left border-2 transition-all ${
                operacao === op.value
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <span className="text-xl mr-2">{op.emoji}</span>
              <span className="font-semibold text-slate-700 text-sm">{op.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Tema */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          3. Tema dos Problemas
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {TEMAS.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTema(t.value); setErro(null); }}
              className={`rounded-2xl p-3 text-center border-2 transition-all ${
                tema === t.value
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <span className="text-2xl block mb-1">{t.emoji}</span>
              <span className="text-[10px] font-semibold text-slate-600 leading-tight">{t.value}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Quantidade */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          4. Quantidade de Problemas
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUANTIDADES.map((q) => (
            <button
              key={q}
              onClick={() => setQuantidade(q)}
              className={`px-5 py-3 rounded-2xl font-bold border-2 transition-all text-sm ${
                quantidade === q
                  ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
              }`}
            >
              {q} problemas
            </button>
          ))}
        </div>

        {tema && (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-slate-600 text-sm">
              <span className="font-bold">{quantidade} problemas</span>
              {" "}de <span className="font-bold">{operacao}</span>
              {" "}para o <span className="font-bold">{ano}º ano</span>
              {" "}tema <span className="font-bold">{tema}</span>
              {" "}·{" "}
              <span className="font-bold">{paginas} página{paginas > 1 ? "s" : ""}</span>
              {" "}de aluno + gabarito
            </p>
          </div>
        )}
      </section>

      {/* Destaque */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-5 py-4">
        <p className="text-blue-800 text-sm font-bold mb-1">
          🤖 Estrutura que professora já usa em sala
        </p>
        <p className="text-blue-600 text-xs leading-relaxed">
          Cada problema vem com três caixas para o aluno preencher:{" "}
          <strong className="text-sky-700">DADOS</strong> (o que o problema dá),{" "}
          <strong className="text-amber-700">OPERAÇÃO</strong> (a conta) e{" "}
          <strong className="text-emerald-700">RESPOSTA</strong> (resultado com unidade).
          Gabarito completo na última página.
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
            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-200"
        }`}
      >
        {gerando
          ? "A IA está criando os problemas…"
          : `⬇ Gerar ${quantidade} Problemas + Gabarito`}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Problemas únicos a cada geração · estrutura Dados/Operação/Resposta · gabarito incluído · BNCC alinhado
      </p>
    </div>
  );
}
