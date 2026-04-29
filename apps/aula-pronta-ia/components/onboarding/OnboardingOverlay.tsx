"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { concluirOnboarding } from "@/app/actions/onboarding";

const features = [
  {
    icon: "⚡",
    title: "Gerar Aula Completa",
    desc: "Informe o tema, série e duração — a IA entrega tudo pronto em segundos",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: "📥",
    title: "Baixar em PDF",
    desc: "Exporte qualquer aula para imprimir e levar direto para a sala de aula",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "📚",
    title: "Histórico Organizado",
    desc: "Todas as suas aulas ficam salvas para reaproveitar e favoritar quando quiser",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
];

export default function OnboardingOverlay() {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function concluir() {
    startTransition(async () => {
      await concluirOnboarding();
      router.refresh();
      router.push("/dashboard/gerar");
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 pt-8 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/robo.png"
              alt="Assistente IA"
              width={130}
              height={130}
              className="object-contain drop-shadow-lg animate-float"
            />
          </div>

          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-black text-white">Bem-vinda ao Aula Pronta IA! 👋</h2>
              <p className="text-blue-200 text-sm mt-1">Sou seu assistente — vou te ajudar a criar aulas incríveis</p>
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-black text-white">O que você pode fazer 🎯</h2>
              <p className="text-blue-200 text-sm mt-1">Tudo que você precisa para suas aulas</p>
            </div>
          )}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-black text-white">
                Tudo pronto{nome ? `, ${nome}` : ""}! 🎉
              </h2>
              <p className="text-blue-200 text-sm mt-1">Você tem 5 aulas gratuitas para começar este mês</p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-6">

          {/* Passo 1 — nome */}
          {step === 1 && (
            <div className="animate-fade-in-up space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Como posso te chamar?{" "}
                  <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Professora Ana"
                  className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm outline-none transition-colors"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && setStep(2)}
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-200"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Passo 2 — funcionalidades */}
          {step === 2 && (
            <div className="animate-fade-in-up space-y-3">
              {features.map((f) => (
                <div key={f.title} className={`${f.bg} rounded-2xl p-4 flex items-start gap-3`}>
                  <div className={`${f.iconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl`}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{f.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  ← Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-200 text-sm"
                >
                  Entendi! →
                </button>
              </div>
            </div>
          )}

          {/* Passo 3 — conclusão */}
          {step === 3 && (
            <div className="animate-fade-in-up space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-4xl mb-2">🎓</p>
                <p className="font-black text-slate-900">Você está pronta para começar!</p>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                  Crie sua primeira aula agora — leva menos de 30 segundos.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border-2 border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  ← Voltar
                </button>
                <button
                  onClick={concluir}
                  disabled={isPending}
                  className="flex-[2] bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-green-200 text-sm disabled:opacity-60"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Carregando...
                    </span>
                  ) : "⚡ Criar minha primeira aula"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Indicador de passos */}
        <div className="flex justify-center gap-2 pb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`rounded-full transition-all duration-300 ${
                s === step ? "w-6 h-2 bg-blue-600" : "w-2 h-2 bg-slate-200"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
