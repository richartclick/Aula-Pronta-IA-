import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });

  const PRICE_IDS: Record<string, string> = {
    basico: process.env.STRIPE_PRICE_BASICO!,
    premium: process.env.STRIPE_PRICE_PREMIUM!,
  };

  const { plano, email } = await req.json();

  const priceId = PRICE_IDS[plano];
  if (!priceId) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email ?? undefined,
    success_url: `${origin}/dashboard/plano?sucesso=1`,
    cancel_url: `${origin}/dashboard/plano?cancelado=1`,
    locale: "pt-BR",
    subscription_data: {
      metadata: { plano },
    },
  });

  return NextResponse.json({ url: session.url });
}
