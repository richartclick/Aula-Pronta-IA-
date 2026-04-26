export default function HeroSection() {
  return (
    <section className="gradient-hero min-h-screen flex items-center pt-16 px-4">
      <div className="max-w-6xl mx-auto w-full py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-blue-100 text-sm font-medium">+5.000 professores já usam a plataforma</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Aulas completas em{" "}
              <span className="gradient-text">segundos</span>{" "}
              com IA
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-lg">
              Pare de gastar horas planejando. Descreva sua aula e a IA entrega tudo pronto — objetivos, atividades, avaliação e PDF para imprimir.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="/registro"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black py-4 px-8 rounded-2xl text-lg transition-all shadow-xl shadow-green-500/30"
              >
                Criar minha conta grátis →
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white/10 transition-all"
              >
                Ver como funciona
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> 5 aulas grátis por mês
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Cancele quando quiser
              </div>
            </div>
          </div>

          {/* Right: Product Mock */}
          <div className="animate-float hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-2xl">

              {/* Browser bar */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <div className="flex-1 bg-white/10 rounded-lg px-3 py-1 ml-2">
                  <span className="text-white/40 text-xs">aula-pronta-ia.vercel.app/dashboard/gerar</span>
                </div>
              </div>

              {/* Input card */}
              <div className="bg-white/10 rounded-2xl p-4 mb-3 space-y-2.5">
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/15 rounded-xl px-3 py-2">
                    <p className="text-white/40 text-xs mb-0.5">Tema</p>
                    <p className="text-white text-sm font-semibold">Frações no cotidiano</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-3 py-2">
                    <p className="text-white/40 text-xs mb-0.5">Série</p>
                    <p className="text-white text-sm font-semibold">5º Ano</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-3 py-2">
                    <p className="text-white/40 text-xs mb-0.5">Duração</p>
                    <p className="text-white text-sm font-semibold">45 min</p>
                  </div>
                </div>
                <div className="bg-blue-500/60 rounded-xl px-4 py-2.5 text-center">
                  <span className="text-white text-sm font-black">⚡ Gerar aula agora</span>
                </div>
              </div>

              {/* Result */}
              <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-300 text-sm">🎉</span>
                  <span className="text-emerald-300 text-sm font-bold">Aula gerada em 7 segundos!</span>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: "🎯", label: "Objetivos de aprendizagem", detail: "3 objetivos alinhados à BNCC" },
                    { icon: "📋", label: "Desenvolvimento", detail: "3 etapas com mediação" },
                    { icon: "🎮", label: "Atividades", detail: "Individual + grupo" },
                    { icon: "📝", label: "Avaliação + Para casa", detail: "Formativa e somativa" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5 bg-white/10 rounded-xl px-3 py-2">
                      <span className="text-base">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{item.label}</p>
                        <p className="text-white/50 text-xs">{item.detail}</p>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold">✓</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-blue-500/40 rounded-xl px-4 py-2.5 text-center">
                  <span className="text-white text-xs font-bold">📥 Baixar PDF da aula</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
