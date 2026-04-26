const benefits = [
  { icon: "⏱️", title: "Economize horas por semana", desc: "Automatize o planejamento e use esse tempo para o que realmente importa" },
  { icon: "⚡", title: "Mais energia em sala", desc: "Chegue às aulas descansado e pronto para engajar seus alunos" },
  { icon: "🎯", title: "Aulas mais envolventes", desc: "Conteúdos estruturados com metodologias ativas e dinâmicas modernas" },
  { icon: "📚", title: "Conteúdo pronto para usar", desc: "Objetivos, atividades, avaliações — tudo gerado automaticamente" },
  { icon: "🤖", title: "IA de última geração", desc: "Tecnologia avançada treinada especificamente para o contexto educacional brasileiro" },
  { icon: "📱", title: "Adaptável a qualquer série", desc: "Da educação infantil ao ensino médio, para qualquer disciplina" },
];

export default function BenefitsSection() {
  return (
    <section className="py-32 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">Por que professores amam</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mt-4 leading-tight">
            Tudo que você precisa em um só lugar
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-8 card-hover border border-slate-100">
              <div className="text-5xl mb-5">{b.icon}</div>
              <h3 className="font-bold text-slate-900 text-xl mb-3">{b.title}</h3>
              <p className="text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
