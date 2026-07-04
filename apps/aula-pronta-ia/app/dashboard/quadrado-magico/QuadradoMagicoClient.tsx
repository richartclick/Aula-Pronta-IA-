"use client";

import { useState } from "react";
import type { MagicoTamanho, MagicoDificuldade } from "@/lib/quadrado-magico/gerador";
import { SOMA_MAGICA, PUZZLES_POR_PAGINA } from "@/lib/quadrado-magico/gerador";

const TAMANHOS: {
  id: MagicoTamanho;
  label: string;
  sub: string;
  faixa: string;
}[] = [
  {
    id: "3x3",
    label: "3×3",
    sub: "Números 1 a 9 · Soma = 15",
    faixa: "2º ao 4º ano",
  },
  {
    id: "4x4",
    label: "4×4",
    sub: "Números 1 a 16 · Soma = 34",
    faixa: "4º ao 6º ano",
  },
  {
    id: "5x5",
    label: "5×5",
    sub: "Números 1 a 25 · Soma = 65",
    faixa: "6º ao 9º ano",
  },
];

const DIFICULDADES: {
  id: MagicoDificuldade;
  label: string;
  desc: string;
  cor: string;
}[] = [
  {
    id: "facil",
    label: "Fácil",
    desc: "Poucas lacunas — bom para introdução",
    cor: "emerald",
  },
  {
    id: "medio",
    label: "Médio",
    desc: "Metade das casas em branco",
    cor: "amber",
  },
  {
    id: "dificil",
    label: "Difícil",
    desc: "Quase tudo em branco — desafio real",
    cor: "red",
  },
];

const QUANTIDADES = [1, 2, 4, 6, 8, 10];

const COR_MAP: Record<string, string> = {
  emerald: "border-emerald-500 bg-emerald-50 shadow-emerald-100 text-emerald-700",
  amber: "border-amber-500 bg-amber-50 shadow-amber-100 text-amber-700",
  red: "border-red-500 bg-red-50 shadow-red-100 text-red-700",
};

const COR_IDLE_MAP: Record<string, string> = {
  emerald: "hover:border-emerald-300",
  amber: "hover:border-amber-300",
  red: "hover:border-red-300",
};

export default function QuadradoMagicoClient() {
  const [tamanho, setTamanho] = useState<MagicoTamanho>("3x3");
  const [dificuldade, setDificuldade] = useState<MagicoDificuldade>("medio");
  const [quantidade, setQuantidade] = useState(4);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const perPage = PUZZLES_POR_PAGINA[tamanho];
  const paginas = Math.ceil(quantidade / perPage);
  const soma = SOMA_MAGICA[tamanho];

  async function handleGerar() {
    setGerando(true);
    setErro(null);
    try {
      const res = await fetch("/api/quadrado-magico-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tamanho, dificuldade, quantidade }),
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
      a.download = `quadrado-magico-${tamanho}-${dificuldade}.pdf`;
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
        <h1 className="text-2xl font-bold text-slate-800">Quadrado Mágico</h1>
        <p className="text-slate-500 text-sm mt-1">
          Puzzles matemáticos onde toda linha, coluna e diagonal somam o mesmo valor — gerados e verificados automaticamente.
        </p>
      </div>

      {/* Tamanho */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Tamanho do Quadrado
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TAMANHOS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTamanho(t.id); setErro(null); }}
              className={`rounded-2xl p-5 text-left border-2 transition-all ${
                tamanho === t.id
                  ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-100"
                  : "border-slate-200 bg-white hover:border-violet-300"
              }`}
            >
              <p className="text-3xl font-black text-slate-800 mb-1 font-mono">{t.label}</p>
              <p className="text-xs font-semibold text-slate-600">{t.sub}</p>
              <p className="text-xs text-slate-400 mt-1">{t.faixa}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Dificuldade */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          2. Dificuldade
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIFICULDADES.map((d) => (
            <button
              key={d.id}
              onClick={() => { setDificuldade(d.id); setErro(null); }}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                dificuldade === d.id
                  ? `${COR_MAP[d.cor]} shadow-md`
                  : `border-slate-200 bg-white ${COR_IDLE_MAP[d.cor]}`
              }`}
            >
              <p className="font-bold text-slate-800 text-sm mb-1">{d.label}</p>
              <p className="text-xs text-slate-500">{d.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Quantidade */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          3. Quantidade de Puzzles
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUANTIDADES.map((q) => (
            <button
              key={q}
              onClick={() => setQuantidade(q)}
              className={`px-5 py-3 rounded-2xl font-bold border-2 transition-all text-sm ${
                quantidade === q
                  ? "border-violet-500 bg-violet-500 text-white shadow-md shadow-violet-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
              }`}
            >
              {q} puzzle{q > 1 ? "s" : ""}
            </button>
          ))}
        </div>

        {/* Resumo */}
        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
          <p className="text-slate-600 text-sm">
            <span className="font-bold">{quantidade} quadrado{quantidade > 1 ? "s" : ""}</span>
            {" "}{tamanho}
            {" "}·{" "}
            <span className="font-bold">{paginas} página{paginas > 1 ? "s" : ""}</span>
            {" de aluno + gabarito · Soma mágica = "}
            <span className="font-bold text-violet-700">{soma}</span>
            {perPage > 1 && ` · ${perPage} por página`}
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 px-5 py-4">
        <p className="text-violet-800 text-sm font-bold mb-1">
          O que é um Quadrado Mágico?
        </p>
        <p className="text-violet-600 text-xs leading-relaxed">
          Um arranjo de números onde cada linha, coluna e as duas diagonais somam sempre o mesmo
          valor — a <strong>soma mágica</strong>. Para o {tamanho}, esse valor é sempre{" "}
          <strong>{soma}</strong>. Os alunos precisam raciocinar logicamente para encontrar os
          números ausentes. Cada geração produz um puzzle diferente.
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
        disabled={gerando}
        className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
          gerando
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 shadow-lg shadow-violet-200"
        }`}
      >
        {gerando
          ? "Gerando puzzles…"
          : `⬇ Gerar ${quantidade} Quadrado${quantidade > 1 ? "s" : ""} Mágico${quantidade > 1 ? "s" : ""} + Gabarito`}
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Matematicamente verificados · gabarito incluído · cada geração é diferente · BNCC alinhado
      </p>
    </div>
  );
}
