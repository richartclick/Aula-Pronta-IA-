import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function MinhasAulasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: aulas } = await supabase
    .from("aulas")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Minhas aulas</h1>
          <p className="text-slate-500 mt-1">{aulas?.length ?? 0} aulas geradas no total</p>
        </div>
        <Link
          href="/dashboard/gerar-aula"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors"
        >
          + Nova aula
        </Link>
      </div>

      {!aulas || aulas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="font-bold text-slate-900 mb-2">Nenhuma aula ainda</h2>
          <p className="text-slate-500 mb-6">Crie sua primeira aula com IA agora!</p>
          <Link
            href="/dashboard/gerar-aula"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            ⚡ Gerar primeira aula
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {aulas.map((aula) => (
            <details key={aula.id} className="bg-white rounded-2xl border border-slate-100 group">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <div>
                  <p className="font-bold text-slate-900">{aula.tema}</p>
                  <p className="text-slate-400 text-sm">{aula.serie} · {aula.duracao}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-slate-400 text-xs">
                    {new Date(aula.created_at).toLocaleDateString("pt-BR")}
                  </p>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </div>
              </summary>
              <div className="px-5 pb-5 border-t border-slate-50">
                <pre className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed font-sans mt-4">
                  {aula.conteudo}
                </pre>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
