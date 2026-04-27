import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import PlanoClient from "./PlanoClient";

export const dynamic = "force-dynamic";

export default async function PlanoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: perfil } = await supabase
    .from("profiles")
    .select("plano, stripe_customer_id")
    .eq("id", user!.id)
    .single();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PlanoClient
        planoAtual={perfil?.plano ?? "gratuito"}
        temAssinatura={!!perfil?.stripe_customer_id}
      />
    </Suspense>
  );
}
