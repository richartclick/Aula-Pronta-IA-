const links = [
  { label: "Como funciona", href: "#demo" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Planos", href: "#planos" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">IA</span>
          </div>
          <span className="font-black text-slate-900 text-lg">Aula Pronta IA</span>
        </a>

        {/* Links — só desktop */}
        <div className="hidden lg:flex items-center gap-7">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/login"
            className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
          >
            Entrar
          </a>
          <a
            href="/registro"
            className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm shadow-green-200"
          >
            Começar grátis
          </a>
        </div>

      </div>
    </nav>
  );
}
