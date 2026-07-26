const pains = [
  { emoji: "⏰", title: "Tempo escasso", desc: "Reuniões, correções e formulários consomem a semana antes mesmo do planejamento começar.", color: "#FEF9C3", border: "#FDE047", icon: "#CA8A04" },
  { emoji: "🧠", title: "Cansaço acumulado", desc: "Criar atividades exige criatividade — algo difícil de reunir depois de horas em sala de aula.", color: "#FCE7F3", border: "#F9A8D4", icon: "#DB2777" },
  { emoji: "📋", title: "Processo lento", desc: "Pesquisar, redigir, formatar e alinhar à BNCC vira um ritual que consome horas preciosas.", color: "#E0F2FE", border: "#7DD3FC", icon: "#0284C7" },
  { emoji: "⚡", title: "Energia esgotada", desc: "A disposição que deveria ir para os alunos já foi embora antes da aula começar.", color: "#DCFCE7", border: "#86EFAC", icon: "#16A34A" },
];

export default function ProblemSection() {
  return (
    <section className="py-24" style={{ background: '#FFF7ED' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14">

        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">O problema</span>
          <h2
            className="font-fraunces leading-[.98] tracking-[-0.032em] text-slate-900 mx-auto"
            style={{ fontSize: 'clamp(28px, 6vw, 60px)', fontWeight: 380, maxWidth: 700 }}
          >
            Planejar bem{" "}
            <span style={{ color: '#F97316', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>leva tempo.</span>
            <br />Tempo que poderia ir para os alunos.
          </h2>
          <p className="text-slate-500 text-[16px] leading-[1.7] mt-5 max-w-lg font-normal mx-auto">
            A rotina docente consome muito mais do que as horas em sala. Planejamento, correções e documentações viram noites e fins de semana perdidos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pains.map((pain) => (
            <div
              key={pain.title}
              className="rounded-[20px] p-7 relative border-2 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: pain.color, borderColor: pain.border }}
            >
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[24px] mb-5 bg-white/70">
                {pain.emoji}
              </div>
              <h3 className="font-bold text-slate-900 text-[17px] tracking-[-0.02em] mb-2">{pain.title}</h3>
              <p className="text-slate-600 text-[13.5px] leading-[1.65]">{pain.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
