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
  gerarQuadrados,
  SOMA_MAGICA,
  TAMANHO_N,
  PUZZLES_POR_PAGINA,
  CELL_SIZE,
  type MagicoTamanho,
  type MagicoDificuldade,
  type QuadradoData,
} from "@/lib/quadrado-magico/gerador";

export const maxDuration = 60;

const BNCC = "EF02MA06 · EF03MA04 — Raciocínio lógico-matemático e propriedades das operações";

const DIFIC_LABEL: Record<MagicoDificuldade, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

const DIFIC_COLOR: Record<MagicoDificuldade, string> = {
  facil: "#10b981",
  medio: "#f59e0b",
  dificil: "#ef4444",
};

// ── Componente de grade ───────────────────────────────────────────────────────

function MagicoGrid({
  puzzle,
  tamanho,
  gabarito,
}: {
  puzzle: QuadradoData;
  tamanho: MagicoTamanho;
  gabarito: boolean;
}) {
  const n = TAMANHO_N[tamanho];
  const cs = CELL_SIZE[tamanho];
  const fz = tamanho === "3x3" ? 18 : tamanho === "4x4" ? 14 : 11;
  const cor = DIFIC_COLOR[puzzle.dificuldade];

  const grade = gabarito ? puzzle.solucao.map((r) => r.map((v) => v as number | null)) : puzzle.grade;

  return (
    <View style={{ width: n * cs, alignSelf: "center" }}>
      {grade.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row" }}>
          {row.map((cell, ci) => {
            const isBlank = cell === null;
            const isGabarCell = gabarito && puzzle.grade[ri][ci] === null;
            return (
              <View
                key={ci}
                style={{
                  width: cs,
                  height: cs,
                  borderWidth: 1,
                  borderColor: "#334155",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isGabarCell ? "#dcfce7" : isBlank ? "#f8fafc" : "#ffffff",
                  margin: 0,
                  // double outer border effect
                  borderRightWidth: ci === n - 1 ? 2 : 1,
                  borderBottomWidth: ri === n - 1 ? 2 : 1,
                  borderLeftWidth: ci === 0 ? 2 : 1,
                  borderTopWidth: ri === 0 ? 2 : 1,
                }}
              >
                {!isBlank || gabarito ? (
                  <Text
                    style={{
                      fontSize: fz,
                      fontFamily: "Helvetica-Bold",
                      color: isGabarCell ? "#15803d" : "#1e293b",
                    }}
                  >
                    {cell ?? ""}
                  </Text>
                ) : (
                  // Empty cell placeholder
                  <View
                    style={{
                      width: cs * 0.55,
                      height: 1.5,
                      backgroundColor: "#cbd5e1",
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ── Card de puzzle ────────────────────────────────────────────────────────────

function PuzzleCard({
  puzzle,
  tamanho,
  gabarito,
}: {
  puzzle: QuadradoData;
  tamanho: MagicoTamanho;
  gabarito: boolean;
}) {
  const cor = DIFIC_COLOR[puzzle.dificuldade];
  const n = TAMANHO_N[tamanho];
  const cs = CELL_SIZE[tamanho];
  const gridPx = n * cs;

  return (
    <View
      style={{
        margin: 6,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 8,
        overflow: "hidden",
        flex: 1,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingVertical: 7,
          backgroundColor: "#f8fafc",
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
        }}
      >
        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#334155" }}>
          {gabarito ? `Gabarito — Puzzle ${puzzle.id}` : `Puzzle ${puzzle.id}`}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <View
            style={{
              backgroundColor: cor + "22",
              borderRadius: 4,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 7, color: cor, fontFamily: "Helvetica-Bold" }}>
              {DIFIC_LABEL[puzzle.dificuldade]}
            </Text>
          </View>
          <Text style={{ fontSize: 8, color: "#64748b" }}>
            Soma mágica ={" "}
            <Text style={{ fontFamily: "Helvetica-Bold", color: "#1e293b" }}>
              {puzzle.soma}
            </Text>
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={{ padding: 10 }}>
        {/* Instrução */}
        {!gabarito && (
          <Text
            style={{
              fontSize: 7,
              color: "#64748b",
              textAlign: "center",
              marginBottom: 8,
              width: gridPx + 20,
              alignSelf: "center",
            }}
          >
            Preencha as casas em branco para que toda linha, coluna e diagonal some{" "}
            <Text style={{ fontFamily: "Helvetica-Bold", color: "#1e293b" }}>
              {puzzle.soma}
            </Text>
          </Text>
        )}

        {/* Grade */}
        <MagicoGrid puzzle={puzzle} tamanho={tamanho} gabarito={gabarito} />

        {/* Números disponíveis */}
        {!gabarito && puzzle.numerosDisponiveis.length > 0 && (
          <View
            style={{
              marginTop: 8,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
              width: gridPx + 20,
              alignSelf: "center",
              backgroundColor: "#f1f5f9",
              borderRadius: 6,
              padding: 6,
            }}
          >
            <Text style={{ fontSize: 6.5, color: "#64748b", marginRight: 4, marginTop: 1 }}>
              Use:{" "}
            </Text>
            {puzzle.numerosDisponiveis.map((n, i) => (
              <View
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1,
                  borderColor: "#94a3b8",
                  borderRadius: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#475569" }}>
                  {n}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ── Rodapé fixo ───────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    fontFamily: "Helvetica",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 6, color: "#cbd5e1" },
  footerBrand: { fontSize: 6.5, color: "#8b5cf6", fontFamily: "Helvetica-Bold" },
  footerPage: { fontSize: 6, color: "#cbd5e1" },
});

// ── Páginas de puzzles ────────────────────────────────────────────────────────

function buildPuzzlePages(
  puzzles: QuadradoData[],
  tamanho: MagicoTamanho,
  dificuldade: MagicoDificuldade,
  gabarito: boolean,
  startPage: number,
  totalPages: number
) {
  const perPage = PUZZLES_POR_PAGINA[tamanho];
  const is2col = perPage >= 2;

  const groups: QuadradoData[][] = [];
  for (let i = 0; i < puzzles.length; i += perPage) {
    groups.push(puzzles.slice(i, i + perPage));
  }

  return groups.map((group, pi) => {
    const pageNum = startPage + pi;
    return (
      <Page key={`${gabarito ? "g" : "s"}-${pi}`} size="A4" style={s.page}>
        {/* Cabeçalho */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#e2e8f0",
          }}
        >
          <View>
            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1e293b" }}>
              {gabarito ? "Gabarito — " : ""}Quadrado Mágico {tamanho}
            </Text>
            <Text style={{ fontSize: 7, color: "#94a3b8", marginTop: 1 }}>
              {DIFIC_LABEL[dificuldade]} · Soma mágica = {SOMA_MAGICA[tamanho]} · {
                gabarito ? "Verifique as respostas dos alunos" : "Preencha para que todas as linhas, colunas e diagonais somem " + SOMA_MAGICA[tamanho]
              }
            </Text>
          </View>
          {!gabarito && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 7, color: "#64748b" }}>Nome:</Text>
              <View style={{ width: 100, borderBottomWidth: 0.5, borderBottomColor: "#94a3b8", height: 12 }} />
            </View>
          )}
        </View>

        {/* Grade de puzzles */}
        <View
          style={{
            flexDirection: is2col ? "row" : "column",
            flexWrap: is2col ? "wrap" : "nowrap",
            flex: 1,
          }}
        >
          {group.map((puzzle) => (
            <View
              key={puzzle.id}
              style={{ width: is2col ? "50%" : "100%" }}
            >
              <PuzzleCard puzzle={puzzle} tamanho={tamanho} gabarito={gabarito} />
            </View>
          ))}
        </View>

        {/* Rodapé */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>{BNCC}</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerPage}>{pageNum}/{totalPages}</Text>
        </View>
      </Page>
    );
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      tamanho: MagicoTamanho;
      dificuldade: MagicoDificuldade;
      quantidade: number;
    };

    const { tamanho = "3x3", dificuldade = "medio", quantidade } = body;
    const qtd = Math.min(Math.max(Number(quantidade) || 4, 1), 12);

    const puzzles = gerarQuadrados(tamanho, dificuldade, qtd);

    const perPage = PUZZLES_POR_PAGINA[tamanho];
    const studentPagesCount = Math.ceil(qtd / perPage);
    const gabaritoPagesCount = Math.ceil(qtd / perPage);
    const totalPages = studentPagesCount + gabaritoPagesCount;

    const studentPages = buildPuzzlePages(puzzles, tamanho, dificuldade, false, 1, totalPages);
    const gabaritoPages = buildPuzzlePages(puzzles, tamanho, dificuldade, true, studentPagesCount + 1, totalPages);

    const buffer = await renderToBuffer(
      <Document
        title={`Quadrado Mágico ${tamanho} — Aula Pronta IA`}
        author="Aula Pronta IA"
      >
        {[...studentPages, ...gabaritoPages]}
      </Document>
    );

    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quadrado-magico-${tamanho}-${dificuldade}.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[QUADRADO-MAGICO-PDF]", err);
    const msg = err instanceof Error ? err.message : "Falha ao gerar o PDF.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
