export default function DemoSection() {
  return (
    <section id="demo" className="py-32 px-4 sm:px-8 lg:px-16 bg-[#fafafa]" style={{ paddingTop: 0 }}>
      <div className="max-w-[1240px] mx-auto">

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 mb-10 items-end">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />Veja na prática</span>
          </div>
          <div>
            <h2
              className="font-fraunces leading-[.98] tracking-[-0.032em] mt-3 text-slate-900"
              style={{ fontSize: 'clamp(38px, 5.2vw, 72px)', fontWeight: 380 }}
            >
              Da descrição ao plano,{" "}
              <span className="gradient-text" style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                em um respiro.
              </span>
            </h2>
            <p className="text-slate-500 text-[16.5px] leading-[1.65] mt-4 font-normal max-w-lg">
              Veja o que sai do outro lado quando você descreve uma aula simples. Direto ao que funciona em sala.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[28px] p-4 shadow-lg">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">

            {/* Form side */}
            <div className="p-8 lg:border-r border-slate-200">
              <label className="block text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-2">Tópico da aula</label>
              <div className="bg-blue-50 rounded-[12px] px-4 py-3 text-[14px] text-slate-700 font-semibold mb-3 border border-transparent">
                Sistema solar — planetas internos e externos
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-2">Série</label>
                  <div className="bg-blue-50 rounded-[12px] px-4 py-3 text-[14px] text-slate-700 font-semibold border border-transparent">5º ano · Fund. I</div>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-2">Duração</label>
                  <div className="bg-blue-50 rounded-[12px] px-4 py-3 text-[14px] text-slate-700 font-semibold border border-transparent">50 minutos</div>
                </div>
              </div>

              <label className="block text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-2 mt-1">Estilo da turma</label>
              <div className="bg-blue-50 rounded-[12px] px-4 py-3 text-[14px] text-slate-700 font-semibold mb-4 border border-transparent">
                Visual e prática · 28 alunos · agitada à tarde
              </div>

              <button
                className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold text-[14.5px] py-4 rounded-[12px] flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
                style={{ boxShadow: '0 18px 40px -12px rgba(29,78,216,.45)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7" /></svg>
                Gerar plano de aula
              </button>
            </div>

            {/* Output side */}
            <div className="p-8" style={{ background: 'linear-gradient(180deg, #fff, #f8fafc)' }}>
              <div className="flex items-center justify-between mb-5 gap-3">
                <h4
                  className="font-fraunces text-slate-900 leading-tight"
                  style={{ fontSize: '23px', fontWeight: 400, fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
                >
                  Plano — Sistema Solar
                </h4>
                <span className="text-[11px] bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold tracking-[.05em] shrink-0">BNCC EF05CI11</span>
              </div>

              {[
                { label: "Objetivo de aprendizagem", body: "Reconhecer a organização do sistema solar e diferenciar planetas internos de externos pela composição e distância em relação ao Sol." },
                { label: "Desenvolvimento", body: "Vídeo curto de abertura (5 min) → maquete coletiva com isopor (25 min) → discussão guiada por perguntas-chave (15 min) → síntese visual (5 min)." },
                { label: "Atividade prática", body: "Em grupos, cada equipe representa um planeta e produz um cartaz com três fatos surpreendentes.", chips: ["Trabalho em grupo", "Visual", "Oral"] },
                { label: "Avaliação", body: "Rubrica por critério: clareza (0–3), criatividade (0–3), grupo (0–4). Total 10 pontos." },
              ].map((block, i) => (
                <div key={block.label} className={`py-3 ${i > 0 ? 'border-t border-dashed border-slate-200' : ''}`}>
                  <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{block.label}</div>
                  <div className="text-[13.5px] text-slate-700 leading-[1.65] mt-1.5">{block.body}</div>
                  {block.chips && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {block.chips.map((c) => (
                        <span key={c} className="text-[11.5px] bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
