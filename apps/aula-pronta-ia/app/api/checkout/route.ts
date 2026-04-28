import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });

  const PRICE_IDS: Record<string, string> = {
    basico: process.env.STRIPE_PRICE_BASICO!,
    premium: process.env.STRIPE_PRICE_PREMIUM!,
  };

  const { plano } = await req.json();

  const priceId = PRICE_IDS[plano];
  if (!priceId) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  // Pega o usuário logado para incluir nos metadados
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user?.email ?? undefined,
    success_url: `${origin}/dashboard/plano?sucesso=1&plano=${plano}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/plano?cancelado=1`,
    locale: "pt-BR",
    subscription_data: {
      metadata: { plano, user_id: user?.id ?? "" },
    },
  });

  return NextResponse.json({ url: session.url });
}
