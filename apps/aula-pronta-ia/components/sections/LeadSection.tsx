"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitLead, type LeadFormState } from "@/app/actions/lead";

const initialState: LeadFormState = { success: false, message: "" };

export default function LeadSection() {
  const [state, action, isPending] = useActionState(submitLead, initialState);

  return (
    <section id="lead" className="py-24" style={{ background: 'linear-gradient(135deg, #F97316 0%, #EC4899 50%, #7C3AED 100%)' }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8 lg:px-14">
        <div className="text-center mb-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Comece hoje mesmo</span>
          <h2
            className="font-fraunces text-white leading-[.96] tracking-[-0.032em] mt-4 mb-6 mx-auto max-w-3xl"
            style={{ fontSize: 'clamp(36px, 6.4vw, 72px)', fontWeight: 380, fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
          >
            Sua próxima atividade{" "}
            <span style={{ fontStyle: 'italic', color: '#FDE68A', fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
              já pode estar pronta.
            </span>
          </h2>
          <p className="text-white/80 text-[17px] leading-[1.7] max-w-md mx-auto font-normal">
            Deixe seu contato para receber novidades, dicas exclusivas e acesso antecipado a novos recursos.
          </p>
        </div>

        {state.success ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
            <div className="text-6xl mb-5">🎉</div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Recebemos seu contato!</h3>
            <p className="text-slate-600 text-lg leading-relaxed">{state.message}</p>
            <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
              <p className="text-green-700 text-sm font-medium">✅ Fique de olho no seu WhatsApp e email!</p>
            </div>
            <Link
              href="/registro"
              className="mt-6 inline-flex items-center gap-2 text-white font-black py-4 px-8 rounded-2xl text-base transition-all shadow-lg"
              style={{ background: 'linear-gradient(135deg,#F97316,#EC4899)' }}
            >
              Criar minha conta agora →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl">
            <form action={action} className="space-y-5">
              <input type="hidden" name="plano" value="gratuito" />

              <div>
                <label htmlFor="nome" className="block text-slate-700 font-semibold text-sm mb-1.5">Seu nome</label>
                <input
                  id="nome" name="nome" type="text" required placeholder="Ex: Maria Silva"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-400 transition-colors bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-slate-700 font-semibold text-sm mb-1.5">WhatsApp (com DDD)</label>
                <input
                  id="whatsapp" name="whatsapp" type="tel" required placeholder="(11) 99999-9999"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-400 transition-colors bg-slate-50 focus:bg-white"
                />
              </div>

              {state.message && !state.success && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 text-sm">{state.message}</p>
                </div>
              )}

              <button
                type="submit" disabled={isPending}
                className="w-full text-white font-black py-4 rounded-2xl text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                style={{ background: 'linear-gradient(135deg,#F97316,#EC4899)', boxShadow: '0 14px 30px -8px rgba(236,72,153,.4)' }}
              >
                {isPending ? "Enviando..." : "Quero receber novidades →"}
              </button>

              <div className="border-t border-slate-100 pt-5 text-center space-y-2">
                <p className="text-slate-500 text-sm">Prefere começar agora mesmo?</p>
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}
                >
                  Criar conta grátis →
                </Link>
              </div>

              <p className="text-center text-slate-400 text-xs">🔒 Seus dados estão seguros. Sem spam, prometemos.</p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
