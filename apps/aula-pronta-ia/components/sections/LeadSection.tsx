"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitLead, type LeadFormState } from "@/app/actions/lead";

const initialState: LeadFormState = { success: false, message: "" };

export default function LeadSection() {
  const [state, action, isPending] = useActionState(submitLead, initialState);

  return (
    <section id="lead" className="py-32 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Pronta para transformar sua rotina?
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Deixe seu contato e te avisamos com novidades, dicas e acesso antecipado a novos recursos.
          </p>
        </div>

        {state.success ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
            <div className="text-6xl mb-5">🎉</div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Recebemos seu contato!</h3>
            <p className="text-slate-600 text-lg leading-relaxed">{state.message}</p>
            <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
              <p className="text-green-700 text-sm font-medium">
                ✅ Fique de olho no seu WhatsApp e email!
              </p>
            </div>
            <Link
              href="/registro"
              className="mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black py-4 px-8 rounded-2xl text-base transition-all shadow-lg shadow-green-200"
            >
              Criar minha conta agora →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl">
            <form action={action} className="space-y-5">
              <input type="hidden" name="plano" value="gratuito" />

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
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
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
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
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
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                />
              </div>

              {state.message && !state.success && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 text-sm">{state.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-lg transition-all shadow-lg shadow-green-200"
              >
                {isPending ? "Enviando..." : "Quero receber novidades →"}
              </button>

              <div className="border-t border-slate-100 pt-5 text-center space-y-2">
                <p className="text-slate-500 text-sm">Prefere começar agora mesmo?</p>
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
                >
                  Criar conta grátis →
                </Link>
              </div>

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
