import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = process.env.ANTHROPIC_API_KEY;

  if (!key) {
    return NextResponse.json({ ok: false, erro: "ANTHROPIC_API_KEY não está configurada no Vercel" });
  }

  const prefixo = key.slice(0, 10) + "..." + key.slice(-4);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        messages: [{ role: "user", content: "Responda apenas: ok" }],
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        chave_prefixo: prefixo,
        status_http: res.status,
        erro_anthropic: body,
      });
    }

    return NextResponse.json({
      ok: true,
      chave_prefixo: prefixo,
      status_http: res.status,
      resposta: body.content?.[0]?.text,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      chave_prefixo: prefixo,
      erro_conexao: err instanceof Error ? err.message : String(err),
    });
  }
}
