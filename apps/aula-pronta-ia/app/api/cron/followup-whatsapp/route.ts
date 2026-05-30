import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MENSAGENS = {
  d1: (nome: string) =>
    `Oi ${nome}! Aqui é a Ana da Aula Pronta IA 👋\nVi que você se cadastrou ontem e queria saber se já teve chance de testar.\nÉ só entrar, descrever sua aula e em segundos você tem o plano completo — tudo alinhado à BNCC.\nQualquer dúvida é só me chamar aqui!\n👉 aulapronta.ai`,
  d3: (nome: string) =>
    `Oi ${nome}, tudo bem?\nSabia que com a Aula Pronta IA você também gera atividades prontas para os alunos?\nProfessores estão economizando horas de planejamento toda semana 🙌\nQue tal testar agora? aulapronta.ai`,
  d7: (nome: string) =>
    `Oi ${nome}! A Ana aqui de novo 😊\nVocê ainda tem aulas gratuitas disponíveis — não deixa passar!\nE se quiser mais aulas, o plano Básico tá por R$ 29,90/mês com 70 aulas — cancela quando quiser.\nOu vai de Premium com aulas ilimitadas por R$ 39,90/mês 🚀\n👉 aulapronta.ai`,
};

async function enviarWhatsApp(telefone: string, mensagem: string) {
  const instance = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;
  if (!instance || !token || !clientToken) return false;

  const phone = "55" + telefone.replace(/\D/g, "");
  const res = await fetch(
    `https://api.z-api.io/instances/${instance}/token/${token}/send-text`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "Client-Token": clientToken },
      body: JSON.stringify({ phone, message: mensagem }),
    }
  );
  return res.ok;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const agora = new Date();

  const resultado = { d1: 0, d3: 0, d7: 0, erros: 0 };

  for (const [dia, coluna] of [["d1", "whatsapp_d1_enviado"], ["d3", "whatsapp_d3_enviado"], ["d7", "whatsapp_d7_enviado"]] as const) {
    const diasAtras = dia === "d1" ? 1 : dia === "d3" ? 3 : 7;
    const inicio = new Date(agora);
    inicio.setDate(inicio.getDate() - diasAtras);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(inicio);
    fim.setHours(23, 59, 59, 999);

    const { data: leads } = await supabase
      .from("leads")
      .select("id, nome, whatsapp")
      .gte("created_at", inicio.toISOString())
      .lte("created_at", fim.toISOString())
      .eq(coluna, false)
      .not("whatsapp", "is", null);

    for (const lead of leads ?? []) {
      if (!lead.whatsapp) continue;
      const ok = await enviarWhatsApp(lead.whatsapp, MENSAGENS[dia](lead.nome));
      if (ok) {
        await supabase.from("leads").update({ [coluna]: true }).eq("id", lead.id);
        resultado[dia]++;
      } else {
        resultado.erros++;
      }
    }
  }

  console.log("[FOLLOWUP-WHATSAPP]", resultado);
  return NextResponse.json({ ok: true, ...resultado });
}
