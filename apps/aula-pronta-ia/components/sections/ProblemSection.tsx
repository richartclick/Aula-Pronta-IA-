const pains = [
  { num: "01", emoji: "⏰", title: "Tempo escasso", desc: "Reuniões, correções e preenchimento de formulários consomem a semana antes mesmo do planejamento começar." },
  { num: "02", emoji: "🧠", title: "Cansaço acumulado", desc: "Criar aulas exige criatividade — algo difícil de reunir depois de horas em sala." },
  { num: "03", emoji: "📋", title: "Processo lento", desc: "Pesquisar, redigir, formatar e alinhar à BNCC vira um ritual que consome horas preciosas." },
  { num: "04", emoji: "⚡", title: "Energia esgotada", desc: "A disposição que deveria ir para os alunos já foi embora antes da aula começar." },
];

export default function ProblemSection() {
  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14">

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-16 mb-12 lg:mb-16 items-end">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />O problema</span>
          </div>
          <div>
            <h2
              className="font-fraunces leading-[.98] tracking-[-0.032em] mt-3 text-slate-900"
              style={{ fontSize: 'clamp(28px, 6vw, 68px)', fontWeight: 380 }}
            >
              Planejar bem{" "}
              <span className="gradient-text" style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>leva tempo.</span>
              <br />Tempo que poderia ir para os alunos.
            </h2>
            <p className="text-slate-500 text-[16px] leading-[1.7] mt-5 max-w-lg font-normal">
              A rotina docente consome muito mais do que as horas em sala. Planejamento, correções e documentações viram noites e fins de semana perdidos.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pains.map((pain) => (
            <div key={pain.title} className="bg-white rounded-[18px] border border-slate-200 shadow-md p-7 relative card-hover hover:border-blue-200 hover:shadow-lg">
              <span
                className="absolute top-4 right-5 font-fraunces text-slate-100 text-[46px] leading-none pointer-events-none select-none"
                style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                {pain.num}
              </span>
              <div className="w-12 h-12 bg-blue-50 rounded-[13px] flex items-center justify-center text-[22px] mb-5">{pain.emoji}</div>
              <h3 className="font-bold text-slate-900 text-[17px] tracking-[-0.02em] mb-2">{pain.title}</h3>
              <p className="text-slate-500 text-[13.5px] leading-[1.65]">{pain.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
