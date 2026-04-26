"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/actions/auth";

export default function DashboardHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const [email, setEmail] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const inicial = email ? email[0].toUpperCase() : "P";

  return (
    <header className="bg-white border-b border-slate-100 shadow-sm px-8 py-5 flex items-center justify-between sticky top-0 z-40">
      <div>
        <p className="text-slate-900 font-bold text-lg">{greeting}! 👋</p>
        <p className="text-slate-400 text-sm mt-0.5">O que criamos hoje?</p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/gerar"
          className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-blue-200"
        >
          ⚡ Gerar aula
        </Link>

        {/* Avatar com menu */}
        <div className="relative">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
          >
            <span className="text-white font-bold text-sm">{inicial}</span>
          </button>

          {menuAberto && (
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-56 z-50">
              <div className="px-3 py-2 mb-1 border-b border-slate-100">
                <p className="text-xs text-slate-400">Conectado como</p>
                <p className="text-sm font-bold text-slate-700 truncate">{email}</p>
              </div>
              <Link
                href="/dashboard/plano"
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                💎 Meu plano
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  🚪 Sair
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Fechar menu ao clicar fora */}
      {menuAberto && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuAberto(false)} />
      )}
    </header>
  );
}
