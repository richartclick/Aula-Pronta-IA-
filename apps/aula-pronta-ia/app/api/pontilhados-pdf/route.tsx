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
  Rect,
  Polygon,
} from "@react-pdf/renderer";
import { FORMAS, BNCC_PONT, type Forma } from "@/lib/pontilhados/formas";

export const maxDuration = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DotSvg = Svg as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DotCircle = Circle as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DotRect = Rect as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DotPolygon = Polygon as any;

const STROKE = "#334155";
const STROKE_W = 3;
const DASH = "6 5";
const START_COLOR = "#3b82f6";
const START_R = 4.5;

interface CellConfig {
  cellWidth: number;
  svgSize: number;
  instrFz: number;
  labelFz: number;
}

const CONFIGS: Record<string, CellConfig> = {
  grande: { cellWidth: 269.5, svgSize: 200, instrFz: 9, labelFz: 11 },
  compacto: { cellWidth: 269.5, svgSize: 108, instrFz: 7, labelFz: 9 },
};

function FormaShape({ forma, size }: { forma: Forma; size: number }) {
  return (
    <DotSvg width={size} height={size} viewBox="0 0 100 100">
      {forma.tipo === "circle" && (
        <DotCircle
          cx={forma.cx}
          cy={forma.cy}
          r={forma.r}
          fill="none"
          stroke={STROKE}
          strokeWidth={STROKE_W}
          strokeDasharray={DASH}
          strokeLinecap="round"
        />
      )}
      {forma.tipo === "rect" && (
        <DotRect
          x={forma.x}
          y={forma.y}
          width={forma.width}
          height={forma.height}
          fill="none"
          stroke={STROKE}
          strokeWidth={STROKE_W}
          strokeDasharray={DASH}
          strokeLinecap="round"
        />
      )}
      {forma.tipo === "polygon" && (
        <DotPolygon
          points={forma.points}
          fill="none"
          stroke={STROKE}
          strokeWidth={STROKE_W}
          strokeDasharray={DASH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {/* Blue start marker */}
      <DotCircle
        cx={forma.startX}
        cy={forma.startY}
        r={START_R}
        fill={START_COLOR}
        stroke="white"
        strokeWidth={1.5}
      />
    </DotSvg>
  );
}

function FormaCell({ forma, cfg }: { forma: Forma; cfg: CellConfig }) {
  return (
    <View style={{ width: cfg.cellWidth, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" }}>
      <Text style={{ fontSize: cfg.instrFz, color: "#64748b", marginBottom: 4, textAlign: "center" }}>
        Trace o contorno!
      </Text>
      <FormaShape forma={forma} size={cfg.svgSize} />
      <Text
        style={{
          fontSize: cfg.labelFz,
          fontFamily: "Helvetica-Bold",
          color: "#334155",
          marginTop: 5,
          textAlign: "center",
        }}
      >
        {forma.label}
      </Text>
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
  titulo: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 2 },
  subtitulo: { fontSize: 7.5, color: "#94a3b8", marginBottom: 8 },
  row: { flexDirection: "row" },
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

function ShapePage({
  formas,
  cfg,
  bncc,
  pageNum,
  totalPages,
}: {
  formas: Forma[];
  cfg: CellConfig;
  bncc: string;
  pageNum: number;
  totalPages: number;
}) {
  const pairs: Forma[][] = [];
  for (let i = 0; i < formas.length; i += 2) {
    pairs.push(formas.slice(i, i + 2));
  }

  return (
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

      <Text style={s.titulo}>✏️ Pontilhados — Trace as Formas</Text>
      <Text style={s.subtitulo}>
        Siga o pontilhado começando pelo ponto azul ●
      </Text>

      {pairs.map((pair, ri) => (
        <View key={ri} style={s.row}>
          {pair.map((f) => (
            <FormaCell key={f.id} forma={f} cfg={cfg} />
          ))}
        </View>
      ))}

      <View style={s.footer} fixed>
        <Text style={s.footerText}>{bncc}</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text style={s.footerPage}>{pageNum}/{totalPages}</Text>
      </View>
    </Page>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { formato } = (await req.json()) as { formato: "grande" | "compacto" };
    const fmt = formato === "grande" ? "grande" : "compacto";
    const cfg = CONFIGS[fmt];
    const bncc = BNCC_PONT[fmt];

    const pageGroups: Forma[][] =
      fmt === "grande"
        ? [FORMAS.slice(0, 4), FORMAS.slice(4, 8)]
        : [FORMAS];

    const totalPages = pageGroups.length;

    const buffer = await renderToBuffer(
      <Document title="Pontilhados — Aula Pronta IA" author="Aula Pronta IA">
        {pageGroups.map((formas, i) => (
          <ShapePage
            key={i}
            formas={formas}
            cfg={cfg}
            bncc={bncc}
            pageNum={i + 1}
            totalPages={totalPages}
          />
        ))}
      </Document>
    );

    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="pontilhados-${fmt}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[PONTILHADOS-PDF]", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
