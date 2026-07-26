const testimonials = [
  {
    name: "Ana Paula Lima",
    role: "Professora · Educação Infantil",
    avatar: "AL",
    bg: "linear-gradient(135deg,#EC4899,#F97316)",
    border: "#FCA5A5",
    text: "Como professora, sempre quis alguém que me ajudasse com as minhas árduas tarefas. Quando encontrei esse aplicativo foi maravilhoso — pediu, tá feito!",
    stars: 5,
  },
  {
    name: "Mariana Costa",
    role: "Professora de Matemática · Fund. I",
    avatar: "MC",
    bg: "linear-gradient(135deg,#7C3AED,#EC4899)",
    border: "#C4B5FD",
    text: "Antes eu passava 3 horas planejando. Agora faço em 5 minutos e ainda tenho energia para dar atenção individual aos meus alunos. Mudou minha vida!",
    stars: 5,
  },
  {
    name: "Rafael Souza",
    role: "Professor de Ciências · Fund. II",
    avatar: "RS",
    bg: "linear-gradient(135deg,#16A34A,#0284C7)",
    border: "#6EE7B7",
    text: "Incrível como a IA entende o contexto educacional brasileiro. As atividades que ela gera são completas e meus alunos adoram. Recomendo para todo professor.",
    stars: 5,
  },
];

export default function ProofSection() {
  return (
    <section id="depoimentos" className="py-24" style={{ background: '#FFFBF0' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14">

        <div className="text-center mb-12">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Depoimentos</span>
          <h2
            className="font-fraunces leading-[.98] tracking-[-0.032em] text-slate-900 mx-auto"
            style={{ fontSize: 'clamp(28px, 6vw, 60px)', fontWeight: 380, maxWidth: 700 }}
          >
            Professoras que{" "}
            <span style={{ color: '#F97316', fontStyle: 'italic', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
              transformaram a rotina.
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-[20px] shadow-md border-2 p-7 hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ borderColor: t.border }}
            >
              <div className="flex mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 italic text-[15px]">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: t.bg }}>
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
