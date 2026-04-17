export default function HeroSection() {
  return (
    <section className="gradient-hero min-h-screen flex items-center pt-16 px-4">
      <div className="max-w-6xl mx-auto w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-200 text-sm font-medium">+5.000 professores na lista de espera</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Crie aulas completas em{" "}
              <span className="gradient-text">minutos</span>{" "}
              com inteligência artificial
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-xl">
              Pare de perder horas planejando aulas. Use a IA para criar conteúdos incríveis com rapidez e qualidade — e volte a amar ensinar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#lead"
                className="animate-pulse-glow inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all"
              >
                👉 Quero testar agora
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white/10 transition-all"
              >
                Ver como funciona
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> 5 aulas grátis
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Sem cartão
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Pronto em segundos
              </div>
            </div>
          </div>

          {/* Right: UI Mock */}
          <div className="animate-float hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-white/60 text-xs ml-2">Aula Pronta IA — Gerando aula...</span>
              </div>

              <div className="bg-slate-900/60 rounded-2xl p-4 mb-4">
                <p className="text-blue-300 text-xs font-mono mb-2">⚡ Gerando aula completa...</p>
                <div className="space-y-2">
                  <div className="h-2 bg-blue-500/40 rounded-full w-full animate-pulse" />
                  <div className="h-2 bg-blue-500/40 rounded-full w-4/5 animate-pulse" />
                  <div className="h-2 bg-blue-500/40 rounded-full w-3/5 animate-pulse" />
                </div>
              </div>

              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-4">
                <p className="text-green-300 text-xs font-semibold mb-2">✅ Aula gerada em 8 segundos!</p>
                <div className="space-y-1.5">
                  {["📋 Objetivos de aprendizagem", "📖 Conteúdo detalhado", "🎯 Atividades práticas", "📝 Avaliação sugerida"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-white/80 text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="text-white/40 text-xs">Frações — 5º Ano — 45 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
