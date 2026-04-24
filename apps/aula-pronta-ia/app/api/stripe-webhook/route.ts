import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !sig) {
    return NextResponse.json({ error: "Webhook secret não configurado" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Pega o plano e user_id dos metadados gravados no checkout
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const plano = sub.metadata?.plano ?? "basico";
      const userId = sub.metadata?.user_id;

      if (userId) {
        // Atualiza o plano diretamente pelo user_id
        await supabase
          .from("profiles")
          .update({ plano, stripe_customer_id: session.customer as string })
          .eq("id", userId);
      } else if (session.customer_email) {
        // Fallback: busca pelo email caso o user_id não tenha sido gravado
        const { data: users } = await supabase.auth.admin.listUsers();
        const found = users?.users.find((u) => u.email === session.customer_email);
        if (found) {
          await supabase
            .from("profiles")
            .update({ plano, stripe_customer_id: session.customer as string })
            .eq("id", found.id);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id;

      if (userId) {
        await supabase
          .from("profiles")
          .update({ plano: "gratuito" })
          .eq("id", userId);
      } else {
        // Fallback: busca pelo stripe_customer_id salvo no profiles
        await supabase
          .from("profiles")
          .update({ plano: "gratuito" })
          .eq("stripe_customer_id", sub.customer as string);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
