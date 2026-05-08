const pains = [
  { num: "01", emoji: "⏰", title: "Sem tempo", desc: "Conselhos, correções e diários consomem a semana antes mesmo da aula começar." },
  { num: "02", emoji: "🧠", title: "Cansaço mental", desc: "Planejar exige criatividade — algo difícil depois de oito horas em pé na sala." },
  { num: "03", emoji: "📋", title: "Tudo lento", desc: "Pesquisar, escrever, formatar e alinhar à BNCC vira um ritual de três a quatro horas." },
  { num: "04", emoji: "⚡", title: "Energia no chão", desc: "A pilha que devia ir para a turma já gastou no caderno de planejamento." },
];

export default function ProblemSection() {
  return (
    <section className="py-32 px-7 bg-[#fafafa]">
      <div className="max-w-[1240px] mx-auto">

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 mb-16 items-end">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />O peso invisível</span>
          </div>
          <div>
            <h2
              className="font-fraunces leading-[.98] tracking-[-0.032em] mt-3 text-slate-900"
              style={{ fontSize: 'clamp(38px, 5.2vw, 72px)', fontWeight: 380 }}
            >
              A escola levou{" "}
              <span className="gradient-text" style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>seu domingo</span>
              —<br />e não devolveu.
            </h2>
            <p className="text-slate-500 text-[16.5px] leading-[1.65] mt-4 max-w-lg font-normal">
              A rotina docente come o que sobra de criatividade. Antes da IA, fazer um plano decente custava um sábado inteiro — o sábado que era para a família.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {pains.map((pain) => (
            <div key={pain.title} className="bg-white rounded-[18px] border border-slate-200 p-7 relative card-hover hover:border-blue-200">
              <span
                className="absolute top-4 right-5 font-fraunces text-slate-100 text-[46px] leading-none pointer-events-none select-none"
                style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                {pain.num}
              </span>
              <div className="w-12 h-12 bg-blue-50 rounded-[13px] flex items-center justify-center text-[22px] mb-5">{pain.emoji}</div>
              <h3 className="font-bold text-slate-900 text-[18.5px] tracking-[-0.02em] mb-2">{pain.title}</h3>
              <p className="text-slate-500 text-sm leading-[1.6]">{pain.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
