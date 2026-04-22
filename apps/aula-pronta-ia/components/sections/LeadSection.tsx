"use client";

import { useActionState, useState } from "react";
import { submitLead, type LeadFormState } from "@/app/actions/lead";

const initialState: LeadFormState = { success: false, message: "" };

export default function LeadSection() {
  const [state, action, isPending] = useActionState(submitLead, initialState);
  const [plano, setPlano] = useState("gratuito");

  return (
    <section id="lead" className="py-24 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-4">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Vagas limitadas — Garanta a sua agora</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Comece hoje e transforme sua rotina como professor
          </h2>
          <p className="text-blue-100 text-lg">
            Preencha o formulário e entraremos em contato para liberar seu acesso gratuito.
          </p>
        </div>

        {state.success ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Cadastro realizado!</h3>
            <p className="text-slate-600 text-lg leading-relaxed">{state.message}</p>
            <div className="mt-6 bg-green-50 rounded-2xl px-6 py-4 inline-block">
              <p className="text-green-700 text-sm font-medium">
                ✅ Fique de olho no seu WhatsApp e email. Entraremos em contato em breve!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl">
            <form action={action} className="space-y-5">
              <input type="hidden" name="plano" value={plano} />

              {/* Plan selector */}
              <div>
                <label className="block text-slate-700 font-semibold text-sm mb-3">
                  Qual plano você quer testar?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "gratuito", label: "Grátis", sub: "5 aulas/mês" },
                    { value: "basico", label: "Básico", sub: "Ilimitado" },
                    { value: "premium", label: "Premium", sub: "Ilimitado + VIP" },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPlano(p.value)}
                      className={`rounded-xl border-2 py-2.5 px-3 text-center transition-all ${
                        plano === p.value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-bold text-sm">{p.label}</p>
                      <p className={`text-xs ${plano === p.value ? "text-blue-500" : "text-slate-400"}`}>{p.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="nome" className="block text-slate-700 font-semibold text-sm mb-1.5">
                  Seu nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  placeholder="Ex: Maria Silva"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-slate-700 font-semibold text-sm mb-1.5">
                  Seu melhor email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="maria@email.com"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-slate-700 font-semibold text-sm mb-1.5">
                  WhatsApp (com DDD)
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {state.message && !state.success && (
                <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{state.message}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-lg transition-all animate-pulse-glow"
              >
                {isPending ? "Enviando..." : "👉 Quero acessar agora"}
              </button>

              <p className="text-center text-slate-400 text-xs">
                🔒 Seus dados estão seguros. Sem spam, prometemos.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
