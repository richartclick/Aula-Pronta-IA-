const marqueeItems = ["Palavras Cruzadas", "Caça-palavras", "Bingo Pedagógico", "Sudoku", "Labirinto", "Desenhos para Colorir", "Caligrafia", "Forca Temático", "Sequências Numéricas", "Tabuada", "Aula Pronta", "Cruzadinha Silábica"];

export default function HeroSection() {
  return (
    <section className="overflow-hidden" style={{ background: '#FFFBF0' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-12 lg:pt-20 pb-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 bg-white border border-orange-200 rounded-full px-4 py-2 mb-5 shadow-sm">
              <span className="text-white text-[10.5px] font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ background: 'linear-gradient(135deg,#F97316,#EC4899)' }}>novo</span>
              <span className="text-slate-700 text-sm font-medium">IA brasileira treinada com a BNCC</span>
            </div>

            <h1
              className="font-fraunces leading-[0.95] tracking-[-0.035em] mt-3 text-slate-900"
              style={{ fontSize: 'clamp(30px, 5.2vw, 66px)', fontWeight: 380 }}
            >
              Palavras Cruzadas,<br />
              Bingo, Desenhos<br />
              <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100', color: '#F97316' }}>
                e Aula Pronta
              </span>
              {" "}—{" "}
              <span style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100', WebkitTextStroke: '1.5px #1e293b', color: 'transparent' }}>
                em PDF, em segundos.
              </span>
            </h1>

            <p className="text-[16px] text-slate-600 leading-[1.75] mt-6 mb-4 max-w-lg font-normal mx-auto lg:mx-0">
              Sem precisar escrever prompts. Escolha a atividade, o ano e o tema — o PDF sai pronto para imprimir.
            </p>

            {/* Depoimento hero */}
            <div className="bg-white border-l-4 border-pink-400 rounded-2xl px-5 py-4 mb-8 text-left shadow-sm max-w-lg mx-auto lg:mx-0">
              <p className="text-slate-700 text-sm italic leading-relaxed">
                ❝ Como professora, sempre quis alguém que me ajudasse com as minhas tarefas. Quando encontrei esse aplicativo foi maravilhoso — pediu, tá feito. ❞
              </p>
              <p className="text-pink-600 text-xs font-bold mt-2">— Ana Paula · Professora de Educação Infantil</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
              <a
                href="/demo"
                className="inline-flex items-center gap-2 text-white font-semibold py-4 px-7 rounded-full text-[15px] transition-all hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg,#F97316,#EC4899)', boxShadow: '0 18px 40px -12px rgba(249,115,22,.5)' }}
              >
                Gerar minha primeira atividade grátis →
              </a>
              <a
                href="/registro"
                className="inline-flex items-center gap-2 border-2 border-slate-300 bg-white/70 text-slate-800 font-semibold py-4 px-7 rounded-full text-[15px] hover:bg-white hover:border-slate-900 transition-all"
              >
                Criar conta grátis
              </a>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-slate-500 font-medium justify-center lg:justify-start">
              {["5 atividades grátis por mês", "PDF em segundos", "Sem prompts"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12" /></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Video placeholder + badges */}
          <div className="relative flex items-center justify-center min-h-[320px] sm:min-h-[500px]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(50% 50% at 75% 25%, rgba(251,191,36,.4), transparent 70%), radial-gradient(45% 55% at 15% 80%, rgba(236,72,153,.3), transparent 70%)',
                filter: 'blur(30px)',
              }}
            />

            {/* Badge tempo */}
            <div className="absolute top-8 left-0 z-10 bg-white rounded-2xl shadow-lg border border-amber-200 px-4 py-3 hidden sm:flex items-center gap-3" style={{ transform: 'rotate(-5deg)' }}>
              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-sm shrink-0">⚡</div>
              <div>
                <p className="font-bold text-slate-900 text-sm leading-none">52s</p>
                <p className="text-slate-500 text-[11.5px] mt-0.5">para gerar a atividade</p>
              </div>
            </div>

            {/* Badge atividades */}
            <div className="absolute bottom-24 right-0 z-10 bg-white rounded-2xl shadow-lg border border-pink-200 px-4 py-2 hidden sm:flex items-center gap-2" style={{ transform: 'rotate(3deg)' }}>
              <span className="text-lg">🧩</span>
              <span className="text-slate-700 text-xs font-semibold">15 tipos de atividade</span>
            </div>

            {/* Video placeholder */}
            <div
              className="relative z-[1] w-full max-w-[310px] sm:max-w-[460px] rounded-3xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center border-4 border-white"
              style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 50%, #FDBA74 100%)' }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-400 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#F97316"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
                <span className="text-sm font-bold text-orange-700">Vídeo em breve</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Marquee strip */}
      <div className="mt-16 lg:mt-20 py-5 overflow-hidden" style={{ background: 'linear-gradient(135deg,#F97316,#EC4899)' }}>
        <div className="animate-marquee">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center shrink-0" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '22px', color: 'white' }}>
              {marqueeItems.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center">
                  <span className="px-10">{item}</span>
                  <span className="px-2" style={{ fontFamily: 'Manrope, sans-serif', fontStyle: 'normal', fontSize: '14px', fontWeight: 700 }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
