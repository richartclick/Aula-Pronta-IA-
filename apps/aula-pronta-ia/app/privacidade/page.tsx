export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Política de Privacidade</h1>
        <p className="text-slate-500 text-sm mb-10">Última atualização: junho de 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Quem somos</h2>
            <p>O <strong>Aula Pronta IA</strong> é uma plataforma de inteligência artificial para geração de planos de aula, desenvolvida para professores brasileiros. Nosso site é <strong>aulapronta.ai</strong>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Dados que coletamos</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Nome e e-mail</strong> — para criação de conta e comunicação.</li>
              <li><strong>WhatsApp</strong> — para envio de novidades e suporte (somente se fornecido voluntariamente).</li>
              <li><strong>Dados de uso</strong> — aulas geradas, planos escolhidos, interações com a plataforma.</li>
              <li><strong>Dados de pagamento</strong> — processados pelo Stripe. Não armazenamos dados de cartão.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Como usamos seus dados</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fornecer e melhorar os serviços da plataforma.</li>
              <li>Enviar comunicações relevantes sobre o produto (novidades, dicas, atualizações).</li>
              <li>Processar pagamentos e gerenciar assinaturas.</li>
              <li>Cumprir obrigações legais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Compartilhamento de dados</h2>
            <p>Seus dados <strong>não são vendidos</strong> a terceiros. Compartilhamos apenas com:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Supabase</strong> — armazenamento seguro de dados.</li>
              <li><strong>Stripe</strong> — processamento de pagamentos.</li>
              <li><strong>Anthropic</strong> — processamento de IA para gerar as aulas (sem dados pessoais).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Seus direitos (LGPD)</h2>
            <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos ou incorretos.</li>
              <li>Solicitar a exclusão dos seus dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
            <p className="mt-3">Para exercer seus direitos, entre em contato: <strong>contato@aulapronta.ai</strong></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Segurança</h2>
            <p>Utilizamos criptografia, autenticação segura e boas práticas de segurança para proteger seus dados. As senhas são armazenadas com hash seguro (bcrypt) e nunca em texto simples.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Cookies</h2>
            <p>Usamos cookies estritamente necessários para autenticação e funcionamento da plataforma. Não usamos cookies de rastreamento de terceiros para fins publicitários.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Contato</h2>
            <p>Dúvidas sobre esta política? Fale conosco: <strong>contato@aulapronta.ai</strong></p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <a href="/" className="text-blue-600 hover:underline text-sm">← Voltar para o início</a>
        </div>
      </div>
    </div>
  );
}
