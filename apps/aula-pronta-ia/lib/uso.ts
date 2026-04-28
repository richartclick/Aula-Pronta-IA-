import { createClient } from "@/lib/supabase/server";

export const LIMITE_GRATUITO = 5;
export const LIMITE_BASICO = 70;

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

  if (plano === "premium") {
    return { plano, aulasNoMes: 0, limite: Infinity, restantes: Infinity, bloqueado: false };
  }

  const agora = new Date();
  const resetEm = perfil?.geracoes_reset_em ? new Date(perfil.geracoes_reset_em) : null;
  const mesAtual = agora.getFullYear() * 12 + agora.getMonth();
  const mesReset = resetEm ? resetEm.getFullYear() * 12 + resetEm.getMonth() : -1;
  const aulasNoMes = mesReset === mesAtual ? (perfil?.geracoes_este_mes ?? 0) : 0;

  const limite = plano === "basico" ? LIMITE_BASICO : LIMITE_GRATUITO;

  return {
    plano,
    aulasNoMes,
    limite,
    restantes: Math.max(0, limite - aulasNoMes),
    bloqueado: aulasNoMes >= limite,
  };
}
