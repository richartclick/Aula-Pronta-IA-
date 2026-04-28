"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const planosConfig = [
  {
    nome: "Gratuito",
    preco: "R$ 0",
    periodo: "para sempre",
    destaque: false,
    cor: "border-slate-200",
    planoId: null,
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
    preco: "R$ 29,90",
    periodo: "por mês",
    destaque: true,
    cor: "border-blue-500 ring-2 ring-blue-500",
    planoId: "basico",
    botaoCor: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90",
    icon: "⚡",
    recursos: [
      "70 aulas por mês",
      "Todos os formatos",
      "Download PDF e Word",
      "Suporte prioritário",
      "Novidades em primeira mão",
    ],
    falta: ["Aulas ilimitadas"],
  },
  {
    nome: "Premium",
    preco: "R$ 39,90",
    periodo: "por mês",
    destaque: false,
    cor: "border-yellow-400",
    planoId: "premium",
    botaoCor: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90",
    icon: "💎",
    recursos: [
      "Aulas ilimitadas",
      "Tudo do plano Básico +",
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
    a: "Sim! Clique em 'Gerenciar assinatura' acima e cancele com um clique, sem multa ou burocracia.",
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

export default function PlanoClient({
  planoAtual,
  temAssinatura,
}: {
  planoAtual: string;
  temAssinatura: boolean;
}) {
  const params = useSearchParams();
  const sucesso = params.get("sucesso");
  const cancelado = params.get("cancelado");
  const planoSucesso = params.get("plano");
  const nomePlanoSucesso = planoSucesso === "premium" ? "Premium" : planoSucesso === "basico" ? "Básico" : "";
  const [loadingPlano, setLoadingPlano] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const planos = planosConfig.map((p) => ({
    ...p,
    atual: p.planoId === null ? planoAtual === "gratuito" : p.planoId === planoAtual,
    botao:
      p.planoId === null
        ? "Plano atual"
        : p.planoId === planoAtual
        ? "Plano atual"
        : planoAtual !== "gratuito"
        ? "Fazer upgrade"
        : "Assinar agora",
  }));

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

  async function handlePortal() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe-portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch {
      alert("Erro ao acessar portal. Tente novamente.");
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 lg:pb-0">

      {sucesso && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-black text-emerald-800">Assinatura ativada com sucesso!</p>
            <p className="text-emerald-700 text-sm">Bem-vinda ao plano {nomePlanoSucesso}. Aproveite todas as funcionalidades!</p>
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

      {/* Gerenciar assinatura — visível apenas para assinantes */}
      {temAssinatura && (
        <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <p className="font-black text-slate-900">Gerenciar sua assinatura</p>
              <p className="text-slate-500 text-sm mt-0.5">
                Cancele, troque de plano ou atualize o método de pagamento — tudo com segurança pelo Stripe.
              </p>
            </div>
          </div>
          <button
            onClick={handlePortal}
            disabled={loadingPortal}
            className="flex-shrink-0 bg-white border-2 border-blue-200 text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-60 text-sm flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            {loadingPortal ? (
              <>
                <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                Abrindo...
              </>
            ) : (
              "Gerenciar assinatura →"
            )}
          </button>
        </div>
      )}

      <div className="text-center pb-2">
        <h1 className="text-3xl font-black text-slate-900 mb-2">💎 Escolha seu plano</h1>
        <p className="text-slate-500">Comece grátis. Faça upgrade quando quiser. Cancele quando precisar.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {planos.map((plano) => (
          <div key={plano.nome} className="flex flex-col">

            {/* Área reservada para badge — garante alinhamento mesmo sem badge */}
            <div className="h-7 flex items-center justify-center mb-1">
              {plano.destaque && !plano.atual && (
                <div className="bg-blue-600 text-white text-xs font-black px-4 py-1 rounded-full shadow">
                  Mais popular ⭐
                </div>
              )}
              {plano.atual && (
                <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                  ✓ Plano atual
                </div>
              )}
            </div>

            <div
              className={`bg-white rounded-2xl border-2 ${plano.cor} p-6 flex flex-col flex-1 shadow-sm hover:shadow-md transition-shadow`}
            >

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
              onClick={() => plano.planoId && !plano.atual ? handleAssinar(plano.planoId) : undefined}
              className={`w-full font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
                plano.atual
                  ? "bg-emerald-50 text-emerald-600 cursor-default border-2 border-emerald-200"
                  : plano.botaoCor
              }`}
            >
              {loadingPlano === plano.planoId ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecionando...
                </>
              ) : plano.atual ? (
                "✓ Plano atual"
              ) : (
                plano.botao
              )}
            </button>
            </div>
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
