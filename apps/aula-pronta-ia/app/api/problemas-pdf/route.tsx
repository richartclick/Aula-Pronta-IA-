import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";

export const maxDuration = 60;

const BNCC = "EF01MA10 · EF02MA06 · EF03MA07 — Resolução de problemas com as quatro operações";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Problema {
  enunciado: string;
  dados: string[];
  operacao: string;
  resposta: string;
  emoji: string;
}

// ── AI ────────────────────────────────────────────────────────────────────────

function extrairJSON(text: string): Problema[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("JSON não encontrado");
  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("Resposta inválida");
  return parsed.filter(
    (x): x is Problema =>
      typeof x?.enunciado === "string" &&
      Array.isArray(x?.dados) &&
      typeof x?.operacao === "string" &&
      typeof x?.resposta === "string" &&
      typeof x?.emoji === "string"
  );
}

async function gerarProblemas(
  ano: string,
  operacao: string,
  tema: string,
  qtd: number
): Promise<Problema[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("API key não configurada");

  const prompt = `Você é professor de matemática para o ensino fundamental I brasileiro.
Gere exatamente ${qtd} problemas matemáticos para alunos do ${ano} ano, tema "${tema}", operação: ${operacao}.

Regras obrigatórias:
- Enunciado contextualizado, interessante, 2-3 frases, linguagem da criança brasileira
- Números adequados ao ${ano} ano (sem resultados fracionados)
- Para divisão: o dividendo deve ser divisível exatamente (sem resto)
- Cada problema deve ser diferente e criativo
- Dados: liste apenas os valores numéricos relevantes do problema (2-3 itens no máximo)
- Operação: escreva a conta completa (ex: "8 + 5 = 13" ou "24 ÷ 4 = 6")
- Resposta: escreva o resultado com unidade (ex: "13 frutas" ou "6 grupos")
- Emoji: um único emoji representando o tema do problema

Retorne APENAS o JSON sem texto extra:
[{"enunciado":"A Maria foi ao mercado e comprou 8 maçãs vermelhas e 5 bananas amarelas. Quantas frutas ela comprou ao todo?","dados":["8 maçãs","5 bananas"],"operacao":"8 + 5 = 13","resposta":"13 frutas","emoji":"🍎"}]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const data = (await res.json()) as { content: Array<{ text: string }> };
  return extrairJSON(data.content?.[0]?.text ?? "");
}

// ── PDF Components ────────────────────────────────────────────────────────────

const ACCENT = "#2563eb";

function WritingLines({ count, lineH = 20 }: { count: number; lineH?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            height: lineH,
            borderBottomWidth: 0.5,
            borderBottomColor: "#cbd5e1",
            marginBottom: 2,
          }}
        />
      ))}
    </View>
  );
}

function SectionBox({
  label,
  color,
  children,
  flex = 1,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
  flex?: number;
}) {
  return (
    <View
      style={{
        flex,
        borderWidth: 1,
        borderColor: color + "66",
        borderRadius: 6,
        overflow: "hidden",
        marginHorizontal: 2,
      }}
    >
      {/* Label strip */}
      <View
        style={{
          backgroundColor: color + "22",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderBottomWidth: 1,
          borderBottomColor: color + "44",
        }}
      >
        <Text
          style={{
            fontSize: 7.5,
            fontFamily: "Helvetica-Bold",
            color: color,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
      </View>
      {/* Content */}
      <View style={{ padding: 6, flex: 1 }}>{children}</View>
    </View>
  );
}

function ProblemaCard({
  problema,
  num,
  gabarito,
}: {
  problema: Problema;
  num: number;
  gabarito: boolean;
}) {
  return (
    <View
      style={{
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: ACCENT + "0d",
          borderBottomWidth: 1,
          borderBottomColor: "#e0e7ff",
        }}
      >
        <Text style={{ fontSize: 18, marginRight: 8 }}>{problema.emoji}</Text>
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Helvetica-Bold",
            color: "#1e3a8a",
            flex: 1,
          }}
        >
          {gabarito ? `Gabarito — Problema ${num}` : `Problema ${num}`}
        </Text>
      </View>

      {/* Enunciado */}
      <View
        style={{ paddingHorizontal: 12, paddingVertical: 10 }}
      >
        <Text
          style={{
            fontSize: 9.5,
            color: "#1e293b",
            lineHeight: 1.5,
            fontFamily: gabarito ? "Helvetica" : "Helvetica",
          }}
        >
          {problema.enunciado}
        </Text>
      </View>

      {/* 3 seções */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 8,
          paddingBottom: 10,
          minHeight: 72,
        }}
      >
        {/* DADOS */}
        <SectionBox label="DADOS" color="#0ea5e9" flex={1.1}>
          {gabarito ? (
            <View>
              {problema.dados.map((d, i) => (
                <Text
                  key={i}
                  style={{ fontSize: 8, color: "#0369a1", marginBottom: 2 }}
                >
                  • {d}
                </Text>
              ))}
            </View>
          ) : (
            <WritingLines count={3} lineH={16} />
          )}
        </SectionBox>

        {/* OPERAÇÃO */}
        <SectionBox label="OPERAÇÃO" color="#f59e0b" flex={1.2}>
          {gabarito ? (
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
                color: "#92400e",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              {problema.operacao}
            </Text>
          ) : (
            <WritingLines count={3} lineH={16} />
          )}
        </SectionBox>

        {/* RESPOSTA */}
        <SectionBox label="RESPOSTA" color="#10b981" flex={1}>
          {gabarito ? (
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
                color: "#065f46",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              {problema.resposta}
            </Text>
          ) : (
            <WritingLines count={3} lineH={16} />
          )}
        </SectionBox>
      </View>
    </View>
  );
}

// ── Page builder ──────────────────────────────────────────────────────────────

const PER_PAGE = 3;

function buildPages(
  problemas: Problema[],
  ano: string,
  operacao: string,
  tema: string,
  gabarito: boolean,
  startPage: number,
  totalPages: number
) {
  const groups: Problema[][] = [];
  for (let i = 0; i < problemas.length; i += PER_PAGE) {
    groups.push(problemas.slice(i, i + PER_PAGE));
  }

  return groups.map((group, pi) => {
    const pageNum = startPage + pi;
    return (
      <Page
        key={`${gabarito ? "g" : "s"}-${pi}`}
        size="A4"
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: 28,
          paddingTop: 18,
          paddingBottom: 28,
          fontFamily: "Helvetica",
        }}
      >
        {/* Cabeçalho */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottomWidth: 1.5,
            borderBottomColor: ACCENT,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Helvetica-Bold",
                color: "#1e293b",
                marginBottom: 2,
              }}
            >
              {gabarito ? "Gabarito — " : ""}Problemas Matemáticos
            </Text>
            <Text style={{ fontSize: 7.5, color: "#94a3b8" }}>
              {ano}º ano · {operacao} · Tema: {tema}
              {!gabarito &&
                " · Preencha os dados, escreva a operação e a resposta"}
            </Text>
          </View>

          {!gabarito && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 7, color: "#94a3b8", marginRight: 4 }}>
                Nome:
              </Text>
              <View
                style={{
                  width: 100,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#94a3b8",
                  height: 12,
                }}
              />
            </View>
          )}
        </View>

        {/* Problemas */}
        {group.map((p, i) => (
          <ProblemaCard
            key={i}
            problema={p}
            num={pi * PER_PAGE + i + 1}
            gabarito={gabarito}
          />
        ))}

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
          fixed
        >
          <Text style={{ fontSize: 6, color: "#cbd5e1" }}>{BNCC}</Text>
          <Text
            style={{
              fontSize: 6.5,
              color: ACCENT,
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
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      ano: string;
      operacao: string;
      tema: string;
      quantidade: number;
    };

    const {
      ano = "2",
      operacao = "Adição e subtração",
      tema = "Mercado",
      quantidade,
    } = body;
    const qtd = Math.min(Math.max(Number(quantidade) || 4, 2), 9);

    const problemas = await gerarProblemas(ano, operacao, tema, qtd);
    if (problemas.length === 0) {
      return NextResponse.json(
        { error: "Não foi possível gerar os problemas. Tente novamente." },
        { status: 422 }
      );
    }

    const studentPageCount = Math.ceil(qtd / PER_PAGE);
    const gabaritoPageCount = Math.ceil(qtd / PER_PAGE);
    const totalPages = studentPageCount + gabaritoPageCount;

    const studentPages = buildPages(
      problemas,
      ano,
      operacao,
      tema,
      false,
      1,
      totalPages
    );
    const gabaritoPages = buildPages(
      problemas,
      ano,
      operacao,
      tema,
      true,
      studentPageCount + 1,
      totalPages
    );

    const buffer = await renderToBuffer(
      <Document
        title={`Problemas Matemáticos — ${ano}º ano — Aula Pronta IA`}
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
        "Content-Disposition": `attachment; filename="problemas-matematicos-${ano}ano.pdf"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[PROBLEMAS-PDF]", err);
    const msg =
      err instanceof Error ? err.message : "Falha ao gerar o PDF.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
