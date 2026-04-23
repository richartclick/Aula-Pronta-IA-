"use client";

import { useState } from "react";
import type { AulaCompleta } from "@/app/actions/gerar-aula";

export default function BotaoPDF({
  aula,
  meta,
}: {
  aula: AulaCompleta;
  meta: { tema: string; serie: string; disciplina: string; duracao: string };
}) {
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState(false);

  async function handleBaixar() {
    setBaixando(true);
    setErro(false);
    try {
      const res = await fetch("/api/aula-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aula, meta }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aula-${meta.tema.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro(true);
    } finally {
      setBaixando(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-2">
      <button
        onClick={handleBaixar}
        disabled={baixando}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
      >
        {baixando ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Gerando PDF...
          </>
        ) : "📥 Baixar em PDF"}
      </button>
      {erro && (
        <p className="text-red-600 text-xs bg-red-50 rounded-xl px-3 py-2">
          Erro ao gerar o PDF. Tente novamente.
        </p>
      )}
    </div>
  );
}
