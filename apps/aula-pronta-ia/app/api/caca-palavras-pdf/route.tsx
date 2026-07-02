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
  G,
} from "@react-pdf/renderer";
import { CELL_PDF, BNCC_CACA, type CacaData } from "@/lib/caca-palavras/gerador";

export const maxDuration = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SvgText = Text as any;

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
  gridArea: { alignItems: "center", marginBottom: 12 },
  wordList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 10,
    marginTop: 4,
    width: "100%",
  },
  wordPill: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  wordLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#334155" },
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

function GridSVG({ dados, gabarito }: { dados: CacaData; gabarito: boolean }) {
  const { grid, colocadas, linhas, colunas, faixaEtaria } = dados;
  const tc = CELL_PDF[faixaEtaria] ?? 30;
  const W = colunas * tc;
  const H = linhas * tc;
  const fs = tc >= 36 ? 14 : tc >= 30 ? 11 : 9;

  const wordCells = new Set(
    gabarito ? colocadas.flatMap((p) => p.celulas.map(([r, c]) => `${r},${c}`)) : []
  );

  return (
    <Svg
      viewBox={`0 0 ${W} ${H}`}
      // @ts-ignore
      width={W}
      height={H}
    >
      {grid.map((linha, r) =>
        linha.map((letra, c) => {
          const x = c * tc;
          const y = r * tc;
          const isWord = wordCells.has(`${r},${c}`);
          return (
            <G key={`${r}-${c}`}>
              <Rect
                x={x} y={y}
                width={tc} height={tc}
                fill={isWord ? "#fde68a" : "white"}
                stroke="#94a3b8"
                strokeWidth={0.5}
              />
              <SvgText
                x={x + tc / 2}
                y={y + tc * 0.68}
                textAnchor="middle"
                fontSize={fs}
                fill={isWord ? "#78350f" : "#1e293b"}
                fontFamily="Helvetica-Bold"
              >
                {letra}
              </SvgText>
            </G>
          );
        })
      )}
    </Svg>
  );
}

function WordList({ colocadas }: { colocadas: CacaData["colocadas"] }) {
  return (
    <View style={s.wordList}>
      {colocadas.map(({ original }) => (
        <View key={original} style={s.wordPill}>
          <Text style={s.wordLabel}>{original.toUpperCase()}</Text>
        </View>
      ))}
    </View>
  );
}

function CacaDoc({ dados }: { dados: CacaData }) {
  const bncc = BNCC_CACA[dados.faixaEtaria] ?? "EF01LP07";

  return (
    <Document title={`Caça-palavras — ${dados.temaLabel}`} author="Aula Pronta IA">
      {/* Página do aluno */}
      <Page size="A4" style={s.page}>
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

        <Text style={s.titulo}>🔍 Caça-palavras — {dados.temaLabel}</Text>
        <Text style={s.subtitulo}>
          Encontre as {dados.colocadas.length} palavras escondidas na grade!
        </Text>

        <View style={s.gridArea}>
          <GridSVG dados={dados} gabarito={false} />
        </View>

        <WordList colocadas={dados.colocadas} />

        <View style={s.footer} fixed>
          <Text style={s.footerText}>BNCC {bncc}</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerPage}>1/2</Text>
        </View>
      </Page>

      {/* Gabarito */}
      <Page size="A4" style={s.page}>
        <Text style={s.gabarTitulo}>Gabarito — Caça-palavras {dados.temaLabel}</Text>

        <View style={s.gridArea}>
          <GridSVG dados={dados} gabarito={true} />
        </View>

        <WordList colocadas={dados.colocadas} />

        <View style={s.footer} fixed>
          <Text style={s.footerText}>BNCC {bncc}</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerPage}>2/2</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const dados = await req.json() as CacaData;
    const buffer = await renderToBuffer(<CacaDoc dados={dados} />);
    const uint8 = new Uint8Array(buffer);
    const slug = dados.tema.replace(/[^a-z]/gi, "-").toLowerCase();

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="caca-palavras-${slug}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[CACA-PDF]", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
