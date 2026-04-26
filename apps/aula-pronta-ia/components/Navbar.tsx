export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-bold text-slate-900 text-lg">Aula Pronta IA</span>
        </div>
        <a
          href="/registro"
          className="hidden sm:inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
        >
          Criar conta grátis
        </a>
      </div>
    </nav>
  );
}
