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
  gerarBingo,
  type BingoTipo,
  type GridSize,
  CARDS_PER_PAGE,
  CARD_COLS,
  CELL_CONFIG,
  type Cartela,
  type ChamadaItem,
} from "@/lib/bingo/gerador";

export const maxDuration = 60;

// ── Cores das cartelas ──────────────────────────────────────────────────────

const CORES = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ef4444", // red
  "#ec4899", // pink
  "#0ea5e9", // sky
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
];

// ── Componentes de cartela ──────────────────────────────────────────────────

interface BingoCardProps {
  cartela: Cartela;
  gridSize: GridSize;
}

function BingoCard({ cartela, gridSize }: BingoCardProps) {
  const { w, h, fz } = CELL_CONFIG[gridSize];
  const cor = CORES[(cartela.numero - 1) % CORES.length];

  return (
    <View
      style={{
        margin: 3,
        borderWidth: 1.5,
        borderColor: cor,
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Cabeçalho colorido */}
      <View
        style={{
          backgroundColor: cor,
          paddingHorizontal: 8,
          paddingVertical: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 8,
            fontFamily: "Helvetica-Bold",
            letterSpacing: 1,
          }}
        >
          BINGO
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 7,
            fontFamily: "Helvetica-Bold",
            backgroundColor: "rgba(255,255,255,0.25)",
            paddingHorizontal: 5,
            paddingVertical: 1,
            borderRadius: 4,
          }}
        >
          #{cartela.numero.toString().padStart(2, "0")}
        </Text>
      </View>

      {/* Linha de nome */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 7,
          paddingVertical: 4,
          borderBottomWidth: 0.5,
          borderBottomColor: "#e2e8f0",
        }}
      >
        <Text style={{ fontSize: 6, color: "#94a3b8", marginRight: 4 }}>
          Nome:
        </Text>
        <View
          style={{
            flex: 1,
            borderBottomWidth: 0.5,
            borderBottomColor: "#94a3b8",
            height: 10,
          }}
        />
      </View>

      {/* Grade */}
      <View style={{ padding: 4 }}>
        {cartela.grid.map((row, ri) => (
          <View key={ri} style={{ flexDirection: "row" }}>
            {row.map((cell, ci) => (
              <View
                key={ci}
                style={{
                  width: w,
                  height: h,
                  borderWidth: 0.5,
                  borderColor: cell.isLivre ? cor : "#cbd5e1",
                  borderRadius: cell.isLivre ? 4 : 2,
                  margin: 0.75,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: cell.isLivre ? cor + "20" : "#f8fafc",
                }}
              >
                <Text
                  style={{
                    fontSize: cell.isLivre ? 7 : fz,
                    fontFamily: "Helvetica-Bold",
                    color: cell.isLivre ? cor : "#1e293b",
                    textAlign: "center",
                  }}
                >
                  {cell.valor}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Páginas de cartelas ─────────────────────────────────────────────────────

function buildCardPages(
  cartelas: Cartela[],
  gridSize: GridSize,
  titulo: string,
  subtitulo: string,
  bncc: string,
  totalPages: number
) {
  const perPage = CARDS_PER_PAGE[gridSize];
  const cols = CARD_COLS[gridSize];
  const cardWidthPct = cols === 2 ? "50%" : "33.33%";

  const groups: Cartela[][] = [];
  for (let i = 0; i < cartelas.length; i += perPage) {
    groups.push(cartelas.slice(i, i + perPage));
  }

  return groups.map((group, pi) => (
    <Page
      key={`cards-${pi}`}
      size="A4"
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontFamily: "Helvetica",
      }}
    >
      {/* Cabeçalho da página (apenas primeira) */}
      {pi === 0 && (
        <View
          style={{
            marginBottom: 6,
            paddingBottom: 6,
            borderBottomWidth: 1,
            borderBottomColor: "#e2e8f0",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica-Bold",
                color: "#1e293b",
              }}
            >
              {titulo}
            </Text>
            <Text style={{ fontSize: 7, color: "#94a3b8" }}>{subtitulo}</Text>
          </View>
          <Text
            style={{
              fontSize: 6.5,
              color: "#94a3b8",
              textAlign: "right",
              maxWidth: 200,
            }}
          >
            {cartelas.length} cartelas únicas · Grade {gridSize}×{gridSize}
          </Text>
        </View>
      )}

      {/* Grade de cartelas */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
        {group.map((cartela) => (
          <View key={cartela.numero} style={{ width: cardWidthPct as never }}>
            <BingoCard cartela={cartela} gridSize={gridSize} />
          </View>
        ))}
      </View>

      {/* Rodapé */}
      <View
        style={{
          position: "absolute",
          bottom: 8,
          left: 14,
          right: 14,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        fixed
      >
        <Text style={{ fontSize: 6, color: "#cbd5e1" }}>{bncc}</Text>
        <Text
          style={{
            fontSize: 6.5,
            color: "#3b82f6",
            fontFamily: "Helvetica-Bold",
          }}
        >
          Aula Pronta IA
        </Text>
        <Text style={{ fontSize: 6, color: "#cbd5e1" }}>
          {pi + 1}/{totalPages}
        </Text>
      </View>
    </Page>
  ));
}

// ── Página de chamadas (professor) ──────────────────────────────────────────

function buildCallSheet(
  chamadas: ChamadaItem[],
  titulo: string,
  subtitulo: string,
  tipo: BingoTipo,
  pageNum: number,
  totalPages: number
) {
  const perCol = Math.ceil(chamadas.length / 3);
  const col1 = chamadas.slice(0, perCol);
  const col2 = chamadas.slice(perCol, perCol * 2);
  const col3 = chamadas.slice(perCol * 2);

  const renderCol = (items: ChamadaItem[]) => (
    <View style={{ flex: 1, paddingHorizontal: 5 }}>
      {items.map((item, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
            paddingBottom: 3,
            borderBottomWidth: 0.3,
            borderBottomColor: "#f1f5f9",
          }}
        >
          {/* Checkbox */}
          <View
            style={{
              width: 9,
              height: 9,
              borderWidth: 1,
              borderColor: "#94a3b8",
              borderRadius: 2,
              marginRight: 5,
              flexShrink: 0,
            }}
          />
          {/* Chamada */}
          <Text
            style={{
              fontSize: 9,
              fontFamily: "Helvetica-Bold",
              color: "#1e293b",
              flex: 1,
            }}
          >
            {item.chamada}
          </Text>
          {/* Resposta (para tabuada) */}
          {tipo === "tabuada" && (
            <Text
              style={{
                fontSize: 7.5,
                color: "#94a3b8",
                marginLeft: 4,
                width: 22,
                textAlign: "right",
              }}
            >
              ={item.resposta}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <Page
      key="callsheet"
      size="A4"
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 28,
        paddingTop: 20,
        paddingBottom: 30,
        fontFamily: "Helvetica",
      }}
    >
      {/* Cabeçalho */}
      <View
        style={{
          backgroundColor: "#1e293b",
          borderRadius: 8,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Helvetica-Bold",
            color: "#ffffff",
            marginBottom: 4,
          }}
        >
          Folha de Chamadas — Professor
        </Text>
        <Text style={{ fontSize: 9, color: "#94a3b8" }}>
          {titulo} · {subtitulo}
        </Text>
        <Text style={{ fontSize: 8, color: "#64748b", marginTop: 6 }}>
          {tipo === "tabuada"
            ? "Sorteie ou chame em ordem. O aluno deve encontrar o RESULTADO na cartela."
            : "Sorteie ou chame em ordem. O aluno deve marcar o número na cartela."}
          {" "}Verifique o número da cartela do vencedor para confirmar a vitória.
        </Text>
      </View>

      {/* Estatísticas */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {[
          { label: "Total de chamadas", valor: String(chamadas.length) },
          { label: "Cartelas geradas", valor: tipo === "tabuada" ? "ver PDF" : "ver PDF" },
          {
            label: tipo === "tabuada" ? "Dica" : "Dica",
            valor:
              tipo === "tabuada"
                ? "Chame a expressão; aluno risca o resultado"
                : "Chame o número; aluno risca na cartela",
          },
        ].map((s, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              backgroundColor: "#f8fafc",
              borderRadius: 6,
              padding: 8,
              borderWidth: 0.5,
              borderColor: "#e2e8f0",
            }}
          >
            <Text
              style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#334155" }}
            >
              {s.valor}
            </Text>
            <Text style={{ fontSize: 6.5, color: "#94a3b8", marginTop: 2 }}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* 3 colunas de chamadas */}
      <View style={{ flexDirection: "row" }}>
        {renderCol(col1)}
        <View
          style={{ width: 0.5, backgroundColor: "#e2e8f0", marginVertical: 4 }}
        />
        {renderCol(col2)}
        <View
          style={{ width: 0.5, backgroundColor: "#e2e8f0", marginVertical: 4 }}
        />
        {renderCol(col3)}
      </View>

      {/* Rodapé */}
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 28,
          right: 28,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 6.5, color: "#cbd5e1" }}>
          Use para verificar o ganhador — "Mostre sua cartela número X"
        </Text>
        <Text
          style={{
            fontSize: 6.5,
            color: "#3b82f6",
            fontFamily: "Helvetica-Bold",
          }}
        >
          Aula Pronta IA
        </Text>
        <Text style={{ fontSize: 6, color: "#cbd5e1" }}>
          {pageNum}/{totalPages}
        </Text>
      </View>
    </Page>
  );
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      tipo: BingoTipo;
      tabelas?: number[];
      rangeMax?: number;
      numCartelas: number;
    };

    const { tipo, tabelas = [2, 3, 4, 5], rangeMax = 25, numCartelas } = body;

    const data = gerarBingo(tipo, tabelas, rangeMax, Math.min(Math.max(numCartelas, 10), 40));

    const cardPageCount = Math.ceil(data.cartelas.length / CARDS_PER_PAGE[data.gridSize]);
    const totalPages = cardPageCount + 1; // +1 para folha de chamadas

    const cardPages = buildCardPages(
      data.cartelas,
      data.gridSize,
      data.titulo,
      data.subtitulo,
      data.bncc,
      totalPages
    );

    const callSheet = buildCallSheet(
      data.chamadas,
      data.titulo,
      data.subtitulo,
      data.tipo,
      totalPages,
      totalPages
    );

    const buffer = await renderToBuffer(
      <Document
        title={`${data.titulo} — Aula Pronta IA`}
        author="Aula Pronta IA"
      >
        {[...cardPages, callSheet]}
      </Document>
    );

    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="bingo-${tipo}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[BINGO-PDF]", err);
    const msg = err instanceof Error ? err.message : "Falha ao gerar o PDF.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
