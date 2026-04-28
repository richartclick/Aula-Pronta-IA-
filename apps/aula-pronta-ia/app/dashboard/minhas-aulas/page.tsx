import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toggleFavorita } from "@/app/actions/aulas";
import type { AulaCompleta } from "@/app/actions/gerar-aula";
import BotaoExcluir from "./BotaoExcluir";

const disciplinaEmoji: Record<string, string> = {
  Matemática: "🔢", Português: "📖", Ciências: "🔬", História: "🏛️",
  Geografia: "🌍", "Educação Física": "⚽", Artes: "🎨", Inglês: "🌎",
  Biologia: "🧬", Física: "⚡", Química: "🧪",
};

const disciplinaGradiente: Record<string, string> = {
  Matemática: "from-blue-500 to-indigo-600",
  Português: "from-purple-500 to-pink-600",
  Ciências: "from-emerald-500 to-teal-600",
  História: "from-amber-500 to-orange-600",
  Geografia: "from-green-500 to-emerald-600",
  "Educação Física": "from-orange-500 to-red-600",
  Artes: "from-pink-500 to-rose-600",
  Inglês: "from-cyan-500 to-blue-600",
  Biologia: "from-teal-500 to-green-600",
  Física: "from-yellow-500 to-orange-500",
  Química: "from-violet-500 to-purple-600",
};

function formatarData(iso: string) {
  const data = new Date(iso);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1) return "Agora há pouco";
  if (diffH < 24) return `Hoje, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffD === 1) return "Ontem";
  if (diffD < 7) return `${diffD} dias atrás`;
  return data.toLocaleDateString("pt-BR");
}

type AulaRow = {
  id: string;
  titulo: string;
  tema: string;
  serie: string;
  disciplina: string;
  duracao: string;
  favorita: boolean;
  created_at: string;
  conteudo: AulaCompleta;
};

export default async function MinhasAulasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: aulas } = await supabase
    .from("aulas")
    .select("id, titulo, tema, serie, disciplina, duracao, favorita, created_at, conteudo")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const lista = (aulas ?? []) as AulaRow[];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">📚 Minhas Aulas</h1>
          <p className="text-slate-500 text-sm mt-1">{lista.length} aula{lista.length !== 1 ? "s" : ""} gerada{lista.length !== 1 ? "s" : ""} no total</p>
        </div>
        <Link
          href="/dashboard/gerar"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-blue-200 text-sm"
        >
          ⚡ Nova aula
        </Link>
      </div>

      {/* Lista vazia */}
      {lista.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-5xl mb-4">📝</p>
          <h3 className="font-black text-slate-900 text-lg mb-2">Nenhuma aula ainda</h3>
          <p className="text-slate-500 text-sm mb-6">Crie sua primeira aula em segundos com a IA.</p>
          <Link
            href="/dashboard/gerar"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            ⚡ Criar primeira aula
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {lista.map((aula) => {
            const gradiente = disciplinaGradiente[aula.disciplina] ?? "from-slate-500 to-slate-700";
            const emoji = disciplinaEmoji[aula.disciplina] ?? "📄";

            return (
              <div
                key={aula.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {/* Topo colorido */}
                <div className={`bg-gradient-to-br ${gradiente} p-6 text-white`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{emoji}</span>
                    <form action={toggleFavorita.bind(null, aula.id, aula.favorita)}>
                      <button
                        type="submit"
                        title={aula.favorita ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        className="text-xl hover:scale-110 transition-transform"
                      >
                        {aula.favorita ? "⭐" : "☆"}
                      </button>
                    </form>
                  </div>
                  <h3 className="font-black text-sm leading-snug">{aula.titulo}</h3>
                  <p className="text-white/70 text-xs mt-1">{aula.disciplina}</p>
                </div>

                {/* Corpo */}
                <div className="p-5 space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg font-medium">{aula.serie}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg font-medium">⏱ {aula.duracao}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{formatarData(aula.created_at)}</p>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/aula/${aula.id}`}
                      className="flex-1 text-center text-sm font-bold py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      👁 Ver aula
                    </Link>
                    <BotaoExcluir aulaId={aula.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Banner upgrade se tiver poucas aulas usadas */}
      {lista.length > 0 && lista.length < 5 && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-black text-lg">Você usou {lista.length} de 5 aulas gratuitas 🚀</p>
            <p className="text-purple-200 text-sm mt-1">Assine e gere aulas ilimitadas por menos de R$1 por dia.</p>
          </div>
          <Link
            href="/dashboard/plano"
            className="flex-shrink-0 bg-white text-purple-700 font-black px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm shadow-lg"
          >
            Ver planos ✨
          </Link>
        </div>
      )}
    </div>
  );
}
