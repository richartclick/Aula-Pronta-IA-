"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null);
  const [verSenha, setVerSenha] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Aula Pronta IA</h1>
          <p className="text-slate-500 text-sm mt-1">Entre na sua conta</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Senha</label>
                <Link href="/esqueceu-senha" className="text-xs text-blue-600 hover:underline font-semibold">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="senha"
                  type={verSenha ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 pr-11 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setVerSenha(!verSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                  Entrando...
                </span>
              ) : "Entrar"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Não tem conta?{" "}
            <Link href="/registro" className="text-blue-600 font-bold hover:underline">
              Criar conta grátis
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          5 aulas gratuitas por mês para começar.
        </p>
      </div>
    </div>
  );
}
