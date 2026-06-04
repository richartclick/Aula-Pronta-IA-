export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Termos de Uso</h1>
        <p className="text-slate-500 text-sm mb-10">Última atualização: junho de 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Aceitação dos termos</h2>
            <p>Ao usar o <strong>Aula Pronta IA</strong>, você concorda com estes Termos de Uso. Se não concordar, não utilize a plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. O serviço</h2>
            <p>O Aula Pronta IA é uma plataforma que utiliza inteligência artificial para auxiliar professores na criação de planos de aula alinhados à BNCC. O conteúdo gerado é uma sugestão e deve ser revisado pelo professor antes do uso.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Uso permitido</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Usar a plataforma para fins pedagógicos pessoais e profissionais.</li>
              <li>Adaptar o conteúdo gerado para suas aulas.</li>
              <li>Compartilhar planos de aula com seus alunos e colegas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Uso proibido</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Revender ou redistribuir o conteúdo gerado como produto próprio.</li>
              <li>Usar a plataforma para fins ilegais ou prejudiciais.</li>
              <li>Tentar acessar contas de outros usuários.</li>
              <li>Fazer engenharia reversa ou copiar o sistema.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Planos e pagamentos</h2>
            <p>Os planos pagos são cobrados mensalmente via Stripe. Você pode cancelar a qualquer momento pelo painel da plataforma. O cancelamento é efetivo ao fim do período já pago.</p>
            <p className="mt-2">Oferecemos <strong>garantia de 7 dias</strong>: se não ficar satisfeito, devolvemos 100% do valor.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Responsabilidade pelo conteúdo</h2>
            <p>O conteúdo gerado pela IA é uma sugestão pedagógica. O Aula Pronta IA não se responsabiliza pelo uso inadequado dos planos de aula gerados. O professor é responsável por avaliar e adaptar o conteúdo antes de aplicá-lo.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Disponibilidade</h2>
            <p>Nos esforçamos para manter a plataforma disponível 24/7, mas não garantimos disponibilidade ininterrupta. Manutenções e atualizações podem causar breves interrupções.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Alterações nos termos</h2>
            <p>Podemos atualizar estes termos a qualquer momento. Notificaremos usuários sobre mudanças relevantes por e-mail. O uso continuado após a notificação implica aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Contato</h2>
            <p>Dúvidas? Entre em contato: <strong>contato@aulapronta.ai</strong></p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <a href="/" className="text-blue-600 hover:underline text-sm">← Voltar para o início</a>
        </div>
      </div>
    </div>
  );
}
