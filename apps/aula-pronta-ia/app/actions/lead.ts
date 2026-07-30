"use server";

import { createClient } from "@/lib/supabase/server";

export type LeadFormState = {
  success: boolean;
  message: string;
};

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const nome = formData.get("nome")?.toString().trim();
  const whatsapp = formData.get("whatsapp")?.toString().trim();
  const plano = formData.get("plano")?.toString() || "gratuito";

  if (!nome || !whatsapp) {
    return { success: false, message: "Por favor, preencha nome e WhatsApp." };
  }

  // Salva no Supabase (upsert por whatsapp — evita duplicatas)
  try {
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("leads").upsert(
      { nome, whatsapp, plano_interesse: plano, origem: "landing-page", status: "novo" },
      { onConflict: "whatsapp" }
    );
    if (dbError) console.error("[LEAD] Erro Supabase:", dbError.message);
    else console.log("[LEAD] Salvo no Supabase:", whatsapp);
  } catch (err) {
    console.error("[LEAD] Erro ao salvar lead:", err);
  }

  // Mensagem imediata de boas-vindas via WhatsApp (Zapi)
  const zapiInstance = process.env.ZAPI_INSTANCE_ID;
  const zapiToken = process.env.ZAPI_TOKEN;
  const zapiClientToken = process.env.ZAPI_CLIENT_TOKEN;

  console.log("[LEAD] Zapi vars:", {
    instance: zapiInstance ? zapiInstance.slice(0, 6) + "..." : "AUSENTE",
    token: zapiToken ? zapiToken.slice(0, 4) + "..." : "AUSENTE",
    clientToken: zapiClientToken ? zapiClientToken.slice(0, 4) + "..." : "AUSENTE",
    whatsapp,
  });

  if (zapiInstance && zapiToken && zapiClientToken && whatsapp) {
    const telefone = "55" + whatsapp.replace(/\D/g, "");
    const mensagemZapi = `Oi ${nome}! Aqui é a Ana da Aula Pronta IA 👋\nVi que você deixou seu contato e queria dar as boas-vindas!\nCrie sua conta grátis e gere sua primeira aula em segundos — tudo alinhado à BNCC.\n👉 aulapronta.ai`;
    try {
      const zapiRes = await fetch(`https://api.z-api.io/instances/${zapiInstance}/token/${zapiToken}/send-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Client-Token": zapiClientToken },
        body: JSON.stringify({ phone: telefone, message: mensagemZapi }),
      });
      const zapiData = await zapiRes.json();
      console.log("[LEAD] Zapi response:", zapiRes.status, JSON.stringify(zapiData));

      // Notificação interna para o número do negócio
      const numeroNegocio = "5544997519693";
      const notificacao = `🔔 Novo lead cadastrado!\n\nNome: ${nome}\nWhatsApp: ${whatsapp}\nPlano: ${plano}`;
      await fetch(`https://api.z-api.io/instances/${zapiInstance}/token/${zapiToken}/send-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Client-Token": zapiClientToken },
        body: JSON.stringify({ phone: numeroNegocio, message: notificacao }),
      }).catch((err) => console.error("[LEAD] Erro notificação interna:", err));

    } catch (err) {
      console.error("[LEAD] Erro Zapi:", err instanceof Error ? err.message : err);
    }
  } else {
    console.warn("[LEAD] WhatsApp NÃO enviado — variáveis Zapi ausentes ou whatsapp vazio");
  }

  const mensagem =
    plano === "gratuito"
      ? `Perfeito, ${nome}! Você ganhou 5 aulas grátis. Crie sua conta agora e comece a usar em segundos. 🚀`
      : `Ótima escolha, ${nome}! Você escolheu o plano ${plano === "premium" ? "Premium 💎" : "Básico ⚡"}. Crie sua conta e assine para ter acesso ilimitado. 🎉`;

  return { success: true, message: mensagem };
}
