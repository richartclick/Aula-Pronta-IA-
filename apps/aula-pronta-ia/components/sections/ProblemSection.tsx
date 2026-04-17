const pains = [
  { emoji: "😓", title: "Falta de tempo", desc: "Horas planejando aulas depois de um dia exaustivo de trabalho" },
  { emoji: "🧠", title: "Esgotamento mental", desc: "Criatividade em baixa depois de lidar com turmas cheias" },
  { emoji: "📋", title: "Planejamento demorado", desc: "Cada aula leva horas para estruturar do zero" },
  { emoji: "⚡", title: "Energia no limite", desc: "Chegando em sala sem energia para engajar os alunos" },
];

export default function ProblemSection() {
  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold text-sm uppercase tracking-wide">A realidade de muitos professores</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-4">
            Você não ficou professor para<br />
            <span className="text-red-500">passar horas criando conteúdo…</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Sabemos que a vocação de ensinar é incrível. Mas a burocracia e o planejamento estão sugando sua energia e seu tempo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pains.map((pain) => (
            <div key={pain.title} className="bg-white rounded-2xl p-6 border border-red-100 card-hover">
              <div className="text-4xl mb-3">{pain.emoji}</div>
              <h3 className="font-bold text-slate-900 mb-2">{pain.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-red-50 border border-red-200 rounded-2xl px-8 py-5 max-w-xl">
            <p className="text-slate-700 text-base leading-relaxed">
              <strong className="text-red-600">E o pior:</strong> no final do dia você ainda se pergunta se fez o suficiente pelos seus alunos. Isso precisa mudar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
