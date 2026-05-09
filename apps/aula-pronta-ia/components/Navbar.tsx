"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { label: "Como funciona", href: "#demo" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Planos", href: "#planos" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200"
      style={scrolled
        ? { background: "#ffffff", borderColor: "rgba(15,23,42,0.12)" }
        : { backdropFilter: "saturate(160%) blur(14px)", background: "rgba(250,250,250,.82)", borderColor: "rgba(203,213,225,0.6)" }
      }
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-14 h-[80px] flex items-center justify-between gap-12">

        {/* Logo */}
        <a href="/" className="flex items-center shrink-0">
          <Image
            src="/logomarca.png"
            alt="Aula Pronta IA"
            width={134}
            height={52}
            className="object-contain"
            priority
          />
        </a>

        {/* Links — só desktop */}
        <div className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-500 hover:text-slate-900 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-5 shrink-0">
          <a
            href="/login"
            className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 text-[15px] font-semibold transition-colors duration-150"
          >
            Entrar
          </a>
          <a
            href="/registro"
            className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white px-7 py-3 rounded-full text-[15px] font-bold transition-colors duration-150 shadow-sm shadow-green-200"
          >
            Começar grátis
          </a>
        </div>

      </div>
    </nav>
  );
}
