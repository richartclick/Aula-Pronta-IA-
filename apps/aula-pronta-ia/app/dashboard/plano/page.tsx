import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import PlanoClient from "./PlanoClient";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export default async function PlanoPage({
  searchParams,
}: {
  searchParams: Promise<{ sucesso?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let { data: perfil } = await supabase
    .from("profiles")
    .select("plano, stripe_customer_id")
    .eq("id", user!.id)
    .single();

  // Fallback: se voltou do checkout com sucesso e o stripe_customer_id ainda não foi salvo pelo webhook
  if (params.sucesso && params.session_id && !perfil?.stripe_customer_id) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
      const session = await stripe.checkout.sessions.retrieve(params.session_id, {
        expand: ["subscription"],
      });

      if (session.customer && session.subscription) {
        const sub = session.subscription as Stripe.Subscription;
        const plano = sub.metadata?.plano ?? "basico";

        await supabase
          .from("profiles")
          .update({ plano, stripe_customer_id: session.customer as string })
          .eq("id", user!.id);

        const { data: perfilAtualizado } = await supabase
          .from("profiles")
          .select("plano, stripe_customer_id")
          .eq("id", user!.id)
          .single();

        perfil = perfilAtualizado;
      }
    } catch {
      // webhook pode ter processado antes — continua normalmente
    }
  }

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
