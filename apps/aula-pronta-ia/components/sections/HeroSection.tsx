import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="gradient-hero min-h-screen flex items-center pt-16 px-4">
      <div className="max-w-6xl mx-auto w-full py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-blue-100 text-sm font-medium">+5.000 professores já usam a plataforma</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Aulas completas em{" "}
              <span className="gradient-text">segundos</span>{" "}
              com IA
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-lg">
              Pare de gastar horas planejando. Descreva sua aula e a IA entrega tudo pronto — objetivos, atividades, avaliação e PDF para imprimir.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="/registro"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black py-4 px-8 rounded-2xl text-lg transition-all shadow-xl shadow-green-500/30"
              >
                Criar minha conta grátis →
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white/10 transition-all"
              >
                Ver como funciona
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> 5 aulas grátis por mês
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Cancele quando quiser
              </div>
            </div>
          </div>

          {/* Right: Robot */}
          <div className="flex justify-center items-center animate-float">
            <Image
              src="/robo.png"
              alt="Assistente Aula Pronta IA"
              width={520}
              height={520}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}
