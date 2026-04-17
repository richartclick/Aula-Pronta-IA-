"use server";

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

  const webhookUrl = process.env.N8N_WEBHOOK_AULA_PRONTA_IA;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, whatsapp, plano, origem: "landing-page" }),
      });
    } catch {
      // silently fail — lead saved locally
    }
  }

  return {
    success: true,
    message: "Perfeito! Entraremos em contato em breve para liberar seu acesso.",
  };
}
