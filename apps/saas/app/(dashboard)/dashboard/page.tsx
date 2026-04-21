import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, plano, aulas_usadas, aulas_limite")
    .eq("id", user!.id)
    .single();

  const { data: aulasRecentes } = await supabase
    .from("aulas")
    .select("id, tema, serie, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const progresso = profile ? Math.round((profile.aulas_usadas / profile.aulas_limite) * 100) : 0;
  const restantes = profile ? profile.aulas_limite - profile.aulas_usadas : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">
          Olá, {profile?.nome?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Pronto para criar aulas incríveis hoje?</p>
      </div>

      {/* Cards de status */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Aulas criadas</p>
          <p className="text-3xl font-black text-slate-900">{profile?.aulas_usadas ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Restantes no plano</p>
          <p className={`text-3xl font-black ${restantes <= 1 ? "text-red-500" : "text-green-600"}`}>
            {restantes}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Plano atual</p>
          <p className="text-3xl font-black text-blue-600 capitalize">{profile?.plano ?? "Gratuito"}</p>
        </div>
      </div>

      {/* Barra de uso */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-slate-700">Uso do plano</p>
          <p className="text-sm text-slate-500">{profile?.aulas_usadas}/{profile?.aulas_limite} aulas</p>
        </div>
        <div className="bg-slate-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${progresso >= 80 ? "bg-red-500" : "bg-blue-600"}`}
            style={{ width: `${progresso}%` }}
          />
        </div>
        {progresso >= 80 && (
          <p className="text-red-500 text-xs mt-2">
            Quase no limite!{" "}
            <Link href="/dashboard/conta" className="font-bold underline">Fazer upgrade →</Link>
          </p>
        )}
      </div>

      {/* CTA principal */}
      <Link
        href="/dashboard/gerar-aula"
        className="block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-6 mb-6 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-xl mb-1">⚡ Gerar nova aula</p>
            <p className="text-blue-100 text-sm">Crie uma aula completa em menos de 1 minuto</p>
          </div>
          <span className="text-3xl">→</span>
        </div>
      </Link>

      {/* Aulas recentes */}
      {aulasRecentes && aulasRecentes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-900">Aulas recentes</h2>
            <Link href="/dashboard/minhas-aulas" className="text-blue-600 text-sm font-semibold hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {aulasRecentes.map((aula) => (
              <div key={aula.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{aula.tema}</p>
                  <p className="text-slate-400 text-xs">{aula.serie}</p>
                </div>
                <p className="text-slate-400 text-xs">
                  {new Date(aula.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
