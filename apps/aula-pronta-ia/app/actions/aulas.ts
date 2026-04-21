"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavorita(aulaId: string, favorita: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("aulas")
    .update({ favorita: !favorita })
    .eq("id", aulaId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/minhas-aulas");
}

export async function excluirAula(aulaId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("aulas")
    .delete()
    .eq("id", aulaId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/minhas-aulas");
}
