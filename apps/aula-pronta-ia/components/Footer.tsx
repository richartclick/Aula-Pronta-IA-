const links = {
  produto: [
    { label: "Como funciona", href: "#demo" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Planos", href: "#planos" },
    { label: "Depoimentos", href: "#depoimentos" },
  ],
  conta: [
    { label: "Criar conta grátis", href: "/registro" },
    { label: "Entrar", href: "/login" },
    { label: "Esqueceu a senha?", href: "/esqueceu-senha" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-12 mb-12">

          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-sm">IA</span>
              </div>
              <span className="font-black text-white text-lg">Aula Pronta IA</span>
            </div>
            <p className="text-sm leading-relaxed">
              Tecnologia a serviço da educação. Transformando o planejamento do professor com inteligência artificial.
            </p>
          </div>

          {/* Links produto */}
          <div>
            <p className="text-white font-bold text-sm mb-4">Produto</p>
            <ul className="space-y-3">
              {links.produto.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links conta */}
          <div>
            <p className="text-white font-bold text-sm mb-4">Minha conta</p>
            <ul className="space-y-3">
              {links.conta.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Aula Pronta IA. Todos os direitos reservados.
          </p>
          <p className="text-xs text-slate-600">
            Feito com ❤️ para professores brasileiros
          </p>
        </div>

      </div>
    </footer>
  );
}
