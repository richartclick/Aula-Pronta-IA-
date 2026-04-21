"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { error: "Email ou senha incorretos." };

  redirect("/dashboard");
}

export async function registro(_prev: { error?: string; success?: boolean; email?: string } | null, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;
  const confirmar = formData.get("confirmar") as string;

  if (senha !== confirmar) return { error: "As senhas não coincidem." };
  if (senha.length < 6) return { error: "A senha precisa ter pelo menos 6 caracteres." };

  const { data, error } = await supabase.auth.signUp({ email, password: senha });
  if (error) return { error: error.message };

  // Se sessão existe, pode ir direto ao dashboard
  if (data.session) redirect("/dashboard");

  // Caso contrário, confirmação de email necessária
  return { success: true, email };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function esqueceuSenha(_prev: { error?: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/redefinir-senha`,
  });

  if (error) return { error: "Não foi possível enviar o email. Verifique o endereço informado." };
  return { success: true };
}
