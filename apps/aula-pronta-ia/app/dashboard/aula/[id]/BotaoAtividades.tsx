"use client";

import { useState } from "react";
import { gerarAtividades, type AtividadesGeradas } from "@/app/actions/gerar-atividades";
import type { AulaCompleta } from "@/app/actions/gerar-aula";

const tipoIcon: Record<string, string> = {
  dissertativa: "✏️",
  multipla_escolha: "🔘",
  desenho: "🎨",
  completar: "📝",
  verdadeiro_falso: "✅",
};

const tipoLabel: Record<string, string> = {
  dissertativa: "Dissertativa",
  multipla_escolha: "Múltipla escolha",
  desenho: "Desenho",
  completar: "Completar",
  verdadeiro_falso: "Verdadeiro ou Falso",
};

export default function BotaoAtividades({
  aulaId,
  tema,
  serie,
  disciplina,
  conteudo,
}: {
  aulaId: string;
  tema: string;
  serie: string;
  disciplina: string;
  conteudo: AulaCompleta;
}) {
  const [estado, setEstado] = useState<"idle" | "carregando" | "gerado" | "erro">("idle");
  const [atividades, setAtividades] = useState<AtividadesGeradas | null>(null);
  const [erro, setErro] = useState("");
  const [baixando, setBaixando] = useState<"professor" | "aluno" | null>(null);

  async function handleGerar() {
    setEstado("carregando");
    setErro("");
    const resumo = `Objetivos: ${conteudo.objetivos.join(", ")}. Desenvolvimento: ${conteudo.desenvolvimento.map(d => d.etapa).join(", ")}.`;
    const result = await gerarAtividades(aulaId, tema, serie, disciplina, resumo);
    if (result.error || !result.atividades) {
      setErro(result.error ?? "Erro desconhecido.");
      setEstado("erro");
      return;
    }
    setAtividades(result.atividades);
    setEstado("gerado");
  }

  async function handleBaixarPDF(modo: "professor" | "aluno") {
    if (!atividades) return;
    setBaixando(modo);
    try {
      const res = await fetch("/api/atividades-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atividades, modo }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `atividades-${modo}-${tema.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setBaixando(null);
    }
  }

  if (estado === "idle" || estado === "erro") {
    return (
      <div className="space-y-2">
        <button
          onClick={handleGerar}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
        >
          📋 Gerar atividades para os alunos
        </button>
        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
      </div>
    );
  }

  if (estado === "carregando") {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
        <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="font-bold text-emerald-700">Gerando atividades...</p>
        <p className="text-emerald-500 text-sm mt-1">A IA está criando exercícios para {serie}</p>
      </div>
    );
  }

  if (estado === "gerado" && atividades) {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-black text-lg">📋 Atividades geradas!</h3>
              <p className="text-emerald-100 text-sm mt-1">{atividades.questoes.length} questões para {serie}</p>
            </div>
            <button
              onClick={() => { setEstado("idle"); setAtividades(null); }}
              className="text-emerald-200 hover:text-white text-sm font-bold"
            >
              ↩ Gerar novas
            </button>
          </div>
        </div>

        {/* Orientações professor */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-xs font-black text-amber-700 mb-2">📋 Orientações para o professor</p>
          <p className="text-amber-800 text-sm leading-relaxed">{atividades.instrucoes_professor}</p>
        </div>

        {/* Lista de questões */}
        <div className="space-y-4">
          {atividades.questoes.map((q) => (
            <div key={q.numero} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 flex items-center gap-3 border-b border-slate-100">
                <span className="w-7 h-7 bg-emerald-600 text-white text-xs font-black rounded-full flex items-center justify-center">{q.numero}</span>
                <span className="text-xs font-bold text-slate-500">{tipoIcon[q.tipo]} {tipoLabel[q.tipo]}</span>
              </div>
              <div className="p-5 space-y-3">
                <p className="font-bold text-slate-900 text-sm leading-relaxed">{q.enunciado}</p>

                {q.tipo === "multipla_escolha" && q.alternativas && (
                  <div className="space-y-1.5 pl-2">
                    {q.alternativas.map((alt, i) => (
                      <p key={i} className="text-sm text-slate-600">{alt}</p>
                    ))}
                  </div>
                )}

                {q.tipo === "verdadeiro_falso" && (
                  <div className="flex gap-4">
                    <span className="text-sm font-bold text-slate-600">( ) Verdadeiro</span>
                    <span className="text-sm font-bold text-slate-600">( ) Falso</span>
                  </div>
                )}

                {q.tipo === "desenho" && (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl h-24 flex items-center justify-center text-slate-300 text-sm">
                    🎨 Espaço para desenhar
                  </div>
                )}

                {/* Gabarito */}
                <div className="bg-green-50 rounded-xl px-4 py-3">
                  <p className="text-xs font-black text-green-700 mb-1">✅ Gabarito (professor)</p>
                  <p className="text-green-800 text-sm">{q.resposta_gabarito}</p>
                </div>

                {q.dica_professor && (
                  <div className="bg-yellow-50 rounded-xl px-4 py-2">
                    <p className="text-xs text-amber-700">💡 {q.dica_professor}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botões de download */}
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleBaixarPDF("professor")}
            disabled={baixando !== null}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            {baixando === "professor" ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gerando...</>
            ) : "📥 PDF Professor (com gabarito)"}
          </button>
          <button
            onClick={() => handleBaixarPDF("aluno")}
            disabled={baixando !== null}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
          >
            {baixando === "aluno" ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gerando...</>
            ) : "🖨️ PDF Aluno (para imprimir)"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
