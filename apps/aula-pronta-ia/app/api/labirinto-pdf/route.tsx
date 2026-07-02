import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Rect,
  Line,
  Polyline,
  G,
} from "@react-pdf/renderer";
import { DIFICULDADES, type LabirintoData } from "@/lib/labirinto/gerador";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SvgText = Text as any;

export const maxDuration = 60;

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 38,
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
  titulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 2, textAlign: "center" },
  subtitulo: { fontSize: 8, color: "#94a3b8", marginBottom: 8, textAlign: "center" },
  gabarTitulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#dc2626", marginBottom: 8, textAlign: "center" },
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

const MH = 10; // margem horizontal interna do SVG
const MV_TOP = 16; // margem topo (para label ENTRADA)
const MV_BOT = 16; // margem base (para label SAÍDA)
const SW = 2;   // espessura da parede

function LabirintoSVG({
  celulas,
  solucao,
  linhas,
  colunas,
  tc, // tamCelula em pt
}: {
  celulas: LabirintoData["celulas"];
  solucao: [number, number][] | null;
  linhas: number;
  colunas: number;
  tc: number;
}) {
  const W = 2 * MH + colunas * tc;
  const H = MV_TOP + linhas * tc + MV_BOT;

  const pontosCaminho = solucao
    ? solucao
        .map(([r, c]) => `${MH + c * tc + tc / 2},${MV_TOP + r * tc + tc / 2}`)
        .join(" ")
    : "";

  return (
    <Svg
      viewBox={`0 0 ${W} ${H}`}
      // @ts-ignore
      width={W}
      height={H}
    >
      <Rect x={0} y={0} width={W} height={H} fill="white" />

      {/* Solução (gabarito) */}
      {solucao && solucao.length > 0 && (
        <Polyline
          points={pontosCaminho}
          stroke="#f43f5e"
          strokeWidth={tc * 0.28}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.55}
        />
      )}

      {/* Paredes de cada célula */}
      {celulas.map((linha, r) =>
        linha.map((celula, c) => {
          const x = MH + c * tc;
          const y = MV_TOP + r * tc;
          return (
            <G key={`${r}-${c}`}>
              {celula.paredes.top && (
                <Line x1={x} y1={y} x2={x + tc} y2={y} stroke="#1e293b" strokeWidth={SW} strokeLinecap="square" />
              )}
              {celula.paredes.right && (
                <Line x1={x + tc} y1={y} x2={x + tc} y2={y + tc} stroke="#1e293b" strokeWidth={SW} strokeLinecap="square" />
              )}
              {celula.paredes.bottom && (
                <Line x1={x} y1={y + tc} x2={x + tc} y2={y + tc} stroke="#1e293b" strokeWidth={SW} strokeLinecap="square" />
              )}
              {celula.paredes.left && (
                <Line x1={x} y1={y} x2={x} y2={y + tc} stroke="#1e293b" strokeWidth={SW} strokeLinecap="square" />
              )}
            </G>
          );
        })
      )}

      {/* Label ENTRADA */}
      <SvgText
        x={MH + 0 * tc + tc / 2}
        y={MV_TOP - 4}
        textAnchor="middle"
        fontSize={8}
        fill="#16a34a"
        fontFamily="Helvetica-Bold"
      >
        ENTRADA
      </SvgText>

      {/* Seta entrada */}
      <SvgText
        x={MH + 0 * tc + tc / 2}
        y={MV_TOP - 12}
        textAnchor="middle"
        fontSize={6}
        fill="#16a34a"
      >
        ▼
      </SvgText>

      {/* Label SAÍDA */}
      <SvgText
        x={MH + (colunas - 1) * tc + tc / 2}
        y={MV_TOP + linhas * tc + 12}
        textAnchor="middle"
        fontSize={8}
        fill="#dc2626"
        fontFamily="Helvetica-Bold"
      >
        SAÍDA
      </SvgText>

      {/* Seta saída */}
      <SvgText
        x={MH + (colunas - 1) * tc + tc / 2}
        y={MV_TOP + linhas * tc + MV_BOT - 1}
        textAnchor="middle"
        fontSize={6}
        fill="#dc2626"
      >
        ▼
      </SvgText>
    </Svg>
  );
}

function PaginaLabirinto({
  dados,
  config,
  gabarito,
  copia,
  totalCopias,
}: {
  dados: LabirintoData;
  config: (typeof DIFICULDADES)[0];
  gabarito: boolean;
  copia?: number;
  totalCopias?: number;
}) {
  const { celulas, solucao } = dados;
  const { linhas, colunas, tamCelulaPDF } = config;
  const totalPags = (totalCopias ?? 1) + 1; // N cópias + 1 gabarito
  const pagAtual = gabarito ? totalPags : (copia ?? 1);

  return (
    <Page size="A4" style={s.page}>
      {!gabarito && (
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
      )}

      {gabarito ? (
        <Text style={s.gabarTitulo}>Gabarito — Labirinto {config.label}</Text>
      ) : (
        <>
          <Text style={s.titulo}>🌀 Labirinto — {config.label}</Text>
          <Text style={s.subtitulo}>Encontre o caminho da ENTRADA até a SAÍDA!</Text>
        </>
      )}

      <LabirintoSVG
        celulas={celulas}
        solucao={gabarito ? solucao : null}
        linhas={linhas}
        colunas={colunas}
        tc={tamCelulaPDF}
      />

      <View style={s.footer} fixed>
        <Text style={s.footerText}>BNCC EI03CG — Corpo, gestos e movimentos · Raciocínio lógico</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text style={s.footerPage}>{pagAtual}/{totalPags}</Text>
      </View>
    </Page>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { dados, quantidade } = await req.json() as {
      dados: LabirintoData;
      quantidade: number;
    };

    const config = DIFICULDADES.find((d) => d.id === dados.dificuldadeId);
    if (!config) {
      return NextResponse.json({ error: "Dificuldade inválida." }, { status: 400 });
    }

    const qtd = Math.min(Math.max(Number(quantidade) || 1, 1), 30);

    const buffer = await renderToBuffer(
      <Document title={`Labirinto ${config.label}`} author="Aula Pronta IA">
        {/* N cópias em branco */}
        {Array.from({ length: qtd }, (_, i) => (
          <PaginaLabirinto
            key={i}
            dados={dados}
            config={config}
            gabarito={false}
            copia={i + 1}
            totalCopias={qtd}
          />
        ))}
        {/* 1 gabarito */}
        <PaginaLabirinto
          dados={dados}
          config={config}
          gabarito={true}
          totalCopias={qtd}
        />
      </Document>
    );

    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="labirinto-${dados.dificuldadeId}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[LABIRINTO-PDF] Erro:", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
