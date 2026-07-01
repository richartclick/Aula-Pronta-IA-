import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const PROMPT_BASE =
  "Coloring book illustration for children. Black thick outlines. Clean simple lines. No shading. No color fill. Pure white background. Large areas to color. Extremely friendly and cute cartoon character. Educational cartoon style. Professional quality for printing. A4 page. Single centered composition.";

const NEGATIVE_PROMPT =
  "realistic, photograph, thin lines, excessive detail, busy background, cut objects, watermark, text inside image, blurry, dark, shadows, colored fill, gradient, adult content";

export async function POST(req: NextRequest) {
  const { promptEn, complexidade, quantidade } = await req.json();

  const ideogramKey = process.env.IDEOGRAM_API_KEY;

  if (!ideogramKey) {
    return NextResponse.json({ stub: true });
  }

  const prompt = `${PROMPT_BASE} ${promptEn ?? ""}. ${complexidade ?? ""}`.trim();

  try {
    const imagens: string[] = [];

    // Gera as imagens em sequência para respeitar rate limits
    for (let i = 0; i < quantidade; i++) {
      const res = await fetch("https://api.ideogram.ai/generate", {
        method: "POST",
        headers: {
          "Api-Key": ideogramKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_request: {
            prompt,
            negative_prompt: NEGATIVE_PROMPT,
            model: "V_2",
            magic_prompt_option: "OFF",
            style_type: "DESIGN",
            aspect_ratio: "ASPECT_1_1",
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text().catch(() => "");
        console.error(`[DESENHOS] Ideogram erro ${res.status}:`, err.slice(0, 200));
        if (imagens.length === 0) {
          return NextResponse.json({ error: "Erro ao gerar desenhos. Verifique a chave Ideogram." }, { status: 500 });
        }
        break;
      }

      const data = await res.json();
      const url: string | undefined = data?.data?.[0]?.url;
      if (url) imagens.push(url);
    }

    if (imagens.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem foi gerada. Tente novamente." }, { status: 500 });
    }

    return NextResponse.json({ imagens });
  } catch (err) {
    console.error("[DESENHOS] Erro:", err);
    return NextResponse.json({ error: "Erro de conexão com o Ideogram. Tente novamente." }, { status: 500 });
  }
}
