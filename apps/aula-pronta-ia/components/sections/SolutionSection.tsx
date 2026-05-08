const steps = [
  {
    n: "— passo 01",
    title: "Descreva sua aula",
    desc: "Tema, série, duração e o perfil da turma. Quanto mais detalhes, mais personalizado fica o resultado.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.6"><path d="M4 19h16M4 5h16M4 12h10" /></svg>
    ),
  },
  {
    n: "— passo 02",
    title: "A IA monta tudo",
    desc: "Em segundos, ela organiza objetivos da BNCC, conteúdo estruturado, atividades e critérios de avaliação.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
    ),
  },
  {
    n: "— passo 03",
    title: "Aula na sua mão",
    desc: "Ajuste o que quiser, exporte em PDF ou Word e leve para a sala — ou direto para o coordenador.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.6"><path d="M5 13l4 4L19 7" /></svg>
    ),
  },
];

export default function SolutionSection() {
  return (
    <section id="como" className="pb-24 bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div
          className="rounded-[24px] sm:rounded-[28px] px-6 sm:px-10 md:px-14 py-12 sm:py-[74px] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(40% 60% at 90% 10%, rgba(167,139,250,.28), transparent 70%), radial-gradient(40% 60% at 10% 90%, rgba(96,165,250,.30), transparent 70%)',
            }}
          />

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-16 mb-10 lg:mb-16 items-end relative">
            <div>
              <span className="eyebrow" style={{ color: '#cbd5e1' }}>
                <span className="eyebrow-dot" style={{ background: '#a78bfa', boxShadow: '0 0 0 4px rgba(167,139,250,.25)' }} />
                Como funciona
              </span>
            </div>
            <div>
              <h2
                className="font-fraunces leading-[1] tracking-[-0.032em] mt-3 text-white"
                style={{ fontSize: 'clamp(28px, 6vw, 68px)', fontWeight: 380 }}
              >
                Da ideia ao plano{" "}
                <span style={{ color: '#c4b5fd', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                  em três passos simples.
                </span>
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 relative">
            {steps.map((step) => (
              <div key={step.title} className="pt-7 border-t border-white/20">
                <span className="text-[#c4b5fd] text-sm tracking-[.04em]" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                  {step.n}
                </span>
                <h3
                  className="font-fraunces text-white mt-3 mb-3 leading-tight tracking-[-0.025em]"
                  style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
                >
                  {step.title}
                </h3>
                <p className="text-slate-300 text-[14px] leading-[1.65] font-normal">{step.desc}</p>
                <div className="mt-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
