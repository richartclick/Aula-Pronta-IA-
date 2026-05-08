const testimonials = [
  {
    name: "Mariana Costa",
    role: "Professora de Matemática • Ensino Fundamental",
    avatar: "MC",
    color: "bg-blue-600",
    text: "Antes eu passava 3 horas planejando cada aula. Agora faço isso em 5 minutos e ainda tenho energia para dar atenção individual aos meus alunos. Mudou minha vida!",
    stars: 5,
  },
  {
    name: "Rafael Souza",
    role: "Professor de Ciências • Ensino Médio",
    avatar: "RS",
    color: "bg-green-600",
    text: "Incrível como a IA entende o contexto educacional brasileiro. As aulas que ela gera são completas, com atividades práticas e tudo. Recomendo para todo professor.",
    stars: 5,
  },
  {
    name: "Ana Paula Lima",
    role: "Professora • Educação Infantil",
    avatar: "AL",
    color: "bg-purple-600",
    text: "Voltei a gostar de planejar as aulas! A plataforma gera atividades lúdicas perfeitas para minha turma. É como ter uma assistente particular.",
    stars: 5,
  },
];

export default function ProofSection() {
  return (
    <section id="depoimentos" className="py-32 px-4 sm:px-8 lg:px-16 bg-[#fafafa]" style={{ paddingTop: 0 }}>
      <div className="max-w-[1240px] mx-auto">

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 mb-16 items-end">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />Depoimentos</span>
          </div>
          <div>
            <h2
              className="font-fraunces leading-[.98] tracking-[-0.032em] mt-3 text-slate-900"
              style={{ fontSize: 'clamp(38px, 5.2vw, 72px)', fontWeight: 380 }}
            >
              Professores que{" "}
              <span className="gradient-text" style={{ fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                transformaram a rotina.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-slate-50 rounded-2xl p-8 card-hover border border-slate-100">
              <div className="flex mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${t.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-slate-400 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
