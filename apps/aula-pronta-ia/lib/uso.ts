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
    .select("plano, geracoes_este_mes, geracoes_reset_em")
    .eq("id", user.id)
    .single();

  const plano = perfil?.plano ?? "gratuito";

  if (plano !== "gratuito") {
    return { plano, aulasNoMes: 0, limite: Infinity, restantes: Infinity, bloqueado: false };
  }

  const agora = new Date();
  const resetEm = perfil?.geracoes_reset_em ? new Date(perfil.geracoes_reset_em) : null;
  const mesAtual = agora.getFullYear() * 12 + agora.getMonth();
  const mesReset = resetEm ? resetEm.getFullYear() * 12 + resetEm.getMonth() : -1;
  const aulasNoMes = mesReset === mesAtual ? (perfil?.geracoes_este_mes ?? 0) : 0;

  return {
    plano,
    aulasNoMes,
    limite: LIMITE_GRATUITO,
    restantes: Math.max(0, LIMITE_GRATUITO - aulasNoMes),
    bloqueado: aulasNoMes >= LIMITE_GRATUITO,
  };
}
