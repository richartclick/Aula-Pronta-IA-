import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toggleFavorita } from "@/app/actions/aulas";

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

export default async function FavoritosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: aulas } = await supabase
    .from("aulas")
    .select("id, titulo, serie, disciplina, duracao, favorita, created_at")
    .eq("user_id", user!.id)
    .eq("favorita", true)
    .order("created_at", { ascending: false });

  const lista = aulas ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-3xl font-black text-slate-900">⭐ Favoritos</h1>
        <p className="text-slate-500 text-sm mt-1">{lista.length} aula{lista.length !== 1 ? "s" : ""} favorita{lista.length !== 1 ? "s" : ""}</p>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-5xl mb-4">⭐</p>
          <h3 className="font-black text-slate-900 text-lg mb-2">Nenhum favorito ainda</h3>
          <p className="text-slate-500 text-sm mb-6">Marque suas melhores aulas com ⭐ para encontrá-las aqui.</p>
          <Link href="/dashboard/minhas-aulas" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            📚 Ver minhas aulas
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {lista.map((aula) => {
            const gradiente = disciplinaGradiente[aula.disciplina] ?? "from-slate-500 to-slate-700";
            const emoji = disciplinaEmoji[aula.disciplina] ?? "📄";
            return (
              <div key={aula.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`bg-gradient-to-br ${gradiente} p-5 text-white`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{emoji}</span>
                    <form action={toggleFavorita.bind(null, aula.id, aula.favorita)}>
                      <button type="submit" className="text-xl hover:scale-110 transition-transform">⭐</button>
                    </form>
                  </div>
                  <h3 className="font-black text-sm leading-snug">{aula.titulo}</h3>
                  <p className="text-white/70 text-xs mt-1">{aula.disciplina}</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">{aula.serie}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">⏱ {aula.duracao}</span>
                  </div>
                  <Link href={`/dashboard/aula/${aula.id}`} className="block text-center text-xs font-bold py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                    👁 Ver aula
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
