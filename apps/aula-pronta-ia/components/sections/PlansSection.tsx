const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0 mt-[3px]"><polyline points="20 6 9 17 4 12" /></svg>
);

export default function PlansSection() {
  return (
    <section id="planos" className="py-24" style={{ background: '#F5F3FF' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14">

        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Planos</span>
          <h2
            className="font-fraunces leading-[.98] tracking-[-0.032em] text-slate-900 mx-auto"
            style={{ fontSize: 'clamp(28px, 6vw, 60px)', fontWeight: 380, maxWidth: 700 }}
          >
            Comece grátis.{" "}
            <span style={{ color: '#7C3AED', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
              Cresça no seu ritmo.
            </span>
          </h2>
          <p className="text-slate-500 text-[16px] leading-[1.65] mt-4 max-w-lg mx-auto">
            Teste sem cartão. Quando precisar de mais atividades, escolha o plano que cabe na sua rotina.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-[18px] items-start">

          {/* Grátis */}
          <div className="bg-white rounded-[20px] border-2 border-purple-100 p-9 flex flex-col hover:border-purple-300 hover:shadow-lg transition-all">
            <h3 className="text-[13px] font-bold tracking-[.14em] uppercase text-purple-400 mb-1.5">Grátis</h3>
            <p className="text-slate-500 text-sm mb-6 leading-[1.5]">Para experimentar a ferramenta no seu ritmo.</p>
            <div className="flex items-start gap-1.5 mb-7">
              <span className="text-[24px] font-fraunces mt-2 text-slate-400" style={{ fontStyle: 'italic' }}>R$</span>
              <span className="font-fraunces text-slate-900 leading-none" style={{ fontSize: '68px', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}>0</span>
              <span className="text-slate-400 text-sm self-end mb-2 font-medium">/ mês</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["5 atividades por mês", "PDF com gabarito", "Alinhamento BNCC", "Suporte por email"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-green-600"><CheckIcon /><span className="text-slate-700">{f}</span></li>
              ))}
            </ul>
            <a href="/registro" className="block text-center border-2 border-purple-200 text-purple-700 font-semibold py-3.5 rounded-[14px] text-sm hover:bg-purple-50 hover:border-purple-500 transition-all">
              Criar conta grátis
            </a>
          </div>

          {/* Básico — destaque */}
          <div
            className="rounded-[20px] p-9 flex flex-col relative sm:-translate-y-3 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
          >
            <span
              className="absolute -top-3 right-6 bg-amber-400 text-slate-900 text-[10.5px] font-black px-4 py-1.5 rounded-full uppercase tracking-[.08em]"
              style={{ boxShadow: '0 8px 20px -6px rgba(251,191,36,.65)' }}
            >
              🔥 Preço de Fundadora
            </span>
            <h3 className="text-[13px] font-bold tracking-[.14em] uppercase text-purple-200 mb-1.5">Básico</h3>
            <p className="text-white/80 text-sm mb-4 leading-[1.6]">Para quem planeja toda semana e quer mais atividades disponíveis.</p>
            <div className="flex items-start gap-1.5 mb-1">
              <span className="text-[24px] font-fraunces mt-2 text-white/70" style={{ fontStyle: 'italic' }}>R$</span>
              <span className="font-fraunces text-white leading-none" style={{ fontSize: '68px', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}>9</span>
              <span className="text-white/70 text-sm self-end mb-2 font-medium">,90 / mês</span>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-white/50 text-sm line-through">R$17,90</span>
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">por 90 dias</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["70 atividades por mês", "PDF com gabarito", "Aula Pronta completa", "Histórico completo", "Suporte prioritário"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDE68A" strokeWidth="2.4" className="shrink-0 mt-[3px]"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/registro"
              className="block text-center text-purple-700 font-black py-3.5 rounded-[14px] text-sm transition-all hover:-translate-y-px hover:brightness-105 bg-white shadow-lg"
            >
              Assinar agora
            </a>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-[20px] border-2 border-purple-100 p-9 flex flex-col hover:border-purple-300 hover:shadow-lg transition-all">
            <h3 className="text-[13px] font-bold tracking-[.14em] uppercase text-purple-400 mb-1.5">Premium</h3>
            <p className="text-slate-500 text-sm mb-6 leading-[1.5]">Para coordenadores e quem ensina muito.</p>
            <div className="flex items-start gap-1.5 mb-7">
              <span className="text-[24px] font-fraunces mt-2 text-slate-400" style={{ fontStyle: 'italic' }}>R$</span>
              <span className="font-fraunces text-slate-900 leading-none" style={{ fontSize: '68px', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}>24</span>
              <span className="text-slate-400 text-sm self-end mb-2 font-medium">,90 / mês</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["Atividades ilimitadas", "Tudo do plano Básico", "Recursos exclusivos", "Personalização por turma", "WhatsApp VIP"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-green-600"><CheckIcon /><span className="text-slate-700">{f}</span></li>
              ))}
            </ul>
            <a href="/registro" className="block text-center border-2 border-purple-200 text-purple-700 font-semibold py-3.5 rounded-[14px] text-sm hover:bg-purple-50 hover:border-purple-500 transition-all">
              Assinar Premium
            </a>
          </div>

        </div>

        <p className="text-center text-slate-400 text-sm mt-8">🔒 Pagamento 100% seguro · Cancele a qualquer momento</p>

      </div>
    </section>
  );
}
