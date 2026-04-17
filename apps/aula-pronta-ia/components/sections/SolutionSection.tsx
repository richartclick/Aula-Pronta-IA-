const steps = [
  { num: "01", title: "Descreva sua aula", desc: "Informe o tema, a série e o tempo disponível" },
  { num: "02", title: "A IA trabalha", desc: "Nossa inteligência artificial cria o conteúdo completo em segundos" },
  { num: "03", title: "Aula pronta!", desc: "Receba um plano de aula completo, pronto para aplicar em sala" },
];

export default function SolutionSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">A solução</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-6">
              Conheça a{" "}
              <span className="text-blue-600">Aula Pronta IA</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Uma plataforma desenvolvida especialmente para professores que querem recuperar seu tempo, sua criatividade e sua paixão pelo ensino.
            </p>

            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-black text-sm">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#lead"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-base transition-all mt-8"
            >
              Quero começar agora →
            </a>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <p className="text-slate-400 text-xs mb-3 font-medium">ANTES — SEM A PLATAFORMA</p>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-bold text-slate-900">3–4 horas</p>
                  <p className="text-slate-500 text-xs">para planejar 1 aula</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">😩</span>
                <div>
                  <p className="font-bold text-slate-900">Esgotamento</p>
                  <p className="text-slate-500 text-xs">ao chegar em sala</p>
                </div>
              </div>
            </div>

            <div className="text-center my-3">
              <span className="text-2xl">⬇️</span>
            </div>

            <div className="bg-green-600 rounded-2xl p-6 text-white">
              <p className="text-green-200 text-xs mb-3 font-medium">DEPOIS — COM A AULA PRONTA IA</p>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-bold">Menos de 1 minuto</p>
                  <p className="text-green-200 text-xs">para gerar uma aula completa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-bold">Energia e criatividade</p>
                  <p className="text-green-200 text-xs">para seus alunos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
