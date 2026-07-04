import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { gerarSudoku, TAMANHOS, type SudokuData } from "@/lib/sudoku/gerador";

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
  titulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 4 },
  instrucao: { fontSize: 8.5, color: "#64748b", marginBottom: 20 },
  gabarTitulo: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#dc2626", marginBottom: 18 },
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

function SudokuGrid({ data, gabarito }: { data: SudokuData; gabarito: boolean }) {
  const { puzzle, solucao, tamanhoId } = data;
  const cfg = TAMANHOS[tamanhoId] ?? TAMANHOS["4x4"];
  const { size, boxRows, boxCols, cellSize, fontSize } = cfg;

  return (
    <View style={{ borderWidth: 2, borderColor: "#334155", alignSelf: "center" }}>
      {puzzle.map((row, i) => (
        <View key={i} style={{ flexDirection: "row" }}>
          {row.map((cell, j) => {
            const isEmpty = cell === 0;
            const displayVal = isEmpty && gabarito ? solucao[i][j] : cell;

            const borderRightWidth =
              j === size - 1 ? 0 : (j + 1) % boxCols === 0 ? 2 : 0.5;
            const borderBottomWidth =
              i === size - 1 ? 0 : (i + 1) % boxRows === 0 ? 2 : 0.5;

            return (
              <View
                key={j}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRightWidth,
                  borderBottomWidth,
                  borderColor: "#334155",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isEmpty && gabarito ? "#dcfce7" : "transparent",
                }}
              >
                {displayVal !== 0 && (
                  <Text
                    style={{
                      fontSize,
                      fontFamily: isEmpty ? "Helvetica" : "Helvetica-Bold",
                      color: isEmpty && gabarito ? "#15803d" : "#1e293b",
                    }}
                  >
                    {String(displayVal)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function StudentPage({
  data,
  puzzleNum,
  pageNum,
  totalPages,
}: {
  data: SudokuData;
  puzzleNum: number;
  pageNum: number;
  totalPages: number;
}) {
  const cfg = TAMANHOS[data.tamanhoId] ?? TAMANHOS["4x4"];
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

      <Text style={s.titulo}>🔢 Sudoku {cfg.label} — Puzzle {puzzleNum}</Text>
      <Text style={s.instrucao}>
        Preencha os espaços vazios com os números {cfg.instrNumeros}.{"\n"}
        Não repita o mesmo número na mesma linha, coluna ou quadrado destacado.
      </Text>

      <SudokuGrid data={data} gabarito={false} />

      <View style={s.footer} fixed>
        <Text style={s.footerText}>{cfg.bncc}</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text style={s.footerPage}>{pageNum}/{totalPages}</Text>
      </View>
    </Page>
  );
}

function GabaritoPage({
  data,
  puzzleNum,
  pageNum,
  totalPages,
}: {
  data: SudokuData;
  puzzleNum: number;
  pageNum: number;
  totalPages: number;
}) {
  const cfg = TAMANHOS[data.tamanhoId] ?? TAMANHOS["4x4"];
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.gabarTitulo}>
        Gabarito — Sudoku {cfg.label} (Puzzle {puzzleNum})
      </Text>

      <SudokuGrid data={data} gabarito={true} />

      <View style={s.footer} fixed>
        <Text style={s.footerText}>{cfg.bncc}</Text>
        <Text style={s.footerBrand}>Aula Pronta IA</Text>
        <Text style={s.footerPage}>{pageNum}/{totalPages}</Text>
      </View>
    </Page>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { tamanhoId, quantidade } = (await req.json()) as {
      tamanhoId: string;
      quantidade: number;
    };

    const qtd = Math.min(Math.max(Number(quantidade) || 1, 1), 3);
    const cfg = TAMANHOS[tamanhoId] ?? TAMANHOS["4x4"];

    const puzzles: SudokuData[] = Array.from({ length: qtd }, () =>
      gerarSudoku(tamanhoId)
    );

    const totalPages = qtd * 2;

    const buffer = await renderToBuffer(
      <Document
        title={`Sudoku ${cfg.label} — Aula Pronta IA`}
        author="Aula Pronta IA"
      >
        {puzzles.map((data, i) => [
          <StudentPage
            key={`s${i}`}
            data={data}
            puzzleNum={i + 1}
            pageNum={i + 1}
            totalPages={totalPages}
          />,
          <GabaritoPage
            key={`g${i}`}
            data={data}
            puzzleNum={i + 1}
            pageNum={qtd + i + 1}
            totalPages={totalPages}
          />,
        ])}
      </Document>
    );

    const uint8 = new Uint8Array(buffer);
    const filename = `sudoku-${tamanhoId}-${qtd}puzzle${qtd > 1 ? "s" : ""}.pdf`;

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[SUDOKU-PDF]", err);
    return NextResponse.json({ error: "Falha ao gerar o PDF." }, { status: 500 });
  }
}
