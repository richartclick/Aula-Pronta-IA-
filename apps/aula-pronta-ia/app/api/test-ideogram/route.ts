import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.IDEOGRAM_API_KEY;

  if (!key) {
    return NextResponse.json({ erro: "IDEOGRAM_API_KEY não encontrada nas variáveis de ambiente." });
  }

  try {
    const res = await fetch("https://api.ideogram.ai/generate", {
      method: "POST",
      headers: {
        "Api-Key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_request: {
          prompt: "cute dog coloring book illustration, black outlines, white background",
          model: "V_2",
          magic_prompt_option: "OFF",
          style_type: "DESIGN",
          aspect_ratio: "ASPECT_1_1",
        },
      }),
    });

    const status = res.status;
    const body = await res.json().catch(() => res.text());

    return NextResponse.json({
      status_http: status,
      key_configurada: true,
      key_primeiros_chars: key.slice(0, 8) + "...",
      resposta_ideogram: body,
    });
  } catch (err) {
    return NextResponse.json({
      erro_conexao: err instanceof Error ? err.message : String(err),
    });
  }
}
