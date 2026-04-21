import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AtividadesGeradas } from "@/app/actions/gerar-atividades";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", backgroundColor: "#ffffff", paddingBottom: 50 },
  header: { backgroundColor: "#2563eb", padding: "20 32 16 32" },
  headerAluno: { backgroundColor: "#059669", padding: "20 32 16 32" },
  headerTitle: { color: "#ffffff", fontSize: 16, fontWeight: 700, marginBottom: 4 },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 9 },
  headerBadge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start", marginTop: 6 },
  headerBadgeText: { color: "#ffffff", fontSize: 8, fontWeight: 700 },
  body: { padding: "16 32" },
  instrucoes: { backgroundColor: "#eff6ff", borderRadius: 8, padding: "8 12", marginBottom: 14 },
  instrucoesText: { fontSize: 8.5, color: "#1e40af", lineHeight: 1.5 },
  instrucoesProf: { backgroundColor: "#fef9c3", borderRadius: 8, padding: "8 12", marginBottom: 14 },
  instrucoesProfText: { fontSize: 8.5, color: "#92400e", lineHeight: 1.5 },
  questaoCard: { marginBottom: 14, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, overflow: "hidden" },
  questaoHeader: { backgroundColor: "#f8fafc", padding: "6 12", flexDirection: "row", alignItems: "center", gap: 8 },
  questaoNum: { backgroundColor: "#2563eb", color: "#ffffff", fontSize: 9, fontWeight: 700, width: 20, height: 20, borderRadius: 10, textAlign: "center", paddingTop: 4 },
  questaoNumAluno: { backgroundColor: "#059669", color: "#ffffff", fontSize: 9, fontWeight: 700, width: 20, height: 20, borderRadius: 10, textAlign: "center", paddingTop: 4 },
  tipoTag: { fontSize: 7, fontWeight: 700, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  questaoBody: { padding: "10 12" },
  enunciado: { fontSize: 10, color: "#1e293b", lineHeight: 1.6, marginBottom: 8, fontWeight: 700 },
  alternativa: { fontSize: 9, color: "#475569", lineHeight: 1.5, marginBottom: 3, paddingLeft: 8 },
  espacoLinha: { borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginBottom: 6, height: 18 },
  gabaritoBox: { backgroundColor: "#f0fdf4", borderRadius: 6, padding: "6 10", marginTop: 8 },
  gabaritoLabel: { fontSize: 7.5, fontWeight: 700, color: "#059669", marginBottom: 2 },
  gabaritoText: { fontSize: 9, color: "#166534", lineHeight: 1.5 },
  dicaBox: { backgroundColor: "#fefce8", borderRadius: 6, padding: "6 10", marginTop: 4 },
  dicaText: { fontSize: 8, color: "#92400e", lineHeight: 1.5 },
  campoNome: { flexDirection: "row", gap: 20, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 10 },
  campoLabel: { fontSize: 9, color: "#64748b" },
  campoLinha: { flex: 1, borderBottomWidth: 1, borderBottomColor: "#94a3b8", height: 16 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#f8fafc", borderTopWidth: 1, borderTopColor: "#e2e8f0", padding: "6 32", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 7.5, color: "#94a3b8" },
  footerBrand: { fontSize: 7.5, color: "#2563eb", fontWeight: 700 },
  desenhoBox: { borderWidth: 1.5, borderColor: "#cbd5e1", borderRadius: 8, borderStyle: "dashed", marginTop: 6, height: 120, alignItems: "center", justifyContent: "center" },
  desenhoText: { fontSize: 8, color: "#94a3b8" },
});

const e = (s: string) => (s ?? "").replace(/[^\u0000-\u00FF]/g, "").trim();

const tipoLabel: Record<string, string> = {
  dissertativa: "Dissertativa",
  multipla_escolha: "Multipla escolha",
  desenho: "Desenho / Colorir",
  completar: "Completar",
  verdadeiro_falso: "Verdadeiro ou Falso",
};

const tipoCor: Record<string, Record<string, string | number>> = {
  dissertativa: { backgroundColor: "#ede9fe", color: "#7c3aed" },
  multipla_escolha: { backgroundColor: "#dbeafe", color: "#1d4ed8" },
  desenho: { backgroundColor: "#fce7f3", color: "#be185d" },
  completar: { backgroundColor: "#dcfce7", color: "#166534" },
  verdadeiro_falso: { backgroundColor: "#fff7ed", color: "#c2410c" },
};

function AtividadesPDF({ atividades, modo }: { atividades: AtividadesGeradas; modo: "professor" | "aluno" }) {
  const isProf = modo === "professor";

  return (
    <Document title={e(atividades.titulo)} author="Aula Pronta IA">
      <Page size="A4" style={s.page}>
        <View style={isProf ? s.header : s.headerAluno}>
          <Text style={s.headerTitle}>{e(atividades.titulo)}</Text>
          <Text style={s.headerSub}>{e(atividades.disciplina)} - {e(atividades.serie)}</Text>
          <View style={s.headerBadge}>
            <Text style={s.headerBadgeText}>{isProf ? "VERSAO PROFESSOR - COM GABARITO" : "VERSAO ALUNO - PARA IMPRESSAO"}</Text>
          </View>
        </View>

        <View style={s.body}>
          {!isProf && (
            <View style={s.campoNome}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 2 }}>
                <Text style={s.campoLabel}>Nome:</Text>
                <View style={s.campoLinha} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
                <Text style={s.campoLabel}>Data:</Text>
                <View style={s.campoLinha} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
                <Text style={s.campoLabel}>Turma:</Text>
                <View style={s.campoLinha} />
              </View>
            </View>
          )}

          {isProf && (
            <View style={s.instrucoesProf}>
              <Text style={[s.instrucoesProfText, { fontWeight: 700, marginBottom: 3 }]}>Orientacoes para o professor:</Text>
              <Text style={s.instrucoesProfText}>{e(atividades.instrucoes_professor)}</Text>
            </View>
          )}

          {atividades.questoes.map((q) => (
            <View key={q.numero} style={s.questaoCard}>
              <View style={s.questaoHeader}>
                <Text style={isProf ? s.questaoNum : s.questaoNumAluno}>{q.numero}</Text>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Text style={[s.tipoTag, (tipoCor[q.tipo] ?? {}) as any]}>{tipoLabel[q.tipo] ?? q.tipo}</Text>
              </View>
              <View style={s.questaoBody}>
                <Text style={s.enunciado}>{e(q.enunciado)}</Text>

                {q.tipo === "multipla_escolha" && q.alternativas?.map((alt, i) => (
                  <Text key={i} style={s.alternativa}>{e(alt)}</Text>
                ))}

                {q.tipo === "verdadeiro_falso" && (
                  <View style={{ flexDirection: "row", gap: 16, marginBottom: 6 }}>
                    <Text style={[s.alternativa, { fontWeight: 700 }]}>( ) Verdadeiro</Text>
                    <Text style={[s.alternativa, { fontWeight: 700 }]}>( ) Falso</Text>
                  </View>
                )}

                {q.tipo === "desenho" && (
                  <View style={s.desenhoBox}>
                    <Text style={s.desenhoText}>Espaco para desenhar e colorir</Text>
                  </View>
                )}

                {(q.tipo === "dissertativa" || q.tipo === "completar") && (
                  <View style={{ marginTop: 4 }}>
                    {Array.from({ length: q.espaco_resposta_linhas }).map((_, i) => (
                      <View key={i} style={s.espacoLinha} />
                    ))}
                  </View>
                )}

                {isProf && (
                  <View style={s.gabaritoBox}>
                    <Text style={s.gabaritoLabel}>Gabarito:</Text>
                    <Text style={s.gabaritoText}>{e(q.resposta_gabarito)}</Text>
                  </View>
                )}
                {isProf && q.dica_professor && (
                  <View style={s.dicaBox}>
                    <Text style={s.dicaText}>Dica: {e(q.dica_professor)}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>{e(atividades.tema)} - {e(atividades.serie)}</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Pag. ${pageNumber}/${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { atividades, modo }: { atividades: AtividadesGeradas; modo: "professor" | "aluno" } = await req.json();
    const buffer = await renderToBuffer(<AtividadesPDF atividades={atividades} modo={modo} />);
    const uint8 = new Uint8Array(buffer);
    const filename = `atividades-${modo}-${atividades.tema.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}.pdf`;

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("Erro ao gerar PDF de atividades:", err);
    return NextResponse.json({ error: "Falha ao gerar PDF" }, { status: 500 });
  }
}
