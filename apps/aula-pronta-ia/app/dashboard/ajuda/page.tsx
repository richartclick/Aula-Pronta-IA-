import Link from "next/link";

const faqs = [
  {
    q: "Como gerar uma aula?",
    a: "Clique em 'Gerar Aula' no menu lateral, preencha o tema, série, disciplina, duração e estilo, e clique em 'Gerar aula agora'. A IA cria sua aula completa em segundos.",
  },
  {
    q: "Quantas aulas posso gerar no plano gratuito?",
    a: "No plano gratuito você tem 5 aulas por mês. As aulas renovam todo dia 1º. Para aulas ilimitadas, assine um dos planos pagos.",
  },
  {
    q: "Como baixar a aula em PDF?",
    a: "Após gerar a aula, clique no botão 'Baixar em PDF' na tela de resultado. O arquivo é gerado automaticamente.",
  },
  {
    q: "Como cancelar minha assinatura?",
    a: "Acesse 'Meu Plano' no menu e clique em 'Gerenciar assinatura'. Você será redirecionado ao portal do Stripe onde pode cancelar a qualquer momento.",
  },
  {
    q: "Esqueci minha senha. O que faço?",
    a: "Na tela de login, clique em 'Esqueceu a senha?' e informe seu email. Enviaremos um link para criar uma nova senha.",
  },
  {
    q: "As aulas geradas seguem a BNCC?",
    a: "Sim! A IA inclui automaticamente os códigos BNCC correspondentes à disciplina e série escolhidas.",
  },
];

export default function AjudaPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-3xl font-black text-slate-900">❓ Ajuda</h1>
        <p className="text-slate-500 text-sm mt-1">Perguntas frequentes sobre o Aula Pronta IA</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <p className="font-black text-slate-900 mb-2">💬 {faq.q}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
        <p className="font-black text-lg mb-1">Ainda com dúvidas?</p>
        <p className="text-blue-200 text-sm mb-4">Entre em contato pelo WhatsApp (plano Premium) ou por email.</p>
        <Link
          href="/dashboard/plano"
          className="inline-block bg-white text-blue-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
        >
          Ver planos com suporte VIP
        </Link>
      </div>
    </div>
  );
}
