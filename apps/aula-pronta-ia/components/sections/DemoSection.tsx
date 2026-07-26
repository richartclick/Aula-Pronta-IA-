export default function DemoSection() {
  return (
    <section id="demo" className="py-24" style={{ background: '#FFF0F6' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14">

        <div className="text-center mb-10">
          <span className="inline-block bg-pink-100 text-pink-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Veja na prática</span>
          <h2
            className="font-fraunces leading-[.98] tracking-[-0.032em] text-slate-900 mx-auto"
            style={{ fontSize: 'clamp(28px, 6vw, 60px)', fontWeight: 380, maxWidth: 700 }}
          >
            Do tema ao PDF,{" "}
            <span style={{ color: '#EC4899', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>em segundos.</span>
          </h2>
          <p className="text-slate-500 text-[16px] leading-[1.65] mt-4 max-w-lg mx-auto">
            Veja o que acontece quando a professora escolhe "Palavras Cruzadas" e digita apenas o tema.
          </p>
        </div>

        <div className="bg-white border-2 border-pink-100 rounded-[28px] p-4 shadow-xl">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">

            {/* Form side */}
            <div className="p-5 sm:p-8 border-b lg:border-b-0 lg:border-r border-pink-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#EC4899,#F97316)' }}>
                  <span>🔤</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Palavras Cruzadas</p>
                  <p className="text-slate-400 text-xs">Gerado por IA · PDF com gabarito</p>
                </div>
              </div>

              <label className="block text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-2">Tema da atividade</label>
              <div className="rounded-[12px] px-4 py-3 text-[14px] text-pink-800 font-semibold mb-3 border-2 border-pink-200" style={{ background: '#FFF0F6' }}>
                Animais da Floresta
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-2">Série</label>
                  <div className="rounded-[12px] px-4 py-3 text-[14px] text-pink-800 font-semibold border-2 border-pink-200" style={{ background: '#FFF0F6' }}>Ed. Infantil · 5 anos</div>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-2">Dificuldade</label>
                  <div className="rounded-[12px] px-4 py-3 text-[14px] text-pink-800 font-semibold border-2 border-pink-200" style={{ background: '#FFF0F6' }}>Fácil · 4–6 anos</div>
                </div>
              </div>

              <button
                className="w-full text-white font-bold text-[14.5px] py-4 rounded-[14px] flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg,#EC4899,#F97316)', boxShadow: '0 14px 30px -8px rgba(236,72,153,.5)' }}
              >
                ✨ Gerar atividade
              </button>

              <p className="text-center text-slate-400 text-xs mt-3">Sem prompt · PDF em segundos · BNCC incluso</p>
            </div>

            {/* Output side */}
            <div className="p-5 sm:p-8" style={{ background: 'linear-gradient(180deg,#fff,#FFF0F6)' }}>
              <div className="flex items-center justify-between mb-5 gap-3">
                <h4 className="font-fraunces text-slate-900 leading-tight" style={{ fontSize: '21px', fontWeight: 400 }}>
                  Cruzadinha — Animais da Floresta
                </h4>
                <span className="text-[11px] bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full font-bold tracking-[.05em] shrink-0">BNCC EF01LP07</span>
              </div>

              {/* Mini grid preview */}
              <div className="mb-4 p-3 bg-white rounded-[12px] border border-pink-100">
                <div className="grid gap-0.5" style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(7, 28px)' }}>
                  {[
                    [1,0,0,1,0,0,0],
                    [1,0,0,1,0,0,0],
                    [1,1,1,1,1,1,1],
                    [1,0,0,1,0,0,0],
                    [1,0,0,0,0,0,0],
                    [1,0,0,0,0,0,0],
                  ].map((row, ri) => row.map((cell, ci) => (
                    <div
                      key={`${ri}-${ci}`}
                      style={{
                        width: 28, height: 28,
                        background: cell ? '#fff' : '#1e293b',
                        border: cell ? '1px solid #fda4af' : 'none',
                        borderRadius: 3,
                      }}
                    />
                  )))}
                </div>
              </div>

              {[
                { label: "Palavras geradas pela IA", body: "LEAO · TIGRE · URSO · LOBO · RAPOSA (5 palavras encaixadas na grade)" },
                { label: "Pistas", body: "1H. Rei da selva com juba 2H. Felino listrado 3V. Animal grande com pelo marrom 4V. Animal que uiva para a lua", chips: ["Horizontal", "Vertical"] },
                { label: "PDF gerado", body: "2 páginas: folha do aluno (grade vazia + pistas) + gabarito com letras." },
              ].map((block, i) => (
                <div key={block.label} className={`py-3 ${i > 0 ? 'border-t border-dashed border-pink-100' : ''}`}>
                  <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{block.label}</div>
                  <div className="text-[13.5px] text-slate-700 leading-[1.65] mt-1.5">{block.body}</div>
                  {block.chips && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {block.chips.map((c) => (
                        <span key={c} className="text-[11.5px] bg-pink-50 border border-pink-200 text-pink-700 px-3 py-1 rounded-full font-medium">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/demo"
            className="inline-flex items-center gap-2 text-white font-bold py-4 px-8 rounded-full text-[15px] transition-all hover:-translate-y-px shadow-xl"
            style={{ background: 'linear-gradient(135deg,#EC4899,#F97316)', boxShadow: '0 14px 30px -8px rgba(236,72,153,.45)' }}
          >
            Gerar minha atividade agora →
          </a>
        </div>

      </div>
    </section>
  );
}
