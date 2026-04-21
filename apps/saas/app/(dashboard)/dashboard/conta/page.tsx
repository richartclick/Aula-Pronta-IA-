import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

const planos = [
  {
    nome: "Gratuito",
    preco: "R$ 0",
    limite: "5 aulas/mês",
    cor: "border-slate-200",
    botao: "Plano atual",
    ativo: true,
    recursos: ["5 aulas por mês", "Todos os formatos", "Download em PDF"],
  },
  {
    nome: "Básico",
    preco: "R$ 19,90/mês",
    limite: "Ilimitado",
    cor: "border-blue-500 ring-2 ring-blue-500",
    botao: "Fazer upgrade",
    ativo: false,
    recursos: ["Aulas ilimitadas", "Download em PDF e Word", "Suporte prioritário"],
  },
  {
    nome: "Premium",
    preco: "R$ 29,90/mês",
    limite: "Ilimitado + extras",
    cor: "border-yellow-400",
    botao: "Fazer upgrade",
    ativo: false,
    recursos: ["Tudo do Básico", "Banco de atividades extras", "Suporte VIP WhatsApp"],
  },
];

export default async function ContaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-8">Minha conta</h1>

      {/* Info da conta */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <h2 className="font-bold text-slate-900 mb-4">Informações</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Nome</span>
            <span className="font-semibold text-slate-900 text-sm">{profile?.nome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Email</span>
            <span className="font-semibold text-slate-900 text-sm">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Plano</span>
            <span className="font-semibold text-blue-600 text-sm capitalize">{profile?.plano}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Aulas usadas</span>
            <span className="font-semibold text-slate-900 text-sm">
              {profile?.aulas_usadas} / {profile?.aulas_limite}
            </span>
          </div>
        </div>
      </div>

      {/* Planos */}
      <div className="mb-6">
        <h2 className="font-bold text-slate-900 mb-4">Planos disponíveis</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {planos.map((p) => (
            <div key={p.nome} className={`bg-white rounded-2xl border-2 ${p.cor} p-5`}>
              <h3 className="font-bold text-slate-900 mb-1">{p.nome}</h3>
              <p className="text-2xl font-black text-slate-900 mb-1">{p.preco}</p>
              <p className="text-slate-500 text-xs mb-4">{p.limite}</p>
              <ul className="space-y-1.5 mb-5">
                {p.recursos.map((r) => (
                  <li key={r} className="text-xs text-slate-600 flex gap-1.5">
                    <span className="text-green-500">✓</span> {r}
                  </li>
                ))}
              </ul>
              <button
                disabled={p.ativo}
                className={`w-full py-2 rounded-xl text-sm font-bold transition-colors ${
                  p.ativo
                    ? "bg-slate-100 text-slate-400 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {p.botao}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sair */}
      <form action={signOut}>
        <button
          type="submit"
          className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors"
        >
          Sair da conta →
        </button>
      </form>
    </div>
  );
}
