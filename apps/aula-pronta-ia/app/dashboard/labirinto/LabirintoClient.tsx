"use client";

import { useEffect, useState } from "react";
import {
  DIFICULDADES,
  gerarLabirintoCompleto,
  type LabirintoData,
  type ConfigLabirinto,
} from "@/lib/labirinto/gerador";

const QUANTIDADES = [1, 10, 20, 30] as const;

// Preview SVG renderizado no browser (React puro, não react-pdf)
function PreviewSVG({
  dados,
  config,
  mostrarSolucao,
}: {
  dados: LabirintoData;
  config: ConfigLabirinto;
  mostrarSolucao: boolean;
}) {
  const { celulas, solucao } = dados;
  const { linhas, colunas } = config;
  const TC = Math.min(Math.floor(300 / Math.max(linhas, colunas)), 36); // px para browser
  const MH = 10;
  const MV = 18;
  const W = 2 * MH + colunas * TC;
  const H = MV + linhas * TC + MV;
  const SW = 1.5;

  const pontosCaminho = mostrarSolucao
    ? solucao
        .map(([r, c]) => `${MH + c * TC + TC / 2},${MV + r * TC + TC / 2}`)
        .join(" ")
    : "";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="rounded-lg border border-slate-200 shadow-sm bg-white"
    >
      {/* Caminho solução */}
      {mostrarSolucao && pontosCaminho && (
        <polyline
          points={pontosCaminho}
          stroke="#f43f5e"
          strokeWidth={TC * 0.28}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.5}
        />
      )}

      {/* Paredes */}
      {celulas.map((linha, r) =>
        linha.map((celula, c) => {
          const x = MH + c * TC;
          const y = MV + r * TC;
          return (
            <g key={`${r}-${c}`}>
              {celula.paredes.top && (
                <line x1={x} y1={y} x2={x + TC} y2={y} stroke="#1e293b" strokeWidth={SW} strokeLinecap="square" />
              )}
              {celula.paredes.right && (
                <line x1={x + TC} y1={y} x2={x + TC} y2={y + TC} stroke="#1e293b" strokeWidth={SW} strokeLinecap="square" />
              )}
              {celula.paredes.bottom && (
                <line x1={x} y1={y + TC} x2={x + TC} y2={y + TC} stroke="#1e293b" strokeWidth={SW} strokeLinecap="square" />
              )}
              {celula.paredes.left && (
                <line x1={x} y1={y} x2={x} y2={y + TC} stroke="#1e293b" strokeWidth={SW} strokeLinecap="square" />
              )}
            </g>
          );
        })
      )}

      {/* Rótulos */}
      <text x={MH + TC / 2} y={MV - 5} textAnchor="middle" fontSize={8} fill="#16a34a" fontWeight="bold">
        ENTRADA
      </text>
      <text
        x={MH + (colunas - 1) * TC + TC / 2}
        y={MV + linhas * TC + 13}
        textAnchor="middle"
        fontSize={8}
        fill="#dc2626"
        fontWeight="bold"
      >
        SAÍDA
      </text>
    </svg>
  );
}

export default function LabirintoClient() {
  const [dificuldadeId, setDificuldadeId] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [dados, setDados] = useState<LabirintoData | null>(null);
  const [mostrarSolucao, setMostrarSolucao] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Gera labirinto automaticamente quando dificuldade muda
  useEffect(() => {
    if (dificuldadeId) {
      setMostrarSolucao(false);
      const resultado = gerarLabirintoCompleto(dificuldadeId);
      setDados(resultado);
    }
  }, [dificuldadeId]);

  function gerarNovo() {
    if (!dificuldadeId) return;
    setMostrarSolucao(false);
    const resultado = gerarLabirintoCompleto(dificuldadeId);
    setDados(resultado);
  }

  async function handleBaixar() {
    if (!dados) return;
    setBaixando(true);
    setErro(null);
    try {
      const res = await fetch("/api/labirinto-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dados, quantidade }),
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
      a.download = `labirinto-${dificuldadeId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setBaixando(false);
    }
  }

  const config = DIFICULDADES.find((d) => d.id === dificuldadeId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Labirinto</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gerado automaticamente — cada clique cria um labirinto único. PDF com gabarito incluso.
        </p>
      </div>

      {/* Dificuldade */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          1. Dificuldade
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DIFICULDADES.map((d) => (
            <button
              key={d.id}
              onClick={() => { setDificuldadeId(d.id); setErro(null); }}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${
                dificuldadeId === d.id
                  ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <span className="text-2xl block mb-1">{d.emoji}</span>
              <span className="font-bold text-slate-800 block text-sm">{d.label}</span>
              <span className="text-slate-400 text-xs">{d.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Preview */}
      {dados && config && (
        <>
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                2. Pré-visualização
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setMostrarSolucao((v) => !v)}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  {mostrarSolucao ? "Ocultar gabarito" : "Ver gabarito"}
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={gerarNovo}
                  className="text-xs text-slate-500 hover:underline font-medium"
                >
                  🔄 Gerar novo
                </button>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 flex justify-center">
              <PreviewSVG dados={dados} config={config} mostrarSolucao={mostrarSolucao} />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Grade {config.linhas}×{config.colunas} · caminho único garantido
            </p>
          </section>

          {/* Quantidade */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              3. Quantas cópias para os alunos?
            </h2>
            <div className="flex gap-3 flex-wrap">
              {QUANTIDADES.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantidade(q)}
                  className={`w-16 h-16 rounded-2xl font-bold text-lg border-2 transition-all ${
                    quantidade === q
                      ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md shadow-pink-100"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              PDF com {quantidade} {quantidade === 1 ? "cópia" : "cópias"} em branco + 1 gabarito = {quantidade + 1} páginas
            </p>
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
              !baixando
                ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 shadow-lg shadow-purple-200"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {baixando ? "Gerando PDF…" : `⬇ Baixar PDF — ${quantidade} ${quantidade === 1 ? "cópia" : "cópias"} + gabarito`}
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            Labirinto único por geração · sem custo de IA · BNCC EI03CG
          </p>
        </>
      )}
    </div>
  );
}
