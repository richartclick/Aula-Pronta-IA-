import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  gerarSequencias,
  FAIXAS_SEQ,
  type Sequencia,
  type FaixaSeqConfig,
} from "@/lib/sequencias/gerador";

export const maxDuration = 60;

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
  subtitulo: { fontSize: 8, color: "#94a3b8", marginBottom: 12 },
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

function SeqRow({
  seq,
  index,
  config,
  gabarito,
}: {
  seq: Sequencia;
  index: number;
  config: FaixaSeqConfig;
  gabarito: boolean;
}) {
  const { cellSize, fontSize } = config;
  const rowGap = Math.max(cellSize * 0.3, 8);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: rowGap,
      }}
    >
      {/* Número da questão */}
      <Text style={{ width: 18, fontSize: 8, color: "#64748b", fontFamily: "Helvetica-Bold" }}>
        {index + 1}.
      </Text>

      {/* Caixas */}
      {seq.numeros.map((n, j) => {
        const isBlank = n === null;
        const valor = isBlank ? (gabarito ? seq.gabarito[j] : null) : n;

        return (
          <View key={j} style={{ flexDirection: "row", alignItems: "center" }}>
            {j > 0 && (
              <Text style={{ fontSize: 8, color: "#94a3b8", marginHorizontal: 3 }}>→</Text>
            )}
            <View
              style={{
                width: cellSize,
                height: cellSize,
                borderWidth: 1.5,
                borderColor: isBlank ? "#334155" : "#cbd5e1",
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isBlank && gabarito ? "#dcfce7" : isBlank ? "white" : "#f8fafc",
              }}
            >
              {valor !== null && (
                <Text
                  style={{
                    fontSize: String(valor).length >= 4 ? Math.max(fontSize - 2, 5) : fontSize,
                    fontFamily: "Helvetica-Bold",
                    color: isBlank && gabarito ? "#15803d" : "#1e293b",
                  }}
                >
                  {String(valor)}
                </Text>
              )}
            </View>
          </View>
        );
      })}

      {/* Passo (apenas gabarito) */}
      {gabarito && (
        <Text style={{ fontSize: 7, color: "#94a3b8", marginLeft: 6 }}>
          (+{seq.passo})
        </Text>
      )}
    </View>
  );
}

function StudentPage({
  sequencias,
  config,
  pagNum,
  totalPags,
}: {
  sequencias: Sequencia[];
  config: FaixaSeqConfig;
  pagNum: number;
  totalPags: number;
}) {
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

      <Text style={s.titulo}>📊 Sequências Numéricas</Text>
      <Text style={s.subtitulo}>Complete os números que faltam em cada sequência.</Text>

      {sequencias.map((seq, i) => (
        <SeqRow key={i} seq={seq} index={i} config={config} gabarito={false} />
      ))}

      <View style={s.footer} fixed>
        <Text style={s.footerText}>BNCC {config.bncc}</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text style={s.footerPage}>{pagNum}/{totalPags}</Text>
      </View>
    </Page>
  );
}

function GabaritoPage({
  sequencias,
  config,
  pagNum,
  totalPags,
  folhaNum,
}: {
  sequencias: Sequencia[];
  config: FaixaSeqConfig;
  pagNum: number;
  totalPags: number;
  folhaNum: number;
}) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.gabarTitulo}>Gabarito — Sequências Numéricas (Folha {folhaNum})</Text>

      {sequencias.map((seq, i) => (
        <SeqRow key={i} seq={seq} index={i} config={config} gabarito={true} />
      ))}

      <View style={s.footer} fixed>
        <Text style={s.footerText}>BNCC {config.bncc}</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text style={s.footerPage}>{pagNum}/{totalPags}</Text>
      </View>
    </Page>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { faixaId, numPaginas } = await req.json() as {
      faixaId: string;
      numPaginas: number;
    };

    const qtd = Math.min(Math.max(Number(numPaginas) || 1, 1), 5);
    const config = FAIXAS_SEQ[faixaId] ?? FAIXAS_SEQ["6-8"];
    const { paginas } = gerarSequencias(faixaId, qtd);

    // Total pages: N student pages + N gabarito pages
    const totalPags = qtd * 2;

    const buffer = await renderToBuffer(
      <Document title="Sequências Numéricas" author="Aula Pronta IA">
        {paginas.map((seqs, i) => [
          <StudentPage
            key={`s${i}`}
            sequencias={seqs}
            config={config}
            pagNum={i + 1}
            totalPags={totalPags}
          />,
          <GabaritoPage
            key={`g${i}`}
            sequencias={seqs}
            config={config}
            pagNum={qtd + i + 1}
            totalPags={totalPags}
            folhaNum={i + 1}
          />,
        ])}
      </Document>
    );

    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sequencias-${faixaId}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[SEQUENCIAS-PDF]", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
