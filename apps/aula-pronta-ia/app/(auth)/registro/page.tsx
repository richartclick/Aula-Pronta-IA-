"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registro } from "@/app/actions/auth";

export default function RegistroPage() {
  const [state, action, isPending] = useActionState(registro, null);

  if (state?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Confirme seu email</h2>
          <p className="text-slate-500 text-sm mb-2">
            Enviamos um link de confirmação para:
          </p>
          <p className="font-bold text-blue-700 text-sm mb-4">{state.email}</p>
          <p className="text-slate-400 text-xs">Clique no link do email para ativar sua conta e acessar o dashboard.</p>
          <Link href="/login" className="inline-block mt-6 text-blue-600 font-bold text-sm hover:underline">
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Aula Pronta IA</h1>
          <p className="text-slate-500 text-sm mt-1">Crie sua conta grátis</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8">
          {/* Benefícios */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <p className="text-xs font-bold text-blue-700 mb-2">✨ O que você ganha de graça:</p>
            <ul className="space-y-1">
              {["5 aulas completas por mês", "Download em PDF", "Todos os formatos de aula"].map(b => (
                <li key={b} className="flex items-center gap-2 text-xs text-blue-700">
                  <span className="text-blue-500">✓</span> {b}
                </li>
              ))}
            </ul>
          </div>

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
              <input
                name="senha"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirmar senha</label>
              <input
                name="confirmar"
                type="password"
                required
                placeholder="Repita a senha"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            {state?.error && (
              <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 mt-2"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </span>
              ) : "Criar conta grátis ✨"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
