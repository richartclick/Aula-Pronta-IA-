const atividades = [
  { emoji: "🔤", label: "Palavras Cruzadas" },
  { emoji: "🔍", label: "Caça-palavras" },
  { emoji: "🎱", label: "Bingo Pedagógico" },
  { emoji: "🔢", label: "Sudoku" },
  { emoji: "🌀", label: "Labirinto" },
  { emoji: "✏️", label: "Caligrafia" },
  { emoji: "🎯", label: "Forca Temático" },
  { emoji: "🎨", label: "Desenhos para Colorir" },
  { emoji: "🧩", label: "Cruzadinha Silábica" },
  { emoji: "⬛", label: "Pontilhados" },
  { emoji: "➕", label: "Tabuada" },
  { emoji: "🔗", label: "Ligue os Pontos" },
  { emoji: "📐", label: "Sequências Numéricas" },
  { emoji: "🟩", label: "Quadrado Mágico" },
  { emoji: "📋", label: "Aula Pronta" },
];

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24" style={{ background: '#F0FDF4' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14">

        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">15 ferramentas</span>
          <h2
            className="font-fraunces leading-[1] tracking-[-0.032em] text-slate-900 mx-auto"
            style={{ fontSize: 'clamp(28px, 6vw, 60px)', fontWeight: 380, maxWidth: 700 }}
          >
            Tudo o que a professora<br />
            <span style={{ color: '#16A34A', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>precisa, num lugar só.</span>
          </h2>
          <p className="text-slate-500 text-[16px] leading-[1.7] mt-4 max-w-lg mx-auto">
            Não é mais um chat genérico. Foi treinada com a BNCC, fala a língua do professor brasileiro e gera PDFs prontos para imprimir.
          </p>
        </div>

        {/* Grade de atividades */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-12">
          {atividades.map((a) => (
            <div
              key={a.label}
              className="bg-white rounded-[16px] border-2 border-green-100 p-4 flex flex-col items-center gap-2 hover:border-green-400 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <span className="text-3xl">{a.emoji}</span>
              <span className="text-slate-700 text-xs font-semibold text-center leading-tight">{a.label}</span>
            </div>
          ))}
        </div>

        {/* Cards de benefícios */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <div className="rounded-[20px] border-2 border-amber-200 p-7 hover:shadow-lg transition-all" style={{ background: '#FFFBEB' }}>
            <div className="w-12 h-12 bg-amber-100 rounded-[14px] flex items-center justify-center text-2xl mb-4">⏱️</div>
            <div className="font-fraunces text-amber-600 leading-none mb-2" style={{ fontSize: '48px', fontWeight: 380, fontStyle: 'italic' }}>3h+</div>
            <h3 className="font-bold text-slate-900 text-[17px] mb-2">Economizadas por semana</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">O tempo que ia para o planejamento agora vai para os alunos — ou para você descansar.</p>
          </div>

          <div className="rounded-[20px] border-2 border-pink-200 p-7 hover:shadow-lg transition-all" style={{ background: '#FFF0F6' }}>
            <div className="w-12 h-12 bg-pink-100 rounded-[14px] flex items-center justify-center text-2xl mb-4">🚫</div>
            <h3 className="font-bold text-slate-900 text-[17px] mb-2">Sem prompts complicados</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Diferente do ChatGPT, aqui você não precisa saber escrever prompt. Só escolher o que quer.</p>
          </div>

          <div className="rounded-[20px] border-2 border-blue-200 p-7 hover:shadow-lg transition-all" style={{ background: '#EFF6FF' }}>
            <div className="w-12 h-12 bg-blue-100 rounded-[14px] flex items-center justify-center text-2xl mb-4">📄</div>
            <h3 className="font-bold text-slate-900 text-[17px] mb-2">PDF com gabarito incluso</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Cada atividade gera PDF de 2 páginas: folha do aluno + gabarito. Só imprimir e usar.</p>
          </div>

          <div className="rounded-[20px] border-2 border-purple-200 p-7 hover:shadow-lg transition-all" style={{ background: '#F5F3FF' }}>
            <div className="w-12 h-12 bg-purple-100 rounded-[14px] flex items-center justify-center text-2xl mb-4">📚</div>
            <h3 className="font-bold text-slate-900 text-[17px] mb-2">Alinhado à BNCC</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Cada atividade e plano de aula vem com os códigos BNCC já mapeados. Sem abrir o documento.</p>
          </div>

          <div className="rounded-[20px] border-2 border-green-200 p-7 hover:shadow-lg transition-all" style={{ background: '#F0FDF4' }}>
            <div className="w-12 h-12 bg-green-100 rounded-[14px] flex items-center justify-center text-2xl mb-4">🎓</div>
            <h3 className="font-bold text-slate-900 text-[17px] mb-2">Ed. Infantil ao Ensino Médio</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Tom e dificuldade adaptados para cada faixa etária. O mesmo tema, diferente para cada série.</p>
          </div>

          <div className="rounded-[20px] border-2 border-orange-200 p-7 hover:shadow-lg transition-all" style={{ background: '#FFF7ED' }}>
            <div className="w-12 h-12 bg-orange-100 rounded-[14px] flex items-center justify-center text-2xl mb-4">⚡</div>
            <h3 className="font-bold text-slate-900 text-[17px] mb-2">Pronto em menos de 1 minuto</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">A IA gera a atividade completa em segundos. Sem espera, sem formato errado, sem retrabalho.</p>
          </div>

        </div>

      </div>
    </section>
  );
}
