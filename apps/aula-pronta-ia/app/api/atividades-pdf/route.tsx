import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Svg, Circle, Ellipse, Line, Path, Polygon, Rect } from "@react-pdf/renderer";
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
  desenhoBoxInfantil: { borderWidth: 2, borderColor: "#f9a8d4", borderRadius: 12, borderStyle: "dashed", marginTop: 8, height: 220, alignItems: "center", justifyContent: "center", backgroundColor: "#fdf2f8" },
  desenhoText: { fontSize: 8, color: "#94a3b8" },
  desenhoTextInfantil: { fontSize: 9, color: "#db2777", textAlign: "center" },
  enunciadoInfantil: { fontSize: 13, color: "#1e293b", lineHeight: 1.7, marginBottom: 10, fontWeight: 700 },
  questaoNumInfantil: { backgroundColor: "#db2777", color: "#ffffff", fontSize: 10, fontWeight: 700, width: 24, height: 24, borderRadius: 12, textAlign: "center", paddingTop: 5 },
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

// ── Desenhos para colorir — Educação Infantil ─────────────────────────────────
const INK = "#2a2a2a";
const SW = "2.5";
const WF = "white";
const SZ = { width: 190, height: 160 };
const VB = "0 0 100 100";

function SolSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Circle cx={50} cy={52} r={22} fill={WF} stroke={INK} strokeWidth={SW} />
      <Line x1={50} y1={24} x2={50} y2={12} stroke={INK} strokeWidth={SW} />
      <Line x1={72} y1={30} x2={80} y2={22} stroke={INK} strokeWidth={SW} />
      <Line x1={79} y1={52} x2={91} y2={52} stroke={INK} strokeWidth={SW} />
      <Line x1={72} y1={74} x2={80} y2={82} stroke={INK} strokeWidth={SW} />
      <Line x1={50} y1={80} x2={50} y2={92} stroke={INK} strokeWidth={SW} />
      <Line x1={28} y1={74} x2={20} y2={82} stroke={INK} strokeWidth={SW} />
      <Line x1={21} y1={52} x2={9} y2={52} stroke={INK} strokeWidth={SW} />
      <Line x1={28} y1={30} x2={20} y2={22} stroke={INK} strokeWidth={SW} />
    </Svg>
  );
}

function NuvemSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Path d="M 10,78 L 10,64 C 8,44 22,36 36,42 C 40,28 56,20 70,30 C 76,22 90,26 90,46 C 98,50 96,66 88,72 L 88,78 Z" fill={WF} stroke={INK} strokeWidth={SW} />
    </Svg>
  );
}

function FlorSVG() {
  const petals = [{cx:70,cy:52},{cx:60,cy:69},{cx:40,cy:69},{cx:30,cy:52},{cx:40,cy:35},{cx:60,cy:35}];
  return (
    <Svg {...SZ} viewBox={VB}>
      {petals.map((p, i) => <Circle key={i} cx={p.cx} cy={p.cy} r={16} fill={WF} stroke={INK} strokeWidth={SW} />)}
      <Circle cx={50} cy={52} r={14} fill={WF} stroke={INK} strokeWidth={SW} />
    </Svg>
  );
}

function BorboletaSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Path d="M 50,46 C 38,30 6,22 8,42 C 10,60 32,66 50,58 Z" fill={WF} stroke={INK} strokeWidth={SW} />
      <Path d="M 50,46 C 62,30 94,22 92,42 C 90,60 68,66 50,58 Z" fill={WF} stroke={INK} strokeWidth={SW} />
      <Path d="M 50,60 C 36,70 12,68 16,80 C 20,90 38,84 50,68 Z" fill={WF} stroke={INK} strokeWidth={SW} />
      <Path d="M 50,60 C 64,70 88,68 84,80 C 80,90 62,84 50,68 Z" fill={WF} stroke={INK} strokeWidth={SW} />
      <Ellipse cx={50} cy={56} rx={5} ry={18} fill={WF} stroke={INK} strokeWidth={SW} />
      <Line x1={48} y1={40} x2={36} y2={22} stroke={INK} strokeWidth="1.5" />
      <Line x1={52} y1={40} x2={64} y2={22} stroke={INK} strokeWidth="1.5" />
      <Circle cx={34} cy={20} r={2.5} fill={INK} stroke="none" />
      <Circle cx={66} cy={20} r={2.5} fill={INK} stroke="none" />
    </Svg>
  );
}

function PeixeSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Polygon points="26,52 8,30 8,74" fill={WF} stroke={INK} strokeWidth={SW} />
      <Ellipse cx={58} cy={52} rx={32} ry={22} fill={WF} stroke={INK} strokeWidth={SW} />
      <Path d="M 48,30 C 54,18 68,18 70,30" fill={WF} stroke={INK} strokeWidth="1.5" />
      <Circle cx={78} cy={44} r={5} fill={WF} stroke={INK} strokeWidth={SW} />
      <Circle cx={79} cy={44} r={2} fill={INK} stroke="none" />
      <Path d="M 88,52 Q 92,58 88,62" fill="none" stroke={INK} strokeWidth="1.5" />
    </Svg>
  );
}

function CachorroSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Ellipse cx={32} cy={22} rx={10} ry={14} fill={WF} stroke={INK} strokeWidth={SW} />
      <Ellipse cx={68} cy={22} rx={10} ry={14} fill={WF} stroke={INK} strokeWidth={SW} />
      <Circle cx={50} cy={38} r={22} fill={WF} stroke={INK} strokeWidth={SW} />
      <Ellipse cx={50} cy={74} rx={26} ry={18} fill={WF} stroke={INK} strokeWidth={SW} />
      <Circle cx={42} cy={32} r={3.5} fill={INK} stroke="none" />
      <Circle cx={58} cy={32} r={3.5} fill={INK} stroke="none" />
      <Ellipse cx={50} cy={44} rx={6} ry={4} fill={INK} stroke="none" />
      <Line x1={50} y1={48} x2={44} y2={52} stroke={INK} strokeWidth="1.5" />
      <Line x1={50} y1={48} x2={56} y2={52} stroke={INK} strokeWidth="1.5" />
      <Path d="M 76,70 C 88,62 92,76 84,82" fill="none" stroke={INK} strokeWidth={SW} />
    </Svg>
  );
}

function GatoSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Ellipse cx={50} cy={74} rx={22} ry={17} fill={WF} stroke={INK} strokeWidth={SW} />
      <Circle cx={50} cy={42} r={24} fill={WF} stroke={INK} strokeWidth={SW} />
      <Polygon points="28,26 24,6 44,24" fill={WF} stroke={INK} strokeWidth={SW} />
      <Polygon points="56,24 76,6 72,26" fill={WF} stroke={INK} strokeWidth={SW} />
      <Circle cx={41} cy={36} r={4} fill={INK} stroke="none" />
      <Circle cx={59} cy={36} r={4} fill={INK} stroke="none" />
      <Polygon points="50,46 46,50 54,50" fill={INK} stroke="none" />
      <Line x1={28} y1={44} x2={44} y2={47} stroke={INK} strokeWidth="1.5" />
      <Line x1={28} y1={50} x2={44} y2={50} stroke={INK} strokeWidth="1.5" />
      <Line x1={56} y1={47} x2={72} y2={44} stroke={INK} strokeWidth="1.5" />
      <Line x1={56} y1={50} x2={72} y2={50} stroke={INK} strokeWidth="1.5" />
      <Path d="M 72,76 C 90,68 96,84 86,90 C 80,93 72,88 76,82" fill="none" stroke={INK} strokeWidth={SW} />
    </Svg>
  );
}

function CasaSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Rect x={18} y={50} width={64} height={42} fill={WF} stroke={INK} strokeWidth={SW} />
      <Polygon points="10,50 50,18 90,50" fill={WF} stroke={INK} strokeWidth={SW} />
      <Rect x={40} y={68} width={20} height={24} fill={WF} stroke={INK} strokeWidth="2" />
      <Rect x={22} y={56} width={16} height={14} fill={WF} stroke={INK} strokeWidth="2" />
      <Rect x={62} y={56} width={16} height={14} fill={WF} stroke={INK} strokeWidth="2" />
      <Line x1={30} y1={56} x2={30} y2={70} stroke={INK} strokeWidth="1.5" />
      <Line x1={22} y1={63} x2={38} y2={63} stroke={INK} strokeWidth="1.5" />
      <Line x1={70} y1={56} x2={70} y2={70} stroke={INK} strokeWidth="1.5" />
      <Line x1={62} y1={63} x2={78} y2={63} stroke={INK} strokeWidth="1.5" />
    </Svg>
  );
}

function ArvoreSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Circle cx={50} cy={44} r={36} fill={WF} stroke={INK} strokeWidth={SW} />
      <Rect x={42} y={78} width={16} height={18} fill={WF} stroke={INK} strokeWidth={SW} />
    </Svg>
  );
}

function EstrelaSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Polygon points="50,12 61,39 88,40 68,60 74,84 50,70 26,84 32,60 12,40 39,39" fill={WF} stroke={INK} strokeWidth={SW} />
    </Svg>
  );
}

function MacaSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Circle cx={50} cy={60} r={32} fill={WF} stroke={INK} strokeWidth={SW} />
      <Line x1={50} y1={28} x2={54} y2={14} stroke={INK} strokeWidth="3" />
      <Path d="M 54,22 C 62,10 82,14 78,28 C 72,36 58,30 54,22 Z" fill={WF} stroke={INK} strokeWidth="2" />
      <Line x1={54} y1={22} x2={76} y2={26} stroke={INK} strokeWidth="1" />
    </Svg>
  );
}

function CoracaoSVG() {
  return (
    <Svg {...SZ} viewBox={VB}>
      <Path d="M 50,80 C 8,60 4,28 22,18 C 32,12 44,18 50,30 C 56,18 68,12 78,18 C 96,28 92,60 50,80 Z" fill={WF} stroke={INK} strokeWidth={SW} />
    </Svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DESENHO_SVGS: Record<string, () => any> = {
  sol: SolSVG, nuvem: NuvemSVG, flor: FlorSVG, borboleta: BorboletaSVG,
  peixe: PeixeSVG, cachorro: CachorroSVG, gato: GatoSVG, casa: CasaSVG,
  arvore: ArvoreSVG, estrela: EstrelaSVG, maca: MacaSVG, coracao: CoracaoSVG,
};

function limpar(raw?: string): string {
  if (!raw) return "";
  return raw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
}

// Fallback: detecta o objeto pelo texto do enunciado quando IA não retornou objeto_desenho
function detectarPorEnunciado(enunciado: string): string {
  const t = limpar(enunciado);
  const pares: [string, string][] = [
    ["sol", "sol"], ["nuvem", "nuvem"], ["flor", "flor"],
    ["borboleta", "borboleta"], ["peixinho", "peixe"], ["peixe", "peixe"],
    ["cachorro", "cachorro"], ["cao", "cachorro"],
    ["gato", "gato"], ["casa", "casa"],
    ["arvore", "arvore"], ["estrela", "estrela"],
    ["coracao", "coracao"], ["maca", "maca"], ["fruta", "maca"],
  ];
  for (const [kw, obj] of pares) {
    if (t.includes(kw)) return obj;
  }
  // Último recurso: primeira palavra que casar com a lista de objetos
  for (const palavra of t.split(" ")) {
    if (DESENHO_SVGS[palavra]) return palavra;
  }
  return "";
}

function DesenhoColorir({ objeto, enunciado }: { objeto?: string; enunciado?: string }) {
  const key = limpar(objeto) || detectarPorEnunciado(enunciado || "");
  const DrawFn = DESENHO_SVGS[key];
  if (!DrawFn) {
    // último fallback: usa sol se nada foi detectado (melhor que caixa vazia)
    const FallbackFn = DESENHO_SVGS["sol"];
    return (
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <FallbackFn />
        <Text style={{ fontSize: 8, color: "#db2777", marginTop: 4 }}>
          Pinte com suas cores favoritas!
        </Text>
      </View>
    );
  }
  return (
    <View style={{ alignItems: "center", marginTop: 8 }}>
      <DrawFn />
      <Text style={{ fontSize: 8, color: "#db2777", marginTop: 4 }}>
        Pinte com suas cores favoritas!
      </Text>
    </View>
  );
}

function AtividadesPDF({ atividades, modo }: { atividades: AtividadesGeradas; modo: "professor" | "aluno" }) {
  const isProf = modo === "professor";
  const isInfantil = atividades.serie.toLowerCase().includes("infantil");

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
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Text style={isInfantil ? s.questaoNumInfantil : isProf ? s.questaoNum : s.questaoNumAluno}>{q.numero}</Text>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Text style={[s.tipoTag, (tipoCor[q.tipo] ?? {}) as any]}>{tipoLabel[q.tipo] ?? q.tipo}</Text>
              </View>
              <View style={s.questaoBody}>
                <Text style={isInfantil ? s.enunciadoInfantil : s.enunciado}>{e(q.enunciado)}</Text>

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
                  isInfantil ? (
                    <DesenhoColorir objeto={q.objeto_desenho} enunciado={q.enunciado} />
                  ) : (
                    <View style={s.desenhoBox}>
                      <Text style={s.desenhoText}>Espaco para desenhar e colorir</Text>
                    </View>
                  )
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
