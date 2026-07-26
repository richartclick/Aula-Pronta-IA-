const steps = [
  {
    n: "01",
    emoji: "🎯",
    title: "Escolha a atividade",
    desc: "Palavras Cruzadas, Bingo, Sudoku, Caça-palavras, Aula Pronta e muito mais. Só clicar no que quer.",
  },
  {
    n: "02",
    emoji: "✏️",
    title: "Informe o tema e o ano",
    desc: "Nada de prompt complicado. Só diga o tema (ex: Animais) e a faixa etária — a IA faz o resto.",
  },
  {
    n: "03",
    emoji: "📄",
    title: "Baixe o PDF pronto",
    desc: "Em segundos o PDF sai completo, com gabarito, alinhado à BNCC e pronto para imprimir.",
  },
];

export default function SolutionSection() {
  return (
    <section id="como" className="py-24" style={{ background: '#FFFBF0' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14">
        <div
          className="rounded-[28px] px-6 sm:px-10 md:px-14 py-12 sm:py-[74px] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 60%, #F97316 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(40% 60% at 90% 10%, rgba(255,255,255,.15), transparent 70%), radial-gradient(40% 60% at 10% 90%, rgba(255,255,255,.10), transparent 70%)',
            }}
          />

          <div className="text-center mb-12 relative">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Como funciona</span>
            <h2
              className="font-fraunces leading-[1] tracking-[-0.032em] text-white mx-auto"
              style={{ fontSize: 'clamp(28px, 6vw, 60px)', fontWeight: 380 }}
            >
              Da ideia à atividade{" "}
              <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100', color: '#FDE68A' }}>
                em três passos.
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 relative">
            {steps.map((step, i) => (
              <div key={step.title} className="bg-white/15 backdrop-blur-sm rounded-[20px] p-7 border border-white/25 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center font-bold text-white text-sm">{step.n}</span>
                  <span className="text-3xl">{step.emoji}</span>
                </div>
                <h3 className="font-bold text-white text-[19px] tracking-[-0.02em] mb-3">{step.title}</h3>
                <p className="text-white/80 text-[14px] leading-[1.65]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 relative">
            <a
              href="/demo"
              className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold py-4 px-8 rounded-full text-[15px] hover:bg-white/90 transition-all shadow-2xl"
            >
              Experimentar grátis agora →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
