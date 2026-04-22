"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const planos = [
  {
    nome: "Gratuito",
    preco: "R$ 0",
    periodo: "para sempre",
    atual: true,
    destaque: false,
    cor: "border-slate-200",
    planoId: null,
    botao: "Plano atual",
    botaoCor: "bg-slate-100 text-slate-500 cursor-default",
    icon: "🎁",
    recursos: [
      "5 aulas por mês",
      "Todos os formatos",
      "Download em PDF",
      "Suporte por email",
    ],
    falta: ["Aulas ilimitadas", "Download Word", "Suporte prioritário"],
  },
  {
    nome: "Básico",
    preco: "R$ 19,90",
    periodo: "por mês",
    atual: false,
    destaque: true,
    cor: "border-blue-500 ring-2 ring-blue-500",
    planoId: "basico",
    botao: "Assinar agora",
    botaoCor: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90",
    icon: "⚡",
    recursos: [
      "Aulas ilimitadas",
      "Todos os formatos",
      "Download PDF e Word",
      "Suporte prioritário",
      "Novidades em primeira mão",
    ],
    falta: ["Recursos premium"],
  },
  {
    nome: "Premium",
    preco: "R$ 29,90",
    periodo: "por mês",
    atual: false,
    destaque: false,
    cor: "border-yellow-400",
    planoId: "premium",
    botao: "Assinar Premium",
    botaoCor: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90",
    icon: "💎",
    recursos: [
      "Tudo do Básico",
      "Banco de atividades extras",
      "Suporte VIP via WhatsApp",
      "Personalização por turma",
      "Acesso antecipado a novidades",
    ],
    falta: [],
  },
];

const faq = [
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim! Você pode cancelar sua assinatura a qualquer momento, sem multa ou burocracia.",
  },
  {
    q: "O pagamento é seguro?",
    a: "Sim. Utilizamos o Stripe, a plataforma de pagamento mais confiável do mundo, com criptografia total.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Cartão de crédito, débito e PIX. Tudo processado com segurança pelo Stripe.",
  },
  {
    q: "O que acontece quando minhas aulas gratuitas acabam?",
    a: "Você pode assinar qualquer plano pago para continuar gerando aulas sem limite.",
  },
];

function PlanoConteudo() {
  const params = useSearchParams();
  const sucesso = params.get("sucesso");
  const cancelado = params.get("cancelado");
  const [loadingPlano, setLoadingPlano] = useState<string | null>(null);

  async function handleAssinar(planoId: string) {
    setLoadingPlano(planoId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano: planoId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert("Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoadingPlano(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 lg:pb-0">
      {sucesso && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-black text-emerald-800">Assinatura ativada com sucesso!</p>
            <p className="text-emerald-700 text-sm">Bem-vinda ao plano premium. Aproveite todas as funcionalidades!</p>
          </div>
        </div>
      )}
      {cancelado && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-center gap-3">
          <span className="text-2xl">😕</span>
          <div>
            <p className="font-black text-amber-800">Pagamento cancelado</p>
            <p className="text-amber-700 text-sm">Nenhuma cobrança foi feita. Você pode tentar novamente quando quiser.</p>
          </div>
        </div>
      )}
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">💎 Escolha seu plano</h1>
        <p className="text-slate-500">Comece grátis. Faça upgrade quando quiser. Cancele quando precisar.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {planos.map((plano) => (
          <div
            key={plano.nome}
            className={`relative bg-white rounded-2xl border-2 ${plano.cor} p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow`}
          >
            {plano.destaque && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1 rounded-full shadow">
                Mais popular ⭐
              </div>
            )}
            {plano.atual && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                Plano atual
              </div>
            )}

            <div className="mb-5">
              <span className="text-3xl">{plano.icon}</span>
              <h3 className="font-black text-slate-900 text-xl mt-2">{plano.nome}</h3>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">{plano.preco}</span>
                <span className="text-slate-400 text-sm mb-1">/{plano.periodo}</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plano.recursos.map((r) => (
                <li key={r} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="text-green-500 font-bold">✓</span> {r}
                </li>
              ))}
              {plano.falta.map((r) => (
                <li key={r} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-300">✗</span> {r}
                </li>
              ))}
            </ul>

            <button
              disabled={plano.atual || loadingPlano === plano.planoId}
              onClick={() => plano.planoId ? handleAssinar(plano.planoId) : undefined}
              className={`w-full font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${plano.botaoCor}`}
            >
              {loadingPlano === plano.planoId ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecionando...
                </>
              ) : plano.botao}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">🛡️</p>
        <h3 className="font-black text-emerald-800 text-lg mb-1">Garantia de 7 dias</h3>
        <p className="text-emerald-700 text-sm max-w-xl mx-auto">
          Se nos primeiros 7 dias você não ficar satisfeita, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl">🔒</div>
        <div>
          <h3 className="font-black text-slate-900 mb-1">Pagamento 100% seguro via Stripe</h3>
          <p className="text-slate-500 text-sm">
            Sua assinatura é processada pelo Stripe, plataforma usada por milhões de empresas no mundo. Aceitamos cartão de crédito, débito e PIX.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900 mb-4">Dúvidas frequentes</h2>
        <div className="space-y-3">
          {faq.map((item) => (
            <div key={item.q} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h4 className="font-bold text-slate-900 text-sm mb-1">{item.q}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PlanoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <PlanoConteudo />
    </Suspense>
  );
}
