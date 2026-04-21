"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Profile = {
  nome: string;
  plano: string;
  aulas_usadas: number;
  aulas_limite: number;
} | null;

const navItems = [
  { href: "/dashboard", label: "Início", icon: "🏠" },
  { href: "/dashboard/gerar-aula", label: "Gerar aula", icon: "⚡" },
  { href: "/dashboard/minhas-aulas", label: "Minhas aulas", icon: "📚" },
  { href: "/dashboard/conta", label: "Minha conta", icon: "👤" },
];

export default function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const progresso = profile ? Math.round((profile.aulas_usadas / profile.aulas_limite) * 100) : 0;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r border-slate-100 flex-col p-5">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">AI</span>
          </div>
          <span className="font-black text-slate-900">Aula Pronta IA</span>
        </div>

        {/* Nav */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Uso do plano */}
        <div className="bg-slate-50 rounded-2xl p-4 mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Plano {profile?.plano}</span>
            <span className="text-xs text-slate-400">{profile?.aulas_usadas}/{profile?.aulas_limite}</span>
          </div>
          <div className="bg-slate-200 rounded-full h-1.5 mb-2">
            <div
              className={`h-1.5 rounded-full ${progresso >= 80 ? "bg-red-500" : "bg-blue-600"}`}
              style={{ width: `${progresso}%` }}
            />
          </div>
          {profile?.plano === "gratuito" && (
            <Link href="/dashboard/conta" className="text-xs text-blue-600 font-semibold hover:underline">
              Fazer upgrade →
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex z-50">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
                active ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
