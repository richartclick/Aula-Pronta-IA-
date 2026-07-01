import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

const PROMPT_BASE =
  "Coloring book illustration for Brazilian children. Black thick outlines only. Clean simple lines. No shading. No color fill. Pure white background. Large areas to color. Extremely friendly and cute cartoon character. Educational cartoon style. Professional quality for printing. A4 page. Single centered composition. No text, no words, no labels, no letters inside the image.";

const NEGATIVE_PROMPT =
  "realistic, photograph, thin lines, excessive detail, busy background, cut objects, watermark, any text, any words, any letters, any labels, english text, portuguese text, numbers as text, blurry, dark, shadows, colored fill, gradient, adult content";

export async function POST(req: NextRequest) {
  const { promptEn, complexidade, quantidade } = await req.json();

  const ideogramKey = process.env.IDEOGRAM_API_KEY;

  if (!ideogramKey) {
    return NextResponse.json({ stub: true });
  }

  const prompt = `${PROMPT_BASE} ${promptEn ?? ""}. ${complexidade ?? ""}`.trim();

  const gerarUma = async (): Promise<string | null> => {
    try {
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
        console.error(`[DESENHOS] Ideogram ${res.status}:`, await res.text().catch(() => ""));
        return null;
      }

      const data = await res.json();
      return data?.data?.[0]?.url ?? null;
    } catch (err) {
      console.error("[DESENHOS] Falha numa imagem:", err);
      return null;
    }
  };

  try {
    // Gera todas em paralelo — muito mais rápido que sequencial
    const resultados = await Promise.all(
      Array.from({ length: quantidade }, () => gerarUma())
    );

    const imagens = resultados.filter((url): url is string => !!url);

    if (imagens.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem foi gerada. Tente novamente." }, { status: 500 });
    }

    console.log(`[DESENHOS] ${imagens.length}/${quantidade} imagens geradas.`);
    return NextResponse.json({ imagens });
  } catch (err) {
    console.error("[DESENHOS] Erro geral:", err);
    return NextResponse.json({ error: "Erro de conexão com o Ideogram. Tente novamente." }, { status: 500 });
  }
}
