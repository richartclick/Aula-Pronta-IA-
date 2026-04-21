"use client";

import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
import Link from "next/link";

export default function CadastroPage() {
  const [state, action, isPending] = useActionState(signUp, undefined);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">AI</span>
            </div>
            <span className="font-black text-slate-900 text-xl">Aula Pronta IA</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Comece agora — é grátis</h1>
          <p className="text-slate-500 mt-1">5 aulas gratuitas para começar hoje</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex gap-3 bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
            <span className="text-green-600">✓</span>
            <p className="text-green-700 text-sm font-medium">Acesso liberado automaticamente após o cadastro</p>
          </div>

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Seu nome</label>
              <input
                name="nome"
                type="text"
                required
                placeholder="Maria Silva"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha</label>
              <input
                name="password"
                type="password"
                required
                placeholder="mínimo 6 caracteres"
                minLength={6}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {state?.error && (
              <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              {isPending ? "Criando conta..." : "Criar conta grátis →"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
