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
  FAIXAS_CALIGRAFIA,
  LETRAS_MAIUSCULAS,
  LETRAS_MINUSCULAS,
  NUMEROS_CAL,
  type FaixaCaligrafia,
  type TipoCaligrafia,
} from "@/lib/caligrafia/tipos";

export const maxDuration = 60;

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 44,
    fontFamily: "Helvetica",
    flexDirection: "column",
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
  modeloArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "0.5px solid #f1f5f9",
  },
  modeloSubtitle: { fontSize: 8.5, color: "#94a3b8", marginBottom: 4 },
  secaoLabel: { fontSize: 8, color: "#94a3b8", marginBottom: 6, marginTop: 10 },
  footer: {
    position: "absolute",
    bottom: 16,
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

function topLine() {
  return <View style={{ height: 0, borderBottom: "0.75px dashed #cbd5e1" }} />;
}

function baseline() {
  return <View style={{ height: 0, borderBottom: "1.5px solid #94a3b8" }} />;
}

function LinhaTracado({
  letras,
  fontSize,
  cor = "#d1d5db",
}: {
  letras: string[];
  fontSize: number;
  cor?: string;
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      {topLine()}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-end",
          paddingTop: 4,
          paddingBottom: 2,
        }}
      >
        {letras.map((l, i) => (
          <Text
            key={i}
            style={{ fontSize, color: cor, fontFamily: "Helvetica-Bold" }}
          >
            {l}
          </Text>
        ))}
      </View>
      {baseline()}
    </View>
  );
}

function LinhaLivre({ altura }: { altura: number }) {
  return (
    <View style={{ marginBottom: 8 }}>
      {topLine()}
      <View style={{ height: altura }} />
      {baseline()}
    </View>
  );
}

function CaligrafiaPage({
  char,
  faixa,
  tipo,
}: {
  char: string;
  faixa: FaixaCaligrafia;
  tipo: TipoCaligrafia;
}) {
  const isAmbas = tipo === "ambas";
  const modeloChar = isAmbas ? `${char.toUpperCase()} ${char.toLowerCase()}` : char;

  // Monta array de letras por fileira
  function fileira(qtd: number): string[] {
    if (isAmbas) {
      return Array.from({ length: qtd }, (_, i) =>
        i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
      );
    }
    return Array.from({ length: qtd }, () => char);
  }

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

      {/* Modelo */}
      <View style={s.modeloArea}>
        <Text
          style={{
            fontSize: faixa.tamanhoModelo,
            color: "#1e293b",
            fontFamily: "Helvetica-Bold",
            lineHeight: 1,
          }}
        >
          {modeloChar}
        </Text>
        <View>
          <Text style={s.modeloSubtitle}>Observe o modelo</Text>
          <Text style={s.modeloSubtitle}>e trace as letras abaixo</Text>
        </View>
      </View>

      {/* Linhas de tracejo */}
      <Text style={s.secaoLabel}>Trace:</Text>
      {Array.from({ length: faixa.linhasTracado }, (_, i) => (
        <LinhaTracado key={i} letras={fileira(faixa.letrasFileira)} fontSize={faixa.tamanhoTracado} />
      ))}

      {/* Linhas livres */}
      <Text style={s.secaoLabel}>Escreva sozinho:</Text>
      {Array.from({ length: faixa.linhasLivres }, (_, i) => (
        <LinhaLivre key={i} altura={faixa.tamanhoTracado + 6} />
      ))}

      {/* Rodapé */}
      <View style={s.footer} fixed>
        <Text style={s.footerText}>{faixa.bncc}</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text
          style={s.footerPage}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
        />
      </View>
    </Page>
  );
}

function PalavraPage({
  palavra,
  faixa,
}: {
  palavra: string;
  faixa: FaixaCaligrafia;
}) {
  const len = palavra.length;
  const fs =
    len <= 4
      ? faixa.tamanhoTracado
      : len <= 8
      ? Math.round(faixa.tamanhoTracado * 0.72)
      : Math.round(faixa.tamanhoTracado * 0.52);

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

      <View style={s.modeloArea}>
        <Text style={{ fontSize: fs * 1.4, color: "#1e293b", fontFamily: "Helvetica-Bold", lineHeight: 1 }}>
          {palavra}
        </Text>
        <View>
          <Text style={s.modeloSubtitle}>Observe o modelo</Text>
          <Text style={s.modeloSubtitle}>e copie abaixo</Text>
        </View>
      </View>

      <Text style={s.secaoLabel}>Trace:</Text>
      {Array.from({ length: faixa.linhasTracado }, (_, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
          {topLine()}
          <View style={{ alignItems: "center", paddingTop: 4, paddingBottom: 2 }}>
            <Text style={{ fontSize: fs, color: "#d1d5db", fontFamily: "Helvetica-Bold" }}>
              {palavra}
            </Text>
          </View>
          {baseline()}
        </View>
      ))}

      <Text style={s.secaoLabel}>Escreva sozinho:</Text>
      {Array.from({ length: faixa.linhasLivres }, (_, i) => (
        <LinhaLivre key={i} altura={fs + 6} />
      ))}

      <View style={s.footer} fixed>
        <Text style={s.footerText}>{faixa.bncc}</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text
          style={s.footerPage}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
        />
      </View>
    </Page>
  );
}

function CaligrafiaDoc({
  tipo,
  faixa,
  chars,
  palavras,
}: {
  tipo: TipoCaligrafia;
  faixa: FaixaCaligrafia;
  chars: string[];
  palavras: string[];
}) {
  if (tipo === "palavras") {
    return (
      <Document title="Caligrafia — Palavras" author="Aula Pronta IA">
        {palavras.map((p, i) => (
          <PalavraPage key={i} palavra={p} faixa={faixa} />
        ))}
      </Document>
    );
  }

  return (
    <Document title="Caligrafia" author="Aula Pronta IA">
      {chars.map((c, i) => (
        <CaligrafiaPage key={i} char={c} faixa={faixa} tipo={tipo} />
      ))}
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { tipo, faixaEtaria, letras, palavras } = await req.json() as {
      tipo: TipoCaligrafia;
      faixaEtaria: string;
      letras?: string[];
      palavras?: string[];
    };

    const faixa = FAIXAS_CALIGRAFIA.find((f) => f.value === faixaEtaria);
    if (!faixa) {
      return NextResponse.json({ error: "Faixa etária inválida." }, { status: 400 });
    }

    let chars: string[] = [];
    if (tipo === "maiusculas") {
      chars = letras?.length ? letras : LETRAS_MAIUSCULAS;
    } else if (tipo === "minusculas") {
      chars = letras?.length ? letras.map((l) => l.toLowerCase()) : LETRAS_MINUSCULAS;
    } else if (tipo === "ambas") {
      // chars = uppercase letters; page renders both A and a
      chars = letras?.length ? letras.map((l) => l.toUpperCase()) : LETRAS_MAIUSCULAS;
    } else if (tipo === "numeros") {
      chars = letras?.length ? letras : NUMEROS_CAL;
    }

    const palavrasLista = tipo === "palavras"
      ? (palavras ?? []).map((p) => p.trim()).filter(Boolean)
      : [];

    if (tipo === "palavras" && palavrasLista.length === 0) {
      return NextResponse.json({ error: "Nenhuma palavra informada." }, { status: 400 });
    }
    if (tipo !== "palavras" && chars.length === 0) {
      return NextResponse.json({ error: "Nenhuma letra selecionada." }, { status: 400 });
    }

    const buffer = await renderToBuffer(
      <CaligrafiaDoc tipo={tipo} faixa={faixa} chars={chars} palavras={palavrasLista} />
    );

    const uint8 = new Uint8Array(buffer);
    const slug = tipo === "palavras" ? "palavras" : tipo;

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="caligrafia-${slug}-${faixaEtaria}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[CALIGRAFIA-PDF] Erro:", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
