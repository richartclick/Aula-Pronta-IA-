"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "Início" },
  { href: "/dashboard/gerar", icon: "⚡", label: "Gerar Aula", highlight: true },
  { href: "/dashboard/minhas-aulas", icon: "📚", label: "Minhas Aulas" },
  { href: "/dashboard/favoritos", icon: "⭐", label: "Favoritos" },
  { href: "/dashboard/historico", icon: "🕐", label: "Histórico" },
];

const bottomItems = [
  { href: "/dashboard/plano", icon: "💎", label: "Meu Plano" },
  { href: "/dashboard/ajuda", icon: "❓", label: "Ajuda" },
  { href: "/dashboard/perfil", icon: "👤", label: "Perfil" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm min-h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">AI</span>
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm leading-tight">Aula Pronta</p>
              <p className="text-blue-600 font-bold text-xs">IA</p>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Menu</p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                  item.highlight
                    ? active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    : active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
                {item.highlight && !active && (
                  <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Novo</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          {bottomItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Plan badge */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 text-white">
            <p className="font-bold text-sm mb-1">Plano Gratuito</p>
            <p className="text-blue-200 text-xs mb-3">3 de 5 aulas usadas</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mb-3">
              <div className="bg-white rounded-full h-1.5 w-3/5" />
            </div>
            <Link
              href="/dashboard/plano"
              className="block text-center bg-white text-blue-700 font-bold text-xs py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Fazer upgrade ✨
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex justify-around py-2 px-4">
        {navItems.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
