import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  FAMILIAS,
  DIFICULDADE_CONFIG,
  BNCC_CRUZADINHA,
  aplicarLacunas,
  bancoDeSilabas,
  type CruzadinhaDificuldade,
  type PalavraItem,
} from "@/lib/cruzadinha-silabica/config";

export const maxDuration = 60;

// ── AI ────────────────────────────────────────────────────────────────────────

interface AIWord {
  palavra: string;
  silabas: string[];
  dica: string;
  emoji: string;
}

function extrairJSON(text: string): AIWord[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("JSON não encontrado");
  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("Resposta inválida");
  return parsed.filter(
    (x): x is AIWord =>
      typeof x?.palavra === "string" &&
      Array.isArray(x?.silabas) &&
      typeof x?.dica === "string" &&
      typeof x?.emoji === "string"
  );
}

async function gerarPalavras(
  familiaLabel: string,
  silabasLabel: string,
  numPalavras: number
): Promise<AIWord[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("API key não configurada");

  const prompt = `Você é professor de português para alfabetização brasileira.
Gere ${numPalavras} palavras em PORTUGUÊS que contenham sílabas da ${familiaLabel} (${silabasLabel}).

Requisitos:
- Cada palavra deve conter PELO MENOS UMA sílaba dessa família
- Palavras simples, conhecidas por crianças brasileiras (animais, alimentos, objetos, natureza)
- Separe cada palavra em sílabas corretamente em português
- Forneça uma dica curta (máximo 5 palavras) em português
- Forneça um emoji representativo da palavra
- NÃO use nomes próprios
- Varie o número de sílabas (prefira palavras com 2 a 4 sílabas)

Retorne APENAS o JSON sem texto extra:
[{"palavra":"BOLA","silabas":["BO","LA"],"dica":"objeto redondo para jogar","emoji":"⚽"},{"palavra":"BORBOLETA","silabas":["BOR","BO","LE","TA"],"dica":"inseto com asas coloridas","emoji":"🦋"}]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const data = (await res.json()) as { content: Array<{ text: string }> };
  return extrairJSON(data.content?.[0]?.text ?? "");
}

// ── Componentes PDF ───────────────────────────────────────────────────────────

const BOX_W = 34;
const BOX_H = 26;
const BOX_GAP = 3;
const ACCENT = "#6366f1"; // indigo

function SilabBox({
  silaba,
  isBlank,
  gabarito,
}: {
  silaba: string;
  isBlank: boolean;
  gabarito: boolean;
}) {
  const showContent = !isBlank || gabarito;
  return (
    <View
      style={{
        width: BOX_W,
        height: BOX_H,
        borderWidth: isBlank ? 1.5 : 1,
        borderColor: isBlank ? ACCENT : "#94a3b8",
        borderRadius: 4,
        marginRight: BOX_GAP,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isBlank && !gabarito ? "#eef2ff" : "#ffffff",
      }}
    >
      {showContent && (
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Helvetica-Bold",
            color: gabarito && isBlank ? "#4f46e5" : "#1e293b",
            textAlign: "center",
          }}
        >
          {silaba.toUpperCase()}
        </Text>
      )}
    </View>
  );
}

function PalavraRow({
  item,
  index,
  gabarito,
}: {
  item: PalavraItem;
  index: number;
  gabarito: boolean;
}) {
  const lacunaSet = new Set(item.lacunas);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#f1f5f9",
      }}
    >
      {/* Número */}
      <Text
        style={{
          fontSize: 9,
          color: "#94a3b8",
          width: 16,
          textAlign: "right",
          marginRight: 6,
        }}
      >
        {index + 1}.
      </Text>

      {/* Emoji */}
      <Text style={{ fontSize: 16, marginRight: 8, width: 22 }}>
        {item.emoji}
      </Text>

      {/* Caixas de sílabas */}
      <View style={{ flexDirection: "row", flex: 1 }}>
        {item.silabas.map((sil, si) => (
          <SilabBox
            key={si}
            silaba={sil}
            isBlank={lacunaSet.has(si)}
            gabarito={gabarito}
          />
        ))}
      </View>

      {/* Dica */}
      <Text
        style={{
          fontSize: 7.5,
          color: "#64748b",
          maxWidth: 140,
          textAlign: "right",
          lineHeight: 1.3,
        }}
      >
        {item.dica}
      </Text>
    </View>
  );
}

// ── Páginas ────────────────────────────────────────────────────────────────────

function buildPage(
  palavras: PalavraItem[],
  banco: string[],
  familiaLabel: string,
  dificuldade: CruzadinhaDificuldade,
  gabarito: boolean,
  pageNum: number,
  totalPages: number
) {
  const difLabel = DIFICULDADE_CONFIG[dificuldade].label;

  return (
    <Page
      size="A4"
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 32,
        paddingTop: 22,
        paddingBottom: 32,
        fontFamily: "Helvetica",
      }}
    >
      {/* Cabeçalho */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottomWidth: 1.5,
          borderBottomColor: ACCENT,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Helvetica-Bold",
              color: "#1e293b",
              marginBottom: 2,
            }}
          >
            {gabarito ? "Gabarito — " : ""}Cruzadinha Silábica
          </Text>
          <Text style={{ fontSize: 8, color: "#64748b" }}>
            {familiaLabel} · {difLabel}
            {!gabarito && " · Complete as sílabas em branco usando o banco abaixo"}
          </Text>
        </View>

        {!gabarito && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 7, color: "#94a3b8" }}>Nome:</Text>
            <View
              style={{
                width: 120,
                borderBottomWidth: 0.5,
                borderBottomColor: "#94a3b8",
                height: 14,
              }}
            />
          </View>
        )}
      </View>

      {/* Palavras */}
      <View style={{ flex: 1 }}>
        {palavras.map((p, i) => (
          <PalavraRow key={i} item={p} index={i} gabarito={gabarito} />
        ))}
      </View>

      {/* Banco de Sílabas (apenas na folha do aluno) */}
      {!gabarito && (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e0e7ff",
            borderRadius: 8,
            backgroundColor: "#eef2ff",
            padding: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
              color: ACCENT,
              marginBottom: 6,
            }}
          >
            Banco de Sílabas — use cada sílaba uma vez:
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {banco.map((sil, i) => (
              <View
                key={i}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderWidth: 1,
                  borderColor: ACCENT,
                  borderRadius: 4,
                  backgroundColor: "#ffffff",
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: "Helvetica-Bold",
                    color: "#4f46e5",
                  }}
                >
                  {sil.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Rodapé */}
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 32,
          right: 32,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        fixed
      >
        <Text style={{ fontSize: 6, color: "#cbd5e1" }}>
          {BNCC_CRUZADINHA}
        </Text>
        <Text
          style={{
            fontSize: 6.5,
            color: ACCENT,
            fontFamily: "Helvetica-Bold",
          }}
        >
          Aula Pronta IA
        </Text>
        <Text style={{ fontSize: 6, color: "#cbd5e1" }}>
          {pageNum}/{totalPages}
        </Text>
      </View>
    </Page>
  );
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      familiaId: string;
      dificuldade: CruzadinhaDificuldade;
      numPalavras: number;
    };

    const { familiaId, dificuldade = "medio", numPalavras } = body;
    const qtd = Math.min(Math.max(Number(numPalavras) || 6, 4), 10);

    const familia = FAMILIAS.find((f) => f.id === familiaId) ?? FAMILIAS[0];

    // Call AI
    const aiWords = await gerarPalavras(
      familia.label,
      familia.silabas.join(", "),
      qtd
    );
    if (aiWords.length === 0) {
      return NextResponse.json(
        { error: "Não foi possível gerar palavras. Tente outra família." },
        { status: 422 }
      );
    }

    // Apply blanks
    const palavras: PalavraItem[] = aiWords.slice(0, qtd).map((w) =>
      aplicarLacunas(
        { palavra: w.palavra.toUpperCase(), silabas: w.silabas.map((s) => s.toUpperCase()), dica: w.dica, emoji: w.emoji },
        dificuldade,
        familia.silabas
      )
    );

    const banco = bancoDeSilabas(palavras);

    const buffer = await renderToBuffer(
      <Document
        title={`Cruzadinha Silábica — ${familia.label} — Aula Pronta IA`}
        author="Aula Pronta IA"
      >
        {buildPage(palavras, banco, familia.label, dificuldade, false, 1, 2)}
        {buildPage(palavras, banco, familia.label, dificuldade, true, 2, 2)}
      </Document>
    );

    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cruzadinha-silabica-${familiaId}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[CRUZADINHA-SILABICA-PDF]", err);
    const msg = err instanceof Error ? err.message : "Falha ao gerar o PDF.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
