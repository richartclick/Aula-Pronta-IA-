import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Circle,
  G,
} from "@react-pdf/renderer";
import { FIGURAS, type Ponto } from "@/lib/ligue-pontos/figuras";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SvgText = Text as any;

export const maxDuration = 60;

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
    fontFamily: "Helvetica",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1.5px solid #e2e8f0",
  },
  campoNome: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 20 },
  campoData: { flexDirection: "row", alignItems: "center", width: 110 },
  campoLabel: { fontSize: 8, color: "#64748b", marginRight: 4 },
  campoLinha: { flex: 1, borderBottom: "1px solid #94a3b8", height: 12 },
  titulo: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 8.5,
    color: "#94a3b8",
    marginBottom: 10,
    textAlign: "center",
  },
  dica: {
    fontSize: 7.5,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 6.5, color: "#94a3b8" },
  footerBrand: { fontSize: 7, color: "#ec4899", fontFamily: "Helvetica-Bold" },
  footerPage: { fontSize: 6.5, color: "#94a3b8", textAlign: "right", width: 30 },
});

// SVG 400×400 viewBox renderizado em 500×500pt no PDF
const SVG_SIZE = 500;
const VB = 400; // viewBox size

function PontoSVG({ pontos }: { pontos: Ponto[] }) {
  return (
    <Svg
      viewBox={`0 0 ${VB} ${VB}`}
      // @ts-ignore — react-pdf aceita width/height numérico no Svg
      width={SVG_SIZE}
      height={SVG_SIZE}
    >
      {pontos.map(([x, y], i) => {
        const n = i + 1;
        const fs = n >= 10 ? 8 : 10;
        return (
          <G key={i}>
            {/* Círculo do ponto */}
            <Circle
              cx={x}
              cy={y}
              r={14}
              fill="white"
              stroke="#1e293b"
              strokeWidth={2}
            />
            {/* Número dentro do círculo */}
            <SvgText
              x={x}
              y={y + fs * 0.38}
              textAnchor="middle"
              fontSize={fs}
              fill="#1e293b"
              fontFamily="Helvetica-Bold"
            >
              {String(n)}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

function LiguePage({
  figura,
  copia,
  total,
}: {
  figura: (typeof FIGURAS)[0];
  copia: number;
  total: number;
}) {
  return (
    <Page size="A4" style={s.page}>
      {/* Cabeçalho */}
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

      {/* Título */}
      <Text style={s.titulo}>{figura.emoji} Ligue os Pontos — {figura.label}</Text>
      <Text style={s.subtitulo}>
        Una os pontos de 1 a {figura.pontos.length} em ordem e descubra a figura!
      </Text>

      {/* Figura SVG */}
      <PontoSVG pontos={figura.pontos} />

      {/* Dica */}
      <Text style={s.dica}>
        Dica: ligue o ponto {figura.pontos.length} de volta ao ponto 1 para completar a figura · depois pinte!
      </Text>

      {/* Rodapé */}
      <View style={s.footer} fixed>
        <Text style={s.footerText}>BNCC EI03TS — Traços, sons, cores e formas</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text style={s.footerPage}>
          {total > 1 ? `${copia}/${total}` : ""}
        </Text>
      </View>
    </Page>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { figuraId, quantidade } = await req.json() as {
      figuraId: string;
      quantidade: number;
    };

    const figura = FIGURAS.find((f) => f.id === figuraId);
    if (!figura) {
      return NextResponse.json({ error: "Figura não encontrada." }, { status: 400 });
    }

    const qtd = Math.min(Math.max(Number(quantidade) || 1, 1), 10);

    const buffer = await renderToBuffer(
      <Document title={`Ligue os Pontos — ${figura.label}`} author="Aula Pronta IA">
        {Array.from({ length: qtd }, (_, i) => (
          <LiguePage key={i} figura={figura} copia={i + 1} total={qtd} />
        ))}
      </Document>
    );

    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ligue-pontos-${figuraId}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[LIGUE-PONTOS-PDF] Erro:", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
