import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { data: perfil } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!perfil?.stripe_customer_id) {
    return NextResponse.json({ error: "Sem assinatura ativa" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "https://aulaprontaia.vercel.app";

  const session = await stripe.billingPortal.sessions.create({
    customer: perfil.stripe_customer_id,
    return_url: `${origin}/dashboard/plano`,
  });

  return NextResponse.json({ url: session.url });
}
