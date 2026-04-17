export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">AI</span>
          </div>
          <span className="font-bold text-white text-base">Aula Pronta IA</span>
        </div>
        <p className="text-sm">
          Tecnologia a serviço da educação. Transformando o trabalho do professor com inteligência artificial.
        </p>
        <p className="text-xs mt-4 text-slate-600">
          © {new Date().getFullYear()} Aula Pronta IA. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
