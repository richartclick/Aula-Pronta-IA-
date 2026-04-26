import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUsoMensal } from "@/lib/uso";

function formatarData(iso: string) {
  const data = new Date(iso);
  const agora = new Date();
  const diffH = Math.floor((agora.getTime() - data.getTime()) / 3600000);
  const diffD = Math.floor(diffH / 24);
  if (diffH < 1) return "Agora há pouco";
  if (diffH < 24) return `Hoje, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffD === 1) return "Ontem";
  if (diffD < 7) return `${diffD} dias atrás`;
  return data.toLocaleDateString("pt-BR");
}

const quickActions = [
  { href: "/dashboard/gerar", icon: "⚡", label: "Gerar nova aula", desc: "Crie em segundos", color: "from-blue-600 to-indigo-600", shadow: "shadow-blue-200" },
  { href: "/dashboard/minhas-aulas", icon: "📚", label: "Minhas aulas", desc: "Ver histórico", color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200" },
  { href: "/dashboard/plano", icon: "💎", label: "Fazer upgrade", desc: "Aulas ilimitadas", color: "from-purple-600 to-pink-600", shadow: "shadow-purple-200" },
];

const tips = [
  { icon: "💡", text: "Adicione o 'estilo da turma' para aulas mais personalizadas" },
  { icon: "📎", text: "Baixe em PDF para levar impresso para a sala" },
  { icon: "⭐", text: "Favorite as aulas que usar para encontrá-las rapidamente" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: aulas }, uso] = await Promise.all([
    supabase
      .from("aulas")
      .select("id, titulo, serie, disciplina, duracao, favorita, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(3),
    getUsoMensal(),
  ]);

  const lista = aulas ?? [];
  const totalAulas = lista.length;
  const totalFavoritas = lista.filter((a) => a.favorita).length;
  const horasEconomizadas = totalAulas * 2;
  const restantes = uso?.restantes === Infinity ? "∞" : String(uso?.restantes ?? 0);
  const planoGratuito = uso?.plano === "gratuito";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 lg:pb-0">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">
              Bem-vindo(a) à sua sala de criação! 🎓
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              {planoGratuito && uso
                ? `Você usou ${uso.aulasNoMes} de ${uso.limite} aulas gratuitas este mês.`
                : "Você tem aulas ilimitadas. O que criamos hoje?"}
            </p>
          </div>
          <Link
            href="/dashboard/gerar"
            className="flex-shrink-0 bg-white text-blue-700 font-black px-6 py-3 rounded-2xl text-sm hover:bg-blue-50 transition-colors shadow-lg"
          >
            ⚡ Criar aula agora
          </Link>
        </div>

        {/* Barra de progresso do plano gratuito */}
        {planoGratuito && uso && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-blue-200 mb-1.5">
              <span>{uso.aulasNoMes} aulas usadas</span>
              <span>{uso.restantes} restantes este mês</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${uso.bloqueado ? "bg-red-400" : "bg-white"}`}
                style={{ width: `${Math.min(100, (uso.aulasNoMes / uso.limite) * 100)}%` }}
              />
            </div>
            {uso.bloqueado && (
              <p className="text-red-300 text-xs mt-2 font-bold">
                ⚠️ Limite atingido —{" "}
                <Link href="/dashboard/plano" className="underline">assine para continuar gerando</Link>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: "📝", value: String(totalAulas), label: "Aulas geradas", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: "⏱️", value: `${horasEconomizadas}h`, label: "Horas economizadas", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: "⭐", value: String(totalFavoritas), label: "Aulas favoritas", color: "text-yellow-600", bg: "bg-yellow-50" },
          { icon: "🎯", value: restantes, label: planoGratuito ? "Aulas restantes grátis" : "Plano ativo", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default`}>
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-600 text-xs font-medium leading-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-slate-900 font-black text-lg mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-3 gap-5">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`bg-gradient-to-br ${action.color} ${action.shadow} shadow-lg rounded-2xl p-5 flex flex-col gap-2 hover:scale-105 transition-transform`}
            >
              <span className="text-3xl">{action.icon}</span>
              <p className="font-bold text-sm text-white">{action.label}</p>
              <p className="text-xs text-white opacity-80">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-7">
        {/* Aulas recentes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Aulas recentes</h2>
            <Link href="/dashboard/minhas-aulas" className="text-blue-600 text-sm font-semibold hover:underline">
              Ver todas →
            </Link>
          </div>

          {lista.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-4xl mb-3">📝</p>
              <p className="font-bold text-slate-700 mb-1">Nenhuma aula ainda</p>
              <p className="text-slate-400 text-sm">Crie sua primeira aula agora!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {lista.map((aula) => (
                <Link
                  key={aula.id}
                  href={`/dashboard/aula/${aula.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{aula.titulo}</p>
                    <p className="text-slate-400 text-xs">{aula.serie} • {aula.disciplina} • {aula.duracao}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {aula.favorita && <span className="text-yellow-400">⭐</span>}
                    <span className="text-slate-300 text-xs">{formatarData(aula.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="px-6 py-4 bg-slate-50">
            <Link
              href="/dashboard/gerar"
              className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-blue-200 text-blue-600 font-semibold text-sm py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              + Criar nova aula
            </Link>
          </div>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
            <h3 className="font-black text-slate-900 mb-4">Dicas rápidas 💡</h3>
            <div className="space-y-3">
              {tips.map((tip) => (
                <div key={tip.text} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{tip.icon}</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {planoGratuito && (
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-7 text-white shadow-lg shadow-purple-200">
              <p className="font-black text-lg mb-1">Quer mais? 🚀</p>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Assine e gere aulas ilimitadas todos os meses.
              </p>
              <ul className="space-y-1.5 mb-5">
                {["Aulas ilimitadas", "Download PDF e Word", "Suporte prioritário"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="text-pink-200">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard/plano"
                className="block text-center bg-white text-purple-700 font-black text-sm py-3 rounded-xl hover:bg-purple-50 transition-colors"
              >
                Assinar por R$29,90/mês
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
