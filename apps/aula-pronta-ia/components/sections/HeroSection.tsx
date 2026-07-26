const marqueeItems = ["Educação Infantil", "Anos Iniciais", "Anos Finais", "Ensino Médio", "EJA", "Educação Especial"];

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#fafafa]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 pt-12 lg:pt-20 pb-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-2 mb-4 shadow-sm">
              <span className="bg-blue-700 text-white text-[10.5px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">novo</span>
              <span className="text-slate-700 text-sm font-medium">IA brasileira treinada com a BNCC</span>
            </div>

            <h1
              className="font-fraunces leading-[0.92] tracking-[-0.035em] mt-3 text-slate-900"
              style={{ fontSize: 'clamp(32px, 5.5vw, 72px)', fontWeight: 380 }}
            >
              A semana<br />
              <span className="gradient-text" style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                devolvida
              </span>
              <br />
              <span style={{ WebkitTextStroke: '1.5px #0f172a', color: 'transparent', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                ao professor.
              </span>
            </h1>

            <p className="text-[16px] text-slate-600 leading-[1.75] mt-8 mb-9 max-w-lg font-normal mx-auto lg:mx-0">
              Descreva o conteúdo da sua aula, aguarde alguns segundos e receba o plano completo — objetivos, atividades, avaliação e PDF para imprimir. Tudo alinhado à BNCC.
            </p>

            <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
              <a
                href="/demo"
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold py-4 px-7 rounded-full text-[15px] transition-all hover:-translate-y-px"
                style={{ boxShadow: '0 18px 40px -12px rgba(29,78,216,.45)' }}
              >
                Gerar minha primeira aula grátis →
              </a>
              <a
                href="/registro"
                className="inline-flex items-center gap-2 border border-slate-300 bg-white/60 text-slate-800 font-semibold py-4 px-7 rounded-full text-[15px] hover:bg-white hover:border-slate-900 transition-all"
              >
                Criar conta grátis
              </a>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-slate-500 font-medium justify-center lg:justify-start">
              <span className="flex items-center gap-2">
                <svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12" /></svg>
                5 aulas grátis por mês
              </span>
              <span className="flex items-center gap-2">
                <svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12" /></svg>
                Pronto em 30 segundos
              </span>
              <span className="flex items-center gap-2">
                <svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12" /></svg>
                Para todas as disciplinas
              </span>
            </div>
          </div>

          {/* Right: Video Ana */}
          <div className="relative flex items-center justify-center min-h-[320px] sm:min-h-[500px]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(50% 50% at 75% 25%, rgba(167,139,250,.45), transparent 70%), radial-gradient(45% 55% at 15% 80%, rgba(29,78,216,.35), transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
            <div className="absolute top-8 left-0 z-10 bg-white rounded-2xl shadow-lg border border-slate-200 px-4 py-3 hidden sm:flex items-center gap-3" style={{ transform: 'rotate(-5deg)' }}>
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-sm shrink-0">⚡</div>
              <div>
                <p className="font-bold text-slate-900 text-sm leading-none">52s</p>
                <p className="text-slate-500 text-[11.5px] mt-0.5">para gerar a aula</p>
              </div>
            </div>
            {/* ESPAÇO RESERVADO PARA VÍDEO — substituir pelo vídeo final quando estiver pronto */}
            <div className="relative z-[1] w-full max-w-[310px] sm:max-w-[460px] rounded-2xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)' }}
            >
              <div className="flex flex-col items-center gap-3 text-white/70">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" opacity="0.8"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
                <span className="text-sm font-medium tracking-wide">Vídeo em breve</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Marquee strip */}
      <div className="mt-16 lg:mt-20 bg-slate-900 py-5 overflow-hidden">
        <div className="animate-marquee">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center shrink-0" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '22px', color: '#e2e8f0', opacity: 0.94 }}>
              {marqueeItems.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center">
                  <span className="px-10">{item}</span>
                  <span className="gradient-text px-2" style={{ fontFamily: 'Manrope, sans-serif', fontStyle: 'normal', fontSize: '14px', fontWeight: 700 }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
