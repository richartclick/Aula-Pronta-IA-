const outputItems = [
  { icon: "📋", label: "Objetivos de aprendizagem", detail: "Claros e alinhados à BNCC" },
  { icon: "📖", label: "Conteúdo detalhado", detail: "Estruturado em introdução, desenvolvimento e conclusão" },
  { icon: "🎯", label: "Atividades práticas", detail: "Individuais e em grupo, com instruções" },
  { icon: "📝", label: "Avaliação sugerida", detail: "Critérios e rubrica prontos" },
  { icon: "📦", label: "Recursos necessários", detail: "Lista de materiais e links sugeridos" },
];

export default function DemoSection() {
  return (
    <section id="demo" className="py-32 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wide">Veja em ação</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 leading-tight">
            De ideia a aula completa em segundos
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Input */}
          <div>
            <p className="text-slate-400 text-sm mb-3 font-medium uppercase tracking-wide">Você informa →</p>
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Tema da aula</label>
                  <div className="bg-slate-700 rounded-xl px-4 py-3 text-white text-sm">
                    Frações e números decimais
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Série / Turma</label>
                  <div className="bg-slate-700 rounded-xl px-4 py-3 text-white text-sm">
                    5º Ano — Ensino Fundamental
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Duração</label>
                  <div className="bg-slate-700 rounded-xl px-4 py-3 text-white text-sm">
                    45 minutos
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Estilo de aula</label>
                  <div className="bg-slate-700 rounded-xl px-4 py-3 text-white text-sm">
                    Dinâmico, com atividades em grupo
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
                  ⚡ Gerar aula agora
                </button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div>
            <p className="text-slate-400 text-sm mb-3 font-medium uppercase tracking-wide">A IA entrega →</p>
            <div className="bg-slate-800 rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Aula gerada em 8 segundos</span>
              </div>
              <div className="space-y-3">
                {outputItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 bg-slate-700/50 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-white text-sm font-semibold">{item.label}</p>
                      <p className="text-slate-400 text-xs">{item.detail}</p>
                    </div>
                    <span className="ml-auto text-green-400 text-sm">✓</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-700">
                <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                  📥 Baixar plano de aula
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
