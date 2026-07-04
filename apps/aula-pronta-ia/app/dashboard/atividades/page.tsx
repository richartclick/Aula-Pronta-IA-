import Link from "next/link";

const MODULOS = [
  {
    href: "/dashboard/desenhos",
    emoji: "🎨",
    label: "Desenhos para Colorir",
    desc: "Gerados por IA no estilo livro de colorir — temas, faixa etária e quantidade",
    bncc: "EI03EO · EI03TS",
    cor: "from-pink-400 to-rose-500",
    sombra: "shadow-pink-200",
    badge: "IA",
  },
  {
    href: "/dashboard/caligrafia",
    emoji: "✏️",
    label: "Caligrafia",
    desc: "Folhas de treino de escrita — maiúsculas, minúsculas, números e palavras livres",
    bncc: "EI03TS · EF01LP07",
    cor: "from-indigo-400 to-purple-500",
    sombra: "shadow-indigo-200",
    badge: "Grátis",
  },
  {
    href: "/dashboard/ligue-pontos",
    emoji: "🔢",
    label: "Ligue os Pontos",
    desc: "Figuras surpresa com pontos numerados — estrela, foguete, borboleta e mais",
    bncc: "EI03TS · EI03ET",
    cor: "from-amber-400 to-orange-500",
    sombra: "shadow-amber-200",
    badge: "Grátis",
  },
  {
    href: "/dashboard/palavras-cruzadas",
    emoji: "🔤",
    label: "Palavras Cruzadas",
    desc: "A IA cria palavras e pistas por tema — com gabarito para o professor",
    bncc: "EF01LP07 · EF03LP11",
    cor: "from-teal-400 to-cyan-500",
    sombra: "shadow-teal-200",
    badge: "IA",
  },
  {
    href: "/dashboard/labirinto",
    emoji: "🌀",
    label: "Labirinto",
    desc: "Cada geração cria um labirinto único e perfeito — 4 dificuldades, com gabarito",
    bncc: "EI03CG · EI03ET",
    cor: "from-violet-400 to-purple-600",
    sombra: "shadow-violet-200",
    badge: "Grátis",
  },
  {
    href: "/dashboard/caca-palavras",
    emoji: "🔍",
    label: "Caça-palavras",
    desc: "A IA escolhe palavras por tema e monta a grade — 3 dificuldades, com gabarito",
    bncc: "EI03TS · EF01LP07",
    cor: "from-green-400 to-emerald-500",
    sombra: "shadow-green-200",
    badge: "IA",
  },
  {
    href: "/dashboard/sequencias",
    emoji: "🔢",
    label: "Sequências Numéricas",
    desc: "Complete os números que faltam — 4 faixas etárias, com gabarito, geração instantânea",
    bncc: "EI03ET · EF01MA02",
    cor: "from-violet-400 to-purple-500",
    sombra: "shadow-violet-200",
    badge: "Grátis",
  },
  {
    href: "/dashboard/pontilhados",
    emoji: "✏️",
    label: "Pontilhados",
    desc: "Trace as formas geométricas seguindo o pontilhado — 8 formas, 2 formatos, geração instantânea",
    bncc: "EI03CG · EI03TS",
    cor: "from-sky-400 to-blue-500",
    sombra: "shadow-sky-200",
    badge: "Grátis",
  },
  {
    href: "/dashboard/sudoku",
    emoji: "🔢",
    label: "Sudoku",
    desc: "Puzzles verificados matematicamente — solução única garantida, 3 tamanhos, gabarito incluído",
    bncc: "EI03ET · EF01MA02",
    cor: "from-indigo-400 to-blue-600",
    sombra: "shadow-indigo-200",
    badge: "Grátis",
  },
  {
    href: "/dashboard/tabuada",
    emoji: "✖️",
    label: "Tabuada com Desafio",
    desc: "Multiplicação com lacunas variadas — resultado, fator ou misto, 30 desafios por folha",
    bncc: "EF02MA04 · EF03MA01",
    cor: "from-orange-400 to-rose-500",
    sombra: "shadow-orange-200",
    badge: "Grátis",
  },
  {
    href: "/dashboard/forca",
    emoji: "🎯",
    label: "Forca Temático",
    desc: "A IA escolhe palavra por tema e faixa etária — forca, alfabeto e dica já impressos no PDF",
    bncc: "EF01LP07 · EF02LP04",
    cor: "from-rose-400 to-pink-500",
    sombra: "shadow-rose-200",
    badge: "IA",
  },
  {
    href: "/dashboard/bingo",
    emoji: "🎱",
    label: "Bingo Pedagógico",
    desc: "Gere 30 cartelas únicas para a turma inteira + folha de chamadas do professor, instantaneamente",
    bncc: "EF01MA02 · EF02MA04",
    cor: "from-blue-400 to-indigo-600",
    sombra: "shadow-blue-200",
    badge: "Grátis",
  },
];

export default function AtividadesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">🎯 Atividades Pedagógicas</h1>
        <p className="text-slate-500 text-sm mt-1">
          Ferramentas prontas para imprimir, alinhadas à BNCC — sem custo extra.
        </p>
      </div>

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {MODULOS.map((m) => (
          <Link key={m.href} href={m.href} className="group block">
            <div
              className={`bg-gradient-to-br ${m.cor} rounded-3xl p-6 h-full hover:shadow-xl ${m.sombra} hover:scale-[1.02] transition-all duration-200 cursor-pointer flex flex-col`}
            >
              {/* Topo */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl leading-none">{m.emoji}</span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/25 text-white tracking-wide">
                  {m.badge}
                </span>
              </div>

              {/* Texto */}
              <h3 className="text-lg font-bold text-white mb-1 leading-tight">{m.label}</h3>
              <p className="text-white/75 text-xs leading-relaxed flex-1 mb-4">{m.desc}</p>

              {/* Rodapé */}
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-[10px] font-medium">BNCC {m.bncc}</span>
                <span className="bg-white/20 group-hover:bg-white/35 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
                  Abrir →
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Card "em breve" */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
          <span className="text-4xl mb-3">✨</span>
          <h3 className="font-bold text-slate-400 mb-1">Mais chegando</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            Ditado, tabuada e muito mais
          </p>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Ferramentas", valor: "12" },
          { label: "Com IA", valor: "4" },
          { label: "Gratuitas", valor: "8" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-slate-800">{stat.valor}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
