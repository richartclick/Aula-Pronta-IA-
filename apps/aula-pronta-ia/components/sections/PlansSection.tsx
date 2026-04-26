const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    color: "border-slate-200",
    badge: null,
    cta: "Começar grátis",
    ctaStyle: "bg-green-500 hover:bg-green-400 text-white font-bold",
    features: [
      "5 aulas por mês",
      "Todos os formatos de aula",
      "Download em PDF",
      "Suporte por email",
    ],
    missing: ["Aulas ilimitadas", "Prioridade no suporte", "Recursos premium"],
  },
  {
    name: "Básico",
    price: "R$ 29,90",
    period: "por mês",
    color: "border-blue-500 ring-2 ring-blue-500",
    badge: "Mais popular",
    badgeColor: "bg-blue-600",
    cta: "Assinar agora",
    ctaStyle: "bg-green-500 hover:bg-green-400 text-white font-bold",
    features: [
      "Aulas ilimitadas",
      "Todos os formatos de aula",
      "Download em PDF e Word",
      "Suporte prioritário",
      "Novidades em primeira mão",
    ],
    missing: ["Recursos premium exclusivos"],
  },
  {
    name: "Premium",
    price: "R$ 39,90",
    period: "por mês",
    color: "border-yellow-400",
    badge: "Completo",
    badgeColor: "bg-yellow-500",
    cta: "Assinar Premium",
    ctaStyle: "bg-yellow-500 hover:bg-yellow-400 text-white",
    features: [
      "Tudo do Básico",
      "Recursos premium exclusivos",
      "Banco de atividades extras",
      "Suporte VIP via WhatsApp",
      "Acesso antecipado a novidades",
      "Personalização por turma",
    ],
    missing: [],
  },
];

export default function PlansSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Planos</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            Comece grátis. Cresça no seu ritmo.
          </h2>
          <p className="text-slate-600 mt-3">Sem compromisso. Cancele quando quiser.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border-2 ${plan.color} p-6 card-hover relative flex flex-col`}>
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.badgeColor} text-white text-xs font-bold px-4 py-1 rounded-full`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm mb-1">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500 font-bold">✓</span> {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-slate-300">✗</span> {f}
                  </li>
                ))}
              </ul>

              <a
                href="/registro"
                className={`block text-center py-3 px-6 rounded-xl transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          🔒 Pagamento 100% seguro · Cancele a qualquer momento
        </p>
      </div>
    </section>
  );
}
