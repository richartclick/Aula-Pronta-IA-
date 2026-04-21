"use client";

import Link from "next/link";
import { useActionState } from "react";
import { esqueceuSenha } from "@/app/actions/auth";

export default function EsqueceuSenhaPage() {
  const [state, action, isPending] = useActionState(esqueceuSenha, null);

  if (state?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Email enviado!</h2>
            <p className="text-slate-500 text-sm mb-6">
              Verifique sua caixa de entrada e clique no link para criar uma nova senha.
            </p>
            <Link
              href="/login"
              className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-center hover:opacity-90 transition-opacity"
            >
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Esqueceu a senha?</h1>
          <p className="text-slate-500 text-sm mt-1">Enviaremos um link para você redefinir</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8">
          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Seu email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
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
                  Enviando...
                </span>
              ) : "Enviar link de redefinição"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Lembrou a senha?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
