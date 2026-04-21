"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nome = formData.get("nome") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  });

  if (error) return { error: error.message };

  if (data.user) {
    // Cria perfil com plano gratuito
    await supabase.from("profiles").insert({
      id: data.user.id,
      nome,
      email,
      plano: "gratuito",
      aulas_usadas: 0,
      aulas_limite: 5,
    });

    // Notifica via n8n (WhatsApp)
    const webhook = process.env.N8N_WEBHOOK_CADASTRO;
    if (webhook) {
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, plano: "gratuito" }),
      }).catch(() => {});
    }
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
