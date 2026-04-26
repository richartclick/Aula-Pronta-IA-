"use client";

import { excluirAula } from "@/app/actions/aulas";

export default function BotaoExcluir({ aulaId }: { aulaId: string }) {
  return (
    <form
      action={excluirAula.bind(null, aulaId)}
      onSubmit={(e) => {
        if (!confirm("Excluir esta aula?")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        title="Excluir aula"
        className="text-xs font-bold py-2 px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
      >
        🗑
      </button>
    </form>
  );
}
