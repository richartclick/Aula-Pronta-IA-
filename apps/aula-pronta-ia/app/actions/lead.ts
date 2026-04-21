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
  const email = formData.get("email")?.toString().trim();
  const whatsapp = formData.get("whatsapp")?.toString().trim();
  const plano = formData.get("plano")?.toString() || "gratuito";

  if (!nome || !email || !whatsapp) {
    return { success: false, message: "Por favor, preencha todos os campos." };
  }

  // Salva no Supabase (upsert por email — evita duplicatas)
  try {
    const supabase = await createClient();
    await supabase.from("leads").upsert(
      { nome, email, whatsapp, plano_interesse: plano, origem: "landing-page", status: "novo" },
      { onConflict: "email" }
    );
  } catch (err) {
    console.error("Erro ao salvar lead:", err);
  }

  // Dispara n8n para automações (boas-vindas + sequência de follow-up)
  const webhookUrl = process.env.N8N_WEBHOOK_AULA_PRONTA_IA;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, whatsapp, plano, origem: "landing-page" }),
    }).catch(() => {});
  }

  const mensagem =
    plano === "gratuito"
      ? `Perfeito, ${nome}! Você ganhou 5 aulas grátis. Crie sua conta agora e comece a usar em segundos. 🚀`
      : `Ótima escolha, ${nome}! Você escolheu o plano ${plano === "premium" ? "Premium 💎" : "Básico ⚡"}. Crie sua conta e assine para ter acesso ilimitado. 🎉`;

  return { success: true, message: mensagem };
}
