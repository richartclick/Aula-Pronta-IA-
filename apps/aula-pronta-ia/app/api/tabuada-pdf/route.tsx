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
  gerarTabuada,
  tabelasLabel,
  TIPO_LABELS,
  type DesafioItem,
  type TipoDesafio,
} from "@/lib/tabuada/gerador";

export const maxDuration = 60;

const CELL_W = 30;
const RES_W = 40;
const CELL_H = 30;
const COL_W = 179;

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
  titulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 1 },
  subtitulo: { fontSize: 7.5, color: "#94a3b8", marginBottom: 10 },
  gabarTitulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#dc2626", marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  col: { width: COL_W, marginBottom: 9, alignItems: "center" },
  opText: { fontSize: 12, color: "#64748b", marginHorizontal: 5, fontFamily: "Helvetica-Bold" },
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

function NumBox({
  val,
  isBlank,
  gabarito,
  wide,
}: {
  val: number | null;
  isBlank: boolean;
  gabarito: boolean;
  wide?: boolean;
}) {
  const w = wide ? RES_W : CELL_W;
  const show = isBlank ? (gabarito ? val : null) : val;
  return (
    <View
      style={{
        width: w,
        height: CELL_H,
        borderWidth: isBlank ? 2 : 1,
        borderColor: isBlank ? "#334155" : "#cbd5e1",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isBlank && gabarito ? "#dcfce7" : isBlank ? "white" : "#f8fafc",
      }}
    >
      {show !== null && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: isBlank ? "Helvetica" : "Helvetica-Bold",
            color: isBlank && gabarito ? "#15803d" : "#1e293b",
          }}
        >
          {String(show)}
        </Text>
      )}
    </View>
  );
}

function DesafioCell({ item, gabarito }: { item: DesafioItem; gabarito: boolean }) {
  const f1 = item.blanked === "fator1" ? null : item.fator1;
  const f2 = item.blanked === "fator2" ? null : item.fator2;
  const res = item.blanked === "resultado" ? null : item.resultado;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <NumBox val={f1 ?? item.fator1} isBlank={item.blanked === "fator1"} gabarito={gabarito} />
      <Text style={s.opText}>×</Text>
      <NumBox val={f2 ?? item.fator2} isBlank={item.blanked === "fator2"} gabarito={gabarito} />
      <Text style={s.opText}>=</Text>
      <NumBox
        val={res ?? item.resultado}
        isBlank={item.blanked === "resultado"}
        gabarito={gabarito}
        wide
      />
    </View>
  );
}

function TabuadaPage({
  desafios,
  gabarito,
  subtituloTexto,
  pageNum,
  totalPages,
  folhaNum,
}: {
  desafios: DesafioItem[];
  gabarito: boolean;
  subtituloTexto: string;
  pageNum: number;
  totalPages: number;
  folhaNum: number;
}) {
  return (
    <Page size="A4" style={s.page}>
      {gabarito ? (
        <Text style={s.gabarTitulo}>
          Gabarito — Tabuada com Desafio (Folha {folhaNum})
        </Text>
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
          <Text style={s.titulo}>✖️ Tabuada com Desafio — Folha {folhaNum}</Text>
          <Text style={s.subtitulo}>{subtituloTexto}</Text>
        </>
      )}

      <View style={s.grid}>
        {desafios.map((item, i) => (
          <View key={i} style={s.col}>
            <DesafioCell item={item} gabarito={gabarito} />
          </View>
        ))}
      </View>

      <View style={s.footer} fixed>
        <Text style={s.footerText}>EF02MA04 — Multiplicação e raciocínio numérico · BNCC</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text style={s.footerPage}>{pageNum}/{totalPages}</Text>
      </View>
    </Page>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { tabelas, tipo, numPaginas } = (await req.json()) as {
      tabelas: number[];
      tipo: TipoDesafio;
      numPaginas: number;
    };

    const tbs = Array.isArray(tabelas) && tabelas.length > 0 ? tabelas : [2, 3, 4, 5];
    const t = (["resultado", "fator", "misto"].includes(tipo) ? tipo : "misto") as TipoDesafio;
    const np = Math.min(Math.max(Number(numPaginas) || 1, 1), 3);

    const { paginas } = gerarTabuada(tbs, t, np);

    const totalPages = np * 2;
    const subtitulo = `${tabelasLabel(tbs)} · ${TIPO_LABELS[t]} · Preencha os espaços em branco.`;

    const buffer = await renderToBuffer(
      <Document title="Tabuada com Desafio — Aula Pronta IA" author="Aula Pronta IA">
        {paginas.map((desafios, i) => [
          <TabuadaPage
            key={`s${i}`}
            desafios={desafios}
            gabarito={false}
            subtituloTexto={subtitulo}
            pageNum={i + 1}
            totalPages={totalPages}
            folhaNum={i + 1}
          />,
          <TabuadaPage
            key={`g${i}`}
            desafios={desafios}
            gabarito={true}
            subtituloTexto={subtitulo}
            pageNum={np + i + 1}
            totalPages={totalPages}
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
        "Content-Disposition": `attachment; filename="tabuada-desafio.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[TABUADA-PDF]", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
