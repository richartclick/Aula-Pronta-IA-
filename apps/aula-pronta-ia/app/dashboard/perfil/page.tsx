import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { getUsoMensal } from "@/lib/uso";
import Link from "next/link";

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const uso = await getUsoMensal();

  const planoLabel = uso?.plano === "gratuito" ? "Plano Gratuito" : uso?.plano === "basico" ? "Plano Básico" : "Plano Premium";
  const planoBadgeColor = uso?.plano === "gratuito" ? "bg-slate-100 text-slate-700" : uso?.plano === "basico" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700";

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-black text-slate-900">👤 Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">Suas informações de conta</p>
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-black text-slate-900">{user?.email}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${planoBadgeColor}`}>{planoLabel}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Email</span>
            <span className="font-semibold text-slate-900">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Aulas este mês</span>
            <span className="font-semibold text-slate-900">
              {uso?.aulasNoMes ?? 0}{uso?.limite !== Infinity ? ` / ${uso?.limite}` : " (ilimitadas)"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Membro desde</span>
            <span className="font-semibold text-slate-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="space-y-3">
        <Link
          href="/dashboard/plano"
          className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">💎</span>
            <span className="font-semibold text-slate-900 text-sm">Meu plano</span>
          </div>
          <span className="text-slate-400 text-sm">→</span>
        </Link>

        <Link
          href="/esqueceu-senha"
          className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔑</span>
            <span className="font-semibold text-slate-900 text-sm">Alterar senha</span>
          </div>
          <span className="text-slate-400 text-sm">→</span>
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center justify-between bg-white rounded-2xl border border-red-100 shadow-sm p-4 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🚪</span>
              <span className="font-semibold text-red-600 text-sm">Sair da conta</span>
            </div>
            <span className="text-red-300 text-sm">→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
