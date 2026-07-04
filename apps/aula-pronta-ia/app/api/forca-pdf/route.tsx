import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Line,
  Circle,
} from "@react-pdf/renderer";
import {
  TEMAS_FORCA,
  FAIXAS_FORCA,
  BNCC_FORCA,
  type ForcaItem,
  type FaixaForca,
} from "@/lib/forca/config";

export const maxDuration = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DotSvg = Svg as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DotLine = Line as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DotCircle = Circle as any;

// ── AI call ──────────────────────────────────────────────────────────────────

function extrairJSON(text: string): Array<{ palavra: string; dica: string }> {
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) throw new Error("JSON não encontrado");
  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("Resposta inválida");
  return parsed.filter(
    (item): item is { palavra: string; dica: string } =>
      typeof item?.palavra === "string" && typeof item?.dica === "string"
  );
}

async function gerarPalavras(
  temaLabel: string,
  faixa: FaixaForca,
  numPalavras: number
): Promise<Array<{ palavra: string; dica: string }>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("API key não configurada");

  const prompt = `Você é professor criativo criando um jogo de Forca para alunos brasileiros.
Gere ${numPalavras} palavra(s) em português relacionada(s) ao tema "${temaLabel}" para crianças de ${faixa.label}.

Requisitos:
- Cada palavra deve ter entre ${faixa.lengthMin} e ${faixa.lengthMax} letras
- Use palavras comuns e conhecidas por crianças brasileiras
- NÃO use nomes próprios, siglas ou palavras compostas com espaço
- Cada palavra precisa de uma dica curta (máx. 8 palavras) em português
- Caracteres acentuados são permitidos (ex: AÇÃO, LEÃO)

Retorne APENAS o JSON (sem texto extra):
[{"palavra":"GATO","dica":"Animal doméstico que mia e ronrona"}]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const data = await res.json() as { content: Array<{ text: string }> };
  const text = data.content?.[0]?.text ?? "";
  return extrairJSON(text);
}

// ── SVG Components ────────────────────────────────────────────────────────────

function Gallows({ size }: { size: number }) {
  return (
    <DotSvg width={size} height={size} viewBox="0 0 100 100">
      {/* Base */}
      <DotLine x1={5} y1={93} x2={95} y2={93} stroke="#334155" strokeWidth={3} strokeLinecap="round" />
      {/* Pole */}
      <DotLine x1={22} y1={93} x2={22} y2={5} stroke="#334155" strokeWidth={3} strokeLinecap="round" />
      {/* Beam */}
      <DotLine x1={22} y1={5} x2={72} y2={5} stroke="#334155" strokeWidth={3} strokeLinecap="round" />
      {/* Support brace */}
      <DotLine x1={22} y1={22} x2={46} y2={5} stroke="#334155" strokeWidth={2} strokeLinecap="round" />
      {/* Rope */}
      <DotLine x1={72} y1={5} x2={72} y2={24} stroke="#334155" strokeWidth={2} strokeLinecap="round" />
      {/* Rope knot */}
      <DotCircle cx={72} cy={27} r={3} fill="none" stroke="#334155" strokeWidth={1.5} />
    </DotSvg>
  );
}

// ── PDF Components ────────────────────────────────────────────────────────────

const LETRAS_ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ALPHA_COLS = 13;

function Blanks({
  palavra,
  gabarito,
  boxSize,
}: {
  palavra: string;
  gabarito: boolean;
  boxSize: number;
}) {
  const letras = palavra.toUpperCase().split("");
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
      {letras.map((letra, i) => (
        <View key={i} style={{ alignItems: "center", width: boxSize }}>
          {gabarito && (
            <Text
              style={{
                fontSize: boxSize * 0.6,
                fontFamily: "Helvetica-Bold",
                color: "#15803d",
                marginBottom: 2,
              }}
            >
              {letra}
            </Text>
          )}
          <View
            style={{
              width: boxSize,
              height: 2,
              backgroundColor: "#334155",
              marginTop: gabarito ? 0 : boxSize * 0.7,
            }}
          />
        </View>
      ))}
    </View>
  );
}

function AlphabetGrid({ alphBox }: { alphBox: number }) {
  const rows: string[][] = [];
  for (let i = 0; i < LETRAS_ALFABETO.length; i += ALPHA_COLS) {
    rows.push(LETRAS_ALFABETO.slice(i, i + ALPHA_COLS));
  }
  return (
    <View>
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row", gap: 2, marginBottom: 2 }}>
          {row.map((letra) => (
            <View
              key={letra}
              style={{
                width: alphBox,
                height: alphBox,
                borderWidth: 0.5,
                borderColor: "#94a3b8",
                borderRadius: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: alphBox * 0.5, color: "#64748b" }}>{letra}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function ForcaPuzzle({
  item,
  num,
  faixa,
  gabarito,
}: {
  item: ForcaItem;
  num: number;
  faixa: FaixaForca;
  gabarito: boolean;
}) {
  const { gallowsSize, boxSize, alphBox } = faixa;

  return (
    <View
      style={{
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 6,
        padding: 12,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          paddingBottom: 6,
          borderBottom: "0.5px solid #e2e8f0",
        }}
      >
        <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "#334155" }}>
          {gabarito ? `Gabarito — Palavra ${num}` : `Palavra ${num}`}
        </Text>
        <Text style={{ fontSize: 8, color: "#64748b" }}>
          Tema: {item.temaLabel} · {item.palavra.length} letras
        </Text>
      </View>

      {/* Content */}
      <View style={{ flexDirection: "row", gap: 14 }}>
        {/* Gallows */}
        <Gallows size={gallowsSize} />

        {/* Game area */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 7.5, color: "#64748b", marginBottom: 6, fontFamily: "Helvetica-Bold" }}>
            {gabarito ? "Resposta:" : "Descubra a palavra:"}
          </Text>

          <Blanks palavra={item.palavra} gabarito={gabarito} boxSize={boxSize} />

          <View style={{ height: 12 }} />

          {!gabarito && (
            <>
              <Text style={{ fontSize: 7, color: "#64748b", marginBottom: 4 }}>
                Risque as letras tentadas:
              </Text>
              <AlphabetGrid alphBox={alphBox} />
              <View style={{ height: 8 }} />
            </>
          )}

          <View
            style={{
              borderWidth: 0.5,
              borderColor: "#e2e8f0",
              borderRadius: 4,
              padding: 6,
              backgroundColor: "#f8fafc",
            }}
          >
            <Text style={{ fontSize: 7, color: "#64748b" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Dica: </Text>
              {item.dica}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 38,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1.5px solid #e2e8f0",
  },
  campoNome: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 20 },
  campoData: { flexDirection: "row", alignItems: "center", width: 110 },
  campoLabel: { fontSize: 8, color: "#64748b", marginRight: 4 },
  campoLinha: { flex: 1, borderBottom: "1px solid #94a3b8", height: 12 },
  titulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 2 },
  subtitulo: { fontSize: 7.5, color: "#94a3b8", marginBottom: 10 },
  gabarTitulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#dc2626", marginBottom: 10 },
  footer: {
    position: "absolute",
    bottom: 12,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 6.5, color: "#94a3b8", flex: 1 },
  footerBrand: { fontSize: 7, color: "#ec4899", fontFamily: "Helvetica-Bold" },
  footerPage: { fontSize: 6.5, color: "#94a3b8", textAlign: "right", width: 30 },
});

function buildPages(
  items: ForcaItem[],
  faixa: FaixaForca,
  gabarito: boolean,
  startPage: number,
  totalPages: number
) {
  const POR_PAGINA = 2;
  const pages: ForcaItem[][] = [];
  for (let i = 0; i < items.length; i += POR_PAGINA) {
    pages.push(items.slice(i, i + POR_PAGINA));
  }

  return pages.map((group, pi) => {
    const pageNum = startPage + pi;
    return (
      <Page key={`${gabarito ? "g" : "s"}${pi}`} size="A4" style={s.page}>
        {gabarito ? (
          <Text style={s.gabarTitulo}>Gabarito — Forca Temático</Text>
        ) : (
          <>
            <View style={s.header}>
              <View style={s.campoNome}>
                <Text style={s.campoLabel}>Nome:</Text>
                <View style={s.campoLinha} />
              </View>
              <View style={s.campoData}>
                <Text style={s.campoLabel}>Data:</Text>
                <View style={s.campoLinha} />
              </View>
            </View>
            <Text style={s.titulo}>🎯 Forca Temático — {faixa.label}</Text>
            <Text style={s.subtitulo}>
              Descubra a palavra letra por letra. Risque as letras que tentar no alfabeto abaixo.
            </Text>
          </>
        )}

        {group.map((item, gi) => (
          <ForcaPuzzle
            key={gi}
            item={item}
            num={(pi * POR_PAGINA) + gi + 1}
            faixa={faixa}
            gabarito={gabarito}
          />
        ))}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>{BNCC_FORCA}</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerPage}>{pageNum}/{totalPages}</Text>
        </View>
      </Page>
    );
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { temaId, faixaId, numPalavras } = (await req.json()) as {
      temaId: string;
      faixaId: string;
      numPalavras: number;
    };

    const tema = TEMAS_FORCA.find((t) => t.id === temaId) ?? TEMAS_FORCA[0];
    const faixa = FAIXAS_FORCA.find((f) => f.id === faixaId) ?? FAIXAS_FORCA[1];
    const qtd = Math.min(Math.max(Number(numPalavras) || 2, 1), 4);

    const palavras = await gerarPalavras(tema.label, faixa, qtd);
    if (palavras.length === 0) {
      return NextResponse.json({ error: "Não foi possível gerar palavras. Tente outro tema." }, { status: 422 });
    }

    const items: ForcaItem[] = palavras.slice(0, qtd).map((p) => ({
      palavra: p.palavra.toUpperCase().trim(),
      dica: p.dica,
      temaLabel: tema.label,
    }));

    const studentPagesCount = Math.ceil(items.length / 2);
    const gabaritoPagesCount = Math.ceil(items.length / 2);
    const totalPages = studentPagesCount + gabaritoPagesCount;

    const studentPages = buildPages(items, faixa, false, 1, totalPages);
    const gabaritoPages = buildPages(items, faixa, true, studentPagesCount + 1, totalPages);

    const buffer = await renderToBuffer(
      <Document title={`Forca ${tema.label} — Aula Pronta IA`} author="Aula Pronta IA">
        {[...studentPages, ...gabaritoPages]}
      </Document>
    );

    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="forca-${temaId}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[FORCA-PDF]", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
