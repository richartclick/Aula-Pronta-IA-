const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0 mt-[3px]"><polyline points="20 6 9 17 4 12" /></svg>
);

export default function PlansSection() {
  return (
    <section id="planos" className="pb-24 bg-[#fafafa]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14">

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-16 mb-12 lg:mb-16 items-end">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />Planos</span>
          </div>
          <div>
            <h2
              className="font-fraunces leading-[.98] tracking-[-0.032em] mt-3 text-slate-900"
              style={{ fontSize: 'clamp(28px, 6vw, 68px)', fontWeight: 380 }}
            >
              Comece grátis.<br />
              <span className="gradient-text" style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                Cresça no seu ritmo.
              </span>
            </h2>
            <p className="text-slate-500 text-[16.5px] leading-[1.65] mt-4 font-normal max-w-lg">
              Teste sem cartão. Quando precisar de mais que cinco aulas no mês, escolha o plano que cabe.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-[18px] items-start">

          {/* Gratuito */}
          <div className="bg-white rounded-[18px] border border-slate-200 p-9 flex flex-col">
            <h3 className="text-[13px] font-bold tracking-[.14em] uppercase text-slate-500 mb-1.5">Grátis</h3>
            <p className="text-slate-500 text-sm mb-6 leading-[1.5]">Para experimentar a ferramenta no seu ritmo.</p>
            <div className="flex items-start gap-1.5 mb-7">
              <span className="text-[24px] font-fraunces mt-2 text-slate-500" style={{ fontStyle: 'italic' }}>R$</span>
              <span className="font-fraunces text-slate-900 leading-none" style={{ fontSize: '68px', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}>0</span>
              <span className="text-slate-500 text-sm self-end mb-2 font-medium">/ mês</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1 text-slate-700">
              {["5 aulas por mês", "Exportação em PDF", "Alinhamento BNCC", "Suporte por email"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-green-600"><CheckIcon /><span className="text-slate-700">{f}</span></li>
              ))}
            </ul>
            <a href="/registro" className="block text-center border-2 border-slate-200 text-slate-700 font-semibold py-3.5 rounded-[12px] text-sm hover:bg-slate-50 hover:border-slate-900 transition-all">
              Criar conta grátis
            </a>
          </div>

          {/* Básico — destaque */}
          <div
            className="rounded-[18px] p-9 flex flex-col relative sm:-translate-y-3 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)' }}
          >
            <span className="absolute -top-3 right-6 bg-[#ff6568] text-white text-[10.5px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[.08em]" style={{ boxShadow: '0 8px 20px -6px rgba(255,101,104,.55)' }}>
              Mais popular
            </span>
            <h3 className="text-[13px] font-bold tracking-[.14em] uppercase text-[#c4b5fd] mb-1.5">Básico</h3>
            <p className="text-slate-300 text-sm mb-6 leading-[1.6]">Para quem planeja toda semana e quer mais aulas disponíveis.</p>
            <div className="flex items-start gap-1.5 mb-7">
              <span className="text-[24px] font-fraunces mt-2 text-slate-300" style={{ fontStyle: 'italic' }}>R$</span>
              <span className="font-fraunces text-white leading-none" style={{ fontSize: '68px', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}>29</span>
              <span className="text-slate-300 text-sm self-end mb-2 font-medium">,90 / mês</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["70 aulas por mês", "Exportação em PDF e Word", "Histórico completo", "Atividades adaptadas por estilo", "Suporte prioritário"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#e2e8f0]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b9f8cf" strokeWidth="2.4" className="shrink-0 mt-[3px]"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/registro"
              className="block text-center text-white font-bold py-3.5 rounded-[12px] text-sm transition-all hover:-translate-y-px hover:brightness-105"
              style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', boxShadow: '0 14px 28px -8px rgba(167,139,250,.55)' }}
            >
              Assinar agora
            </a>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-[18px] border border-slate-200 p-9 flex flex-col">
            <h3 className="text-[13px] font-bold tracking-[.14em] uppercase text-slate-500 mb-1.5">Premium</h3>
            <p className="text-slate-500 text-sm mb-6 leading-[1.5]">Para coordenadores e quem ensina muito.</p>
            <div className="flex items-start gap-1.5 mb-7">
              <span className="text-[24px] font-fraunces mt-2 text-slate-500" style={{ fontStyle: 'italic' }}>R$</span>
              <span className="font-fraunces text-slate-900 leading-none" style={{ fontSize: '68px', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}>39</span>
              <span className="text-slate-500 text-sm self-end mb-2 font-medium">,90 / mês</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["Aulas ilimitadas", "Tudo do plano Básico", "Recursos e atividades exclusivas", "Personalização por turma", "WhatsApp VIP com a equipe"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-green-600"><CheckIcon /><span className="text-slate-700">{f}</span></li>
              ))}
            </ul>
            <a href="/registro" className="block text-center border-2 border-slate-200 text-slate-700 font-semibold py-3.5 rounded-[12px] text-sm hover:bg-slate-50 hover:border-slate-900 transition-all">
              Assinar Premium
            </a>
          </div>

        </div>

        <p className="text-center text-slate-400 text-sm mt-8">🔒 Pagamento 100% seguro via Stripe · Cancele a qualquer momento</p>

      </div>
    </section>
  );
}
