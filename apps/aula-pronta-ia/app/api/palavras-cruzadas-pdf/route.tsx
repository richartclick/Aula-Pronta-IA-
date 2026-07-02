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
import type { GridData, PalavraColocada } from "@/lib/palavras-cruzadas/gerador";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SvgText = Text as any;

export const maxDuration = 60;

const CELL = 28; // pt por célula

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
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1.5px solid #e2e8f0",
  },
  campoNome: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 20 },
  campoData: { flexDirection: "row", alignItems: "center", width: 110 },
  campoLabel: { fontSize: 8, color: "#64748b", marginRight: 4 },
  campoLinha: { flex: 1, borderBottom: "1px solid #94a3b8", height: 12 },
  titulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 2 },
  subtitulo: { fontSize: 8, color: "#94a3b8", marginBottom: 8 },
  gridArea: { alignItems: "center", marginBottom: 10 },
  pistasArea: { flexDirection: "row", gap: 16, marginTop: 4 },
  pistasCol: { flex: 1 },
  pistasHeader: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#475569", marginBottom: 4, textTransform: "uppercase" },
  pistaLinha: { fontSize: 7.5, color: "#334155", marginBottom: 2.5 },
  gabarTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#dc2626", textAlign: "center", marginBottom: 6 },
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
  footerPage: { fontSize: 6.5, color: "#94a3b8", textAlign: "right", width: 20 },
});

function GridSVG({
  grid,
  colocadas,
  limites,
  gabarito,
}: {
  grid: GridData["grid"];
  colocadas: PalavraColocada[];
  limites: GridData["limites"];
  gabarito: boolean;
}) {
  const { minLinha, maxLinha, minCol, maxCol } = limites;
  const rows = maxLinha - minLinha + 1;
  const cols = maxCol - minCol + 1;
  const W = cols * CELL;
  const H = rows * CELL;

  // Mapa de número por posição
  const numMap = new Map<string, number>();
  for (const w of colocadas) {
    numMap.set(`${w.linha},${w.coluna}`, w.numero);
  }

  return (
    <Svg
      viewBox={`0 0 ${W} ${H}`}
      // @ts-ignore
      width={W}
      height={H}
    >
      {Array.from({ length: rows }, (_, ri) =>
        Array.from({ length: cols }, (_, ci) => {
          const gridR = ri + minLinha;
          const gridC = ci + minCol;
          const cell = grid[gridR]?.[gridC];
          const ativa = cell?.letra !== null;
          const x = ci * CELL;
          const y = ri * CELL;
          const num = numMap.get(`${gridR},${gridC}`);

          if (!ativa) {
            return (
              <Rect key={`${ri}-${ci}`} x={x} y={y} width={CELL} height={CELL} fill="#1e293b" />
            );
          }

          return (
            <G key={`${ri}-${ci}`}>
              <Rect x={x} y={y} width={CELL} height={CELL} fill="white" stroke="#94a3b8" strokeWidth={0.5} />
              {/* Número no canto superior esquerdo */}
              {num !== undefined && (
                <SvgText x={x + 2} y={y + 7} fontSize={6} fill="#64748b" fontFamily="Helvetica">
                  {String(num)}
                </SvgText>
              )}
              {/* Letra (somente no gabarito) */}
              {gabarito && cell?.letra && (
                <SvgText
                  x={x + CELL / 2}
                  y={y + CELL * 0.68}
                  textAnchor="middle"
                  fontSize={13}
                  fill="#1e293b"
                  fontFamily="Helvetica-Bold"
                >
                  {cell.letra}
                </SvgText>
              )}
            </G>
          );
        })
      )}
    </Svg>
  );
}

function Pistas({
  colocadas,
}: {
  colocadas: PalavraColocada[];
}) {
  const horizontal = colocadas
    .filter((w) => w.direcao === "horizontal")
    .sort((a, b) => a.numero - b.numero);
  const vertical = colocadas
    .filter((w) => w.direcao === "vertical")
    .sort((a, b) => a.numero - b.numero);

  return (
    <View style={s.pistasArea}>
      <View style={s.pistasCol}>
        <Text style={s.pistasHeader}>→ Horizontal</Text>
        {horizontal.map((w) => (
          <Text key={w.numero} style={s.pistaLinha}>
            {w.numero}. {w.pista}
          </Text>
        ))}
      </View>
      <View style={s.pistasCol}>
        <Text style={s.pistasHeader}>↓ Vertical</Text>
        {vertical.map((w) => (
          <Text key={w.numero} style={s.pistaLinha}>
            {w.numero}. {w.pista}
          </Text>
        ))}
      </View>
    </View>
  );
}

function CruzadaDoc({ dados }: { dados: GridData & { temaLabel: string } }) {
  const { grid, colocadas, limites, temaLabel, faixaEtaria } = dados;

  return (
    <Document title={`Palavras Cruzadas — ${temaLabel}`} author="Aula Pronta IA">
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

        <Text style={s.titulo}>🔤 Palavras Cruzadas — {temaLabel}</Text>
        <Text style={s.subtitulo}>Complete o jogo usando as pistas abaixo · {faixaEtaria} anos</Text>

        <View style={s.gridArea}>
          <GridSVG grid={grid} colocadas={colocadas} limites={limites} gabarito={false} />
        </View>

        <Pistas colocadas={colocadas} />

        <View style={s.footer} fixed>
          <Text style={s.footerText}>BNCC EF01LP07 — Leitura e escrita de palavras</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerPage}>1/2</Text>
        </View>
      </Page>

      {/* Gabarito */}
      <Page size="A4" style={s.page}>
        <Text style={s.gabarTitle}>Gabarito — {temaLabel}</Text>

        <View style={s.gridArea}>
          <GridSVG grid={grid} colocadas={colocadas} limites={limites} gabarito={true} />
        </View>

        <Pistas colocadas={colocadas} />

        <View style={s.footer} fixed>
          <Text style={s.footerText}>BNCC EF01LP07 — Leitura e escrita de palavras</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerPage}>2/2</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const dados = await req.json() as GridData & { temaLabel: string };

    const buffer = await renderToBuffer(<CruzadaDoc dados={dados} />);
    const uint8 = new Uint8Array(buffer);
    const slug = dados.tema.replace(/[^a-z]/gi, "-").toLowerCase();

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cruzadinha-${slug}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[CRUZADAS-PDF] Erro:", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
