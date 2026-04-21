import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AulaCompleta } from "@/app/actions/gerar-aula";

const colors = {
  primary: "#2563eb",
  primaryDark: "#1e40af",
  indigo: "#4f46e5",
  emerald: "#059669",
  orange: "#ea580c",
  purple: "#7c3aed",
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate900: "#0f172a",
  white: "#ffffff",
};

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", backgroundColor: colors.white, paddingBottom: 50 },

  // Header
  header: { backgroundColor: colors.primary, padding: "28 32 24 32" },
  headerTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 },
  badge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: colors.white, fontSize: 8, fontWeight: 700, letterSpacing: 0.5 },
  titulo: { color: colors.white, fontSize: 20, fontWeight: 700, lineHeight: 1.3, flex: 1, marginRight: 12 },
  headerMeta: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 10 },
  metaTag: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  metaTagText: { color: colors.white, fontSize: 9, fontWeight: 700 },

  // Gerado por
  poweredBy: { backgroundColor: colors.indigo, paddingHorizontal: 32, paddingVertical: 8, flexDirection: "row", justifyContent: "space-between" },
  poweredByText: { color: "rgba(255,255,255,0.75)", fontSize: 8 },

  // Body
  body: { padding: "20 32" },

  // Seções
  section: { marginBottom: 14 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1.5, borderBottomColor: colors.slate100 },
  sectionIcon: { fontSize: 12, marginRight: 6 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: colors.slate900 },

  // Cards coloridos
  card: { borderRadius: 8, padding: "10 12", marginBottom: 6 },
  cardBlue: { backgroundColor: "#eff6ff" },
  cardPurple: { backgroundColor: "#f5f3ff" },
  cardIndigo: { backgroundColor: "#eef2ff" },
  cardOrange: { backgroundColor: "#fff7ed" },
  cardEmerald: { backgroundColor: "#ecfdf5" },
  cardSlate: { backgroundColor: colors.slate50 },
  cardYellow: { backgroundColor: "#fefce8" },

  // Texto
  bodyText: { fontSize: 9, color: colors.slate700, lineHeight: 1.6 },
  boldText: { fontSize: 9, fontWeight: 700, color: colors.slate900 },
  smallText: { fontSize: 8, color: colors.slate500, lineHeight: 1.5 },

  // Listas
  listItem: { flexDirection: "row", marginBottom: 5, alignItems: "flex-start" },
  listBullet: { fontSize: 9, color: colors.primary, fontWeight: 700, marginRight: 6, marginTop: 1 },
  listNum: { fontSize: 9, color: colors.white, fontWeight: 700, marginRight: 8, width: 18, height: 18, backgroundColor: colors.indigo, borderRadius: 9, textAlign: "center", paddingTop: 3 },
  listText: { fontSize: 9, color: colors.slate700, flex: 1, lineHeight: 1.5 },

  // Steps desenvolvimento
  stepCard: { backgroundColor: colors.slate50, borderRadius: 8, padding: "10 12", marginBottom: 8, borderLeftWidth: 3, borderLeftColor: colors.indigo },
  stepHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  stepTitle: { fontSize: 10, fontWeight: 700, color: colors.indigo },
  stepDuracao: { fontSize: 8, color: colors.slate500, backgroundColor: colors.slate200, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },

  // Atividades
  atividadeCard: { borderRadius: 8, padding: "10 12", marginBottom: 8, borderWidth: 1, borderColor: colors.slate200 },
  atividadeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  atividadeTitulo: { fontSize: 10, fontWeight: 700, color: colors.slate900 },
  tipoBadge: { fontSize: 7, fontWeight: 700, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tipoGrupo: { backgroundColor: "#dbeafe", color: colors.primary },
  tipoIndividual: { backgroundColor: colors.slate100, color: colors.slate600 },
  dica: { backgroundColor: "#fef9c3", borderRadius: 6, padding: "6 8", marginTop: 6 },
  dicaText: { fontSize: 8, color: "#92400e", lineHeight: 1.5 },

  // BNCC
  bnccTag: { backgroundColor: "#ede9fe", borderRadius: 6, padding: "4 8", marginBottom: 4 },
  bnccText: { fontSize: 8, color: colors.purple, fontWeight: 700 },

  // Grid 2 col
  row2: { flexDirection: "row", gap: 10 },
  col2: { flex: 1 },

  // Footer
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.slate50, borderTopWidth: 1, borderTopColor: colors.slate200, padding: "8 32", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 7.5, color: colors.slate400 },
  footerBrand: { fontSize: 7.5, color: colors.primary, fontWeight: 700 },
});

const e = (s: string) => s.replace(/[^\u0000-\u00FF]/g, "").trim();

function BulletItem({ children }: { children: string }) {
  return (
    <View style={s.listItem}>
      <Text style={s.listBullet}>+</Text>
      <Text style={s.listText}>{e(children)}</Text>
    </View>
  );
}

function NumItem({ n, children }: { n: number; children: string }) {
  return (
    <View style={s.listItem}>
      <Text style={s.listNum}>{n}</Text>
      <Text style={s.listText}>{e(children)}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{e(title)}</Text>
    </View>
  );
}

function AulaPDF({ aula, meta }: { aula: AulaCompleta; meta: { tema: string; serie: string; disciplina: string; duracao: string } }) {
  return (
    <Document title={e(aula.titulo)} author="Aula Pronta IA" subject="Plano de Aula">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.titulo}>{e(aula.titulo)}</Text>
            <View style={s.badge}><Text style={s.badgeText}>PLANO DE AULA</Text></View>
          </View>
          <View style={s.headerMeta}>
            <View style={s.metaTag}><Text style={s.metaTagText}>{e(meta.disciplina)}</Text></View>
            <View style={s.metaTag}><Text style={s.metaTagText}>{e(meta.serie)}</Text></View>
            <View style={s.metaTag}><Text style={s.metaTagText}>{e(meta.duracao)}</Text></View>
          </View>
        </View>

        <View style={s.poweredBy}>
          <Text style={s.poweredByText}>Gerado por Aula Pronta IA</Text>
          <Text style={s.poweredByText}>{new Date().toLocaleDateString("pt-BR")}</Text>
        </View>

        <View style={s.body}>
          <View style={[s.card, s.cardIndigo, { marginBottom: 14 }]}>
            <Text style={[s.boldText, { color: colors.indigo, marginBottom: 4 }]}>Pergunta norteadora</Text>
            <Text style={[s.bodyText, { color: colors.slate500 }]}>{e(aula.pergunta_norteadora)}</Text>
          </View>

          <View style={[s.row2, { marginBottom: 14 }]}>
            <View style={s.col2}>
              <SectionHeader title="Habilidades BNCC" />
              {aula.bncc.map((b, i) => (
                <View key={i} style={s.bnccTag}>
                  <Text style={s.bnccText}>{e(b)}</Text>
                </View>
              ))}
            </View>
            <View style={s.col2}>
              <SectionHeader title="Objetivos de aprendizagem" />
              {aula.objetivos.map((obj, i) => (
                <BulletItem key={i}>{obj}</BulletItem>
              ))}
            </View>
          </View>

          <View style={s.section}>
            <SectionHeader title="Contextualizacao" />
            <View style={[s.card, s.cardSlate]}>
              <Text style={s.bodyText}>{e(aula.contextualizacao)}</Text>
            </View>
          </View>

          <View style={s.section}>
            <SectionHeader title={`Introducao (${aula.introducao.duracao})`} />
            <View style={[s.card, s.cardPurple]}>
              <Text style={s.bodyText}>{e(aula.introducao.descricao)}</Text>
              <View style={s.dica}>
                <Text style={s.dicaText}>Dica: {e(aula.introducao.dica_professor)}</Text>
              </View>
            </View>
          </View>

          <View style={s.section}>
            <SectionHeader title="Desenvolvimento" />
            {aula.desenvolvimento.map((step, i) => (
              <View key={i} style={s.stepCard}>
                <View style={s.stepHeader}>
                  <Text style={s.stepTitle}>{i + 1}. {e(step.etapa)}</Text>
                  <Text style={s.stepDuracao}>{e(step.duracao)}</Text>
                </View>
                <Text style={[s.bodyText, { marginBottom: 6 }]}>{e(step.descricao)}</Text>
                {step.perguntas_mediacao.length > 0 && (
                  <View>
                    <Text style={[s.smallText, { fontWeight: 700, color: colors.indigo, marginBottom: 3 }]}>Perguntas de mediacao:</Text>
                    {step.perguntas_mediacao.map((p, j) => (
                      <View key={j} style={[s.listItem, { marginBottom: 2 }]}>
                        <Text style={[s.listBullet, { color: colors.indigo }]}>-</Text>
                        <Text style={[s.smallText, { flex: 1, color: colors.slate500 }]}>{e(p)}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {step.dica_professor && (
                  <View style={[s.dica, { marginTop: 4 }]}>
                    <Text style={s.dicaText}>Dica: {e(step.dica_professor)}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>{e(aula.titulo)}</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={[s.header, { padding: "16 32" }]}>
          <Text style={[s.titulo, { fontSize: 14 }]}>{e(aula.titulo)}</Text>
        </View>

        <View style={s.body}>
          <View style={s.section}>
            <SectionHeader title="Atividades" />
            {aula.atividades.map((at, i) => (
              <View key={i} style={s.atividadeCard}>
                <View style={s.atividadeHeader}>
                  <Text style={s.atividadeTitulo}>{e(at.titulo)}</Text>
                  <View style={[s.row2, { gap: 4 }]}>
                    <Text style={[s.tipoBadge, at.tipo === "grupo" ? s.tipoGrupo : s.tipoIndividual]}>
                      {at.tipo === "grupo" ? "Grupo" : "Individual"}
                    </Text>
                    <Text style={[s.tipoBadge, { backgroundColor: colors.slate100, color: colors.slate600 }]}>{e(at.duracao)}</Text>
                  </View>
                </View>
                <Text style={[s.bodyText, { marginBottom: 5 }]}>{e(at.descricao)}</Text>
                <View style={[s.card, { backgroundColor: "#f0fdf4", padding: "4 8", marginBottom: 4 }]}>
                  <Text style={[s.smallText, { color: colors.emerald, fontWeight: 700 }]}>Bloom: {e(at.objetivo_bloom)}</Text>
                </View>
                {at.diferenciacao && (
                  <View style={s.dica}>
                    <Text style={s.dicaText}>Diferenciacao: {e(at.diferenciacao)}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={s.section}>
            <SectionHeader title={`Fechamento (${aula.fechamento.duracao})`} />
            <View style={[s.card, s.cardEmerald]}>
              <Text style={[s.bodyText, { marginBottom: 6 }]}>{e(aula.fechamento.descricao)}</Text>
              {aula.fechamento.perguntas_reflexao.length > 0 && (
                <View>
                  <Text style={[s.smallText, { fontWeight: 700, color: colors.emerald, marginBottom: 3 }]}>Perguntas de reflexao:</Text>
                  {aula.fechamento.perguntas_reflexao.map((p, i) => (
                    <BulletItem key={i}>{p}</BulletItem>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={s.section}>
            <SectionHeader title="Avaliacao" />
            <View style={s.row2}>
              <View style={s.col2}>
                <View style={[s.card, s.cardBlue]}>
                  <Text style={[s.boldText, { color: colors.primary, marginBottom: 4 }]}>Formativa</Text>
                  <Text style={s.bodyText}>{e(aula.avaliacao.formativa)}</Text>
                </View>
              </View>
              <View style={s.col2}>
                <View style={[s.card, s.cardIndigo]}>
                  <Text style={[s.boldText, { color: colors.indigo, marginBottom: 4 }]}>Somativa</Text>
                  <Text style={s.bodyText}>{e(aula.avaliacao.somativa)}</Text>
                </View>
              </View>
            </View>
            <View style={[s.card, s.cardSlate, { marginTop: 6 }]}>
              <Text style={[s.boldText, { marginBottom: 4 }]}>Autoavaliacao do aluno</Text>
              <Text style={[s.bodyText, { color: colors.slate500 }]}>{e(aula.avaliacao.autoavaliacao)}</Text>
            </View>
          </View>

          <View style={s.row2}>
            <View style={s.col2}>
              <SectionHeader title="Materiais necessarios" />
              {aula.materiais.map((m, i) => (
                <NumItem key={i} n={i + 1}>{m}</NumItem>
              ))}
            </View>
            <View style={s.col2}>
              <SectionHeader title="Para casa" />
              <View style={[s.card, s.cardSlate]}>
                <Text style={s.bodyText}>{e(aula.para_casa)}</Text>
              </View>
            </View>
          </View>

          <View style={[s.section, { marginTop: 10 }]}>
            <SectionHeader title="Adaptacoes e Diferenciacao" />
            <View style={s.row2}>
              <View style={s.col2}>
                <View style={[s.card, s.cardBlue]}>
                  <Text style={[s.boldText, { color: colors.primary, marginBottom: 4 }]}>Inclusao</Text>
                  <Text style={s.bodyText}>{e(aula.adaptacoes.inclusao)}</Text>
                </View>
              </View>
              <View style={s.col2}>
                <View style={[s.card, { backgroundColor: "#fdf4ff" }]}>
                  <Text style={[s.boldText, { color: colors.purple, marginBottom: 4 }]}>Aceleracao</Text>
                  <Text style={s.bodyText}>{e(aula.adaptacoes.aceleracao)}</Text>
                </View>
              </View>
            </View>
            <View style={[s.card, s.cardEmerald, { marginTop: 6 }]}>
              <Text style={[s.boldText, { color: colors.emerald, marginBottom: 4 }]}>Recursos digitais</Text>
              <Text style={s.bodyText}>{e(aula.adaptacoes.recursos_digitais)}</Text>
            </View>
          </View>

          <View style={[s.card, s.cardYellow, { marginTop: 4 }]}>
            <Text style={[s.boldText, { color: "#92400e", marginBottom: 4 }]}>Interdisciplinaridade</Text>
            <Text style={[s.bodyText, { color: "#78350f" }]}>{e(aula.interdisciplinaridade)}</Text>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>{e(aula.titulo)}</Text>
          <Text style={s.footerBrand}>Aula Pronta IA</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { aula, meta }: { aula: AulaCompleta; meta: { tema: string; serie: string; disciplina: string; duracao: string } } = await req.json();

    const buffer = await renderToBuffer(<AulaPDF aula={aula} meta={meta} />);
    const uint8 = new Uint8Array(buffer);

    const filename = `aula-${meta.tema.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}.pdf`;

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    return NextResponse.json({ error: "Falha ao gerar PDF" }, { status: 500 });
  }
}
