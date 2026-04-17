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

const stats = [
  { value: "+5.000", label: "Professores interessados" },
  { value: "< 60s", label: "Para gerar uma aula" },
  { value: "98%", label: "Satisfação dos usuários" },
  { value: "3h+", label: "Economizadas por semana" },
];

export default function ProofSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center bg-blue-50 rounded-2xl p-6">
              <div className="text-3xl font-black text-blue-600 mb-1">{stat.value}</div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Depoimentos</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            Professores que transformaram sua rotina
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-slate-50 rounded-2xl p-6 card-hover border border-slate-100">
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-xs">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
