import { createClient } from "@/lib/supabase/server";

export const LIMITE_GRATUITO = 5;

export type UsoMensal = {
  plano: string;
  aulasNoMes: number;
  limite: number;
  restantes: number;
  bloqueado: boolean;
};

export async function getUsoMensal(): Promise<UsoMensal | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: perfil } = await supabase
    .from("profiles")
    .select("plano")
    .eq("id", user.id)
    .single();

  const plano = perfil?.plano ?? "gratuito";

  if (plano !== "gratuito") {
    return { plano, aulasNoMes: 0, limite: Infinity, restantes: Infinity, bloqueado: false };
  }

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("aulas")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", inicioMes.toISOString());

  const aulasNoMes = count ?? 0;

  return {
    plano,
    aulasNoMes,
    limite: LIMITE_GRATUITO,
    restantes: Math.max(0, LIMITE_GRATUITO - aulasNoMes),
    bloqueado: aulasNoMes >= LIMITE_GRATUITO,
  };
}
