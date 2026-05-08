const stats = [
  { n: "+5.000", l: "professores ativos" },
  { n: "<60s", l: "para gerar uma aula" },
  { n: "98%", l: "de satisfação" },
  { n: "+3h", l: "economizadas / semana" },
];

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="pb-24 bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-16 mb-12 lg:mb-16 items-end">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />Benefícios</span>
          </div>
          <div>
            <h2
              className="font-fraunces leading-[1] tracking-[-0.032em] mt-3 text-slate-900"
              style={{ fontSize: 'clamp(28px, 6vw, 68px)', fontWeight: 380 }}
            >
              Tudo o que você precisa,{" "}
              <span className="gradient-text" style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                num lugar só.
              </span>
            </h2>
            <p className="text-slate-500 text-[16px] leading-[1.7] mt-4 font-normal max-w-lg">
              Não é mais um chat genérico. Foi treinada com a BNCC, fala a língua do professor brasileiro e ajusta o tom para cada série.
            </p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4 sm:gap-[18px]">

          <div className="col-span-6 sm:col-span-3 bg-gradient-to-br from-blue-50 to-white rounded-[18px] border border-slate-200 shadow-md p-6 sm:p-7 card-hover hover:border-blue-200 hover:shadow-lg">
            <div className="w-11 h-11 bg-white border border-blue-100 rounded-[12px] flex items-center justify-center text-xl">⏱️</div>
            <div
              className="font-fraunces leading-none tracking-[-0.035em] mt-3"
              style={{ fontSize: 'clamp(40px, 8vw, 60px)', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
            >
              <span className="gradient-text" style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>3h+</span>{" "}
              <span className="text-slate-900 text-2xl sm:text-3xl">por semana</span>
            </div>
            <h3 className="font-bold text-slate-900 text-[18px] tracking-[-0.02em] mt-3 mb-2">De volta para você</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">O tempo que ia para o caderno de planejamento agora cabe na sua vida.</p>
          </div>

          <div className="col-span-6 sm:col-span-3 bg-white rounded-[18px] border border-slate-200 shadow-md p-6 sm:p-7 card-hover hover:border-blue-200 hover:shadow-lg">
            <div className="w-11 h-11 bg-blue-50 rounded-[12px] flex items-center justify-center text-xl">🎯</div>
            <h3 className="font-bold text-slate-900 text-[18px] tracking-[-0.02em] mt-3 mb-2">Aulas que engajam</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Atividades, dinâmicas e projetos pensados para o estilo da sua turma. Nada de texto-padrão de apostila.</p>
          </div>

          <div className="col-span-6 sm:col-span-2 bg-white rounded-[18px] border border-slate-200 shadow-md p-6 sm:p-7 card-hover hover:border-blue-200 hover:shadow-lg">
            <div className="w-11 h-11 bg-blue-50 rounded-[12px] flex items-center justify-center text-xl">📚</div>
            <h3 className="font-bold text-slate-900 text-[18px] tracking-[-0.02em] mt-3 mb-2">Conteúdo estruturado</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Abertura, desenvolvimento e fechamento já organizados — não precisa reescrever do zero.</p>
          </div>

          <div className="col-span-6 sm:col-span-2 rounded-[18px] border-transparent shadow-md p-6 sm:p-7 card-hover" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)' }}>
            <div className="w-11 h-11 bg-white/10 rounded-[12px] flex items-center justify-center text-xl">🤖</div>
            <h3 className="font-bold text-white text-[18px] tracking-[-0.02em] mt-3 mb-2">IA atualizada e contextual</h3>
            <p className="text-slate-300 text-sm leading-[1.6]">Modelo treinado para a educação básica brasileira, com a BNCC como referência principal.</p>
          </div>

          <div className="col-span-6 sm:col-span-2 bg-gradient-to-br from-white to-[#f5f3ff] rounded-[18px] border border-slate-200 shadow-md p-6 sm:p-7 card-hover hover:border-blue-200 hover:shadow-lg">
            <div className="w-11 h-11 bg-[#e9d5ff] rounded-[12px] flex items-center justify-center text-xl">⚡</div>
            <h3 className="font-bold text-slate-900 text-[18px] tracking-[-0.02em] mt-3 mb-2">Energia em sala</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Você chega na escola descansado — não esgotado de planejar a aula que ainda vai dar.</p>
          </div>

          <div className="col-span-6 sm:col-span-3 bg-white rounded-[18px] border border-slate-200 shadow-md p-6 sm:p-7 card-hover hover:border-blue-200 hover:shadow-lg">
            <div className="w-11 h-11 bg-blue-50 rounded-[12px] flex items-center justify-center text-xl">📱</div>
            <h3 className="font-bold text-slate-900 text-[18px] tracking-[-0.02em] mt-3 mb-2">Adapta para qualquer série</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Da educação infantil ao ensino médio. Mesmo conteúdo, tom certo para cada faixa etária.</p>
          </div>

          <div className="col-span-6 sm:col-span-3 bg-gradient-to-br from-[#ecfdf5] to-white rounded-[18px] border border-slate-200 shadow-md p-6 sm:p-7 card-hover hover:border-green-200 hover:shadow-lg">
            <div className="w-11 h-11 bg-[#d0fae5] rounded-[12px] flex items-center justify-center text-xl">📝</div>
            <h3 className="font-bold text-slate-900 text-[18px] tracking-[-0.02em] mt-3 mb-2">BNCC sem complicação</h3>
            <p className="text-slate-500 text-sm leading-[1.6]">Cada plano vem com os códigos de habilidade já mapeados. Não precisa abrir o documento de novo.</p>
          </div>

        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-slate-200 mt-12">
          {stats.map((s, i) => (
            <div key={s.n} className={`py-7 sm:py-10 px-4 sm:px-6 ${i < stats.length - 1 ? 'lg:border-r lg:border-slate-200' : ''} ${i === 0 || i === 2 ? 'border-r border-slate-200' : ''}`}>
              <div
                className="font-fraunces text-blue-700 leading-none tracking-[-0.035em]"
                style={{ fontSize: 'clamp(34px, 7vw, 56px)', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
              >
                {s.n}
              </div>
              <div className="text-slate-500 text-[13px] mt-2 font-medium">{s.l}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
