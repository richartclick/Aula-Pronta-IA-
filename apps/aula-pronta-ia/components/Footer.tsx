import Image from "next/image";

const cols = [
  {
    title: "Produto",
    links: [
      { label: "Benefícios", href: "#beneficios" },
      { label: "Como funciona", href: "#como" },
      { label: "Demonstração", href: "#demo" },
      { label: "Planos", href: "#planos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contato", href: "#" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Criar conta grátis", href: "/registro" },
      { label: "Entrar", href: "/login" },
      { label: "Esqueceu a senha?", href: "/esqueceu-senha" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#fafafa] py-14">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">

        <div className="grid sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 mb-12">

          {/* Logo + tagline */}
          <div>
            <a href="/" className="inline-flex items-center mb-4">
              <Image src="/logomarca.png" alt="Aula Pronta IA" width={100} height={40} className="object-contain" />
            </a>
            <p className="text-[13.5px] text-slate-500 max-w-[300px] leading-[1.65]">
              A IA brasileira que devolve horas para o professor. Planejamento alinhado à BNCC, em segundos.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h5 className="text-[11.5px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-3">{col.title}</h5>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-slate-600 hover:text-blue-700 transition-colors block py-0.5">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="border-t border-slate-200 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-slate-400">
          <span>© {new Date().getFullYear()} Aula Pronta IA · Todos os direitos reservados</span>
          <span>Feito no Brasil com café e IA</span>
        </div>

      </div>
    </footer>
  );
}
