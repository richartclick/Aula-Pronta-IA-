import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

export const maxDuration = 60;

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 28,
    fontFamily: "Helvetica",
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: "1.5px solid #e2e8f0",
  },
  campoNome: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 20,
  },
  campoLabel: { fontSize: 9, color: "#64748b" },
  campoLinha: { flex: 1, borderBottom: "1px solid #94a3b8", height: 14 },
  campoData: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 100,
  },
  imagemWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagem: {
    width: 500,
    height: 500,
    objectFit: "contain",
  },
  rodape: {
    position: "absolute",
    bottom: 18,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rodapeTexto: { fontSize: 7.5, color: "#94a3b8" },
  rodapeMarca: { fontSize: 7.5, color: "#ec4899", fontWeight: 700 },
});

function DesenhosPDF({
  imagens,
  titulo,
  faixaEtaria,
  bncc,
}: {
  imagens: string[];
  titulo: string;
  faixaEtaria: string;
  bncc?: string;
}) {
  return (
    <Document title={titulo} author="Aula Pronta IA">
      {imagens.map((url, i) => (
        <Page key={i} size="A4" style={s.page}>
          {/* Cabeçalho com campos para o aluno */}
          <View style={s.cabecalho}>
            <View style={s.campoNome}>
              <Text style={s.campoLabel}>Nome:</Text>
              <View style={s.campoLinha} />
            </View>
            <View style={s.campoData}>
              <Text style={s.campoLabel}>Data:</Text>
              <View style={s.campoLinha} />
            </View>
          </View>

          {/* Desenho centralizado */}
          <View style={s.imagemWrap}>
            <Image src={url} style={s.imagem} />
          </View>

          {/* Rodapé */}
          <View style={s.rodape} fixed>
            <Text style={s.rodapeTexto}>Pinte com suas cores favoritas! · {faixaEtaria}</Text>
            <Text style={s.rodapeMarca}>Aula Pronta IA</Text>
            <Text
              style={s.rodapeTexto}
              render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            />
          </View>

          {/* BNCC */}
          {bncc && (
            <View style={{ position: "absolute", bottom: 32, left: 28, right: 28 }}>
              <Text style={{ fontSize: 6.5, color: "#94a3b8", textAlign: "center" }}>
                BNCC: {bncc}
              </Text>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const {
      imagens,
      titulo,
      faixaEtaria,
      bncc,
    }: { imagens: string[]; titulo: string; faixaEtaria: string; bncc?: string } = await req.json();

    if (!Array.isArray(imagens) || imagens.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem recebida." }, { status: 400 });
    }

    const buffer = await renderToBuffer(
      <DesenhosPDF imagens={imagens} titulo={titulo} faixaEtaria={faixaEtaria} bncc={bncc} />
    );

    const uint8 = new Uint8Array(buffer);
    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="desenhos-${slug}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[DESENHOS-PDF] Erro:", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
