"use server";

import { createClient } from "@/lib/supabase/server";

export type AulaFormState = {
  success: boolean;
  aula?: string;
  error?: string;
};

export async function gerarAula(
  _prev: AulaFormState,
  formData: FormData
): Promise<AulaFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  // Verifica limite
  const { data: profile } = await supabase
    .from("profiles")
    .select("aulas_usadas, aulas_limite, plano")
    .eq("id", user.id)
    .single();

  if (!profile) return { success: false, error: "Perfil não encontrado." };

  if (profile.aulas_usadas >= profile.aulas_limite) {
    return { success: false, error: "LIMITE_ATINGIDO" };
  }

  const tema = formData.get("tema") as string;
  const serie = formData.get("serie") as string;
  const duracao = formData.get("duracao") as string;
  const estilo = formData.get("estilo") as string;

  // Chama n8n → GPT
  const webhook = process.env.N8N_WEBHOOK_GERAR_AULA;
  if (!webhook) return { success: false, error: "Serviço indisponível." };

  let conteudo = "";
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema, serie, duracao, estilo, userId: user.id }),
    });
    const json = await res.json();
    conteudo = json.aula || json.content || JSON.stringify(json);
  } catch {
    return { success: false, error: "Erro ao gerar aula. Tente novamente." };
  }

  // Salva no banco e incrementa uso
  await supabase.from("aulas").insert({
    user_id: user.id,
    tema,
    serie,
    duracao,
    estilo,
    conteudo,
  });

  await supabase
    .from("profiles")
    .update({ aulas_usadas: profile.aulas_usadas + 1 })
    .eq("id", user.id);

  return { success: true, aula: conteudo };
}
