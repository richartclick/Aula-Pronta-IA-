"use client";

import { useState } from "react";
import {
  CATEGORIAS,
  FAIXAS_ETARIAS,
  QUANTIDADES,
  type Categoria,
  type Quantidade,
} from "@/lib/desenhos/categorias";

type Etapa = "selecao" | "gerando" | "resultado";

export default function DesenhoClient() {
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [subcategoria, setSubcategoria] = useState<string>("");
  const [faixaEtaria, setFaixaEtaria] = useState<string>("");
  const [quantidade, setQuantidade] = useState<Quantidade>(4);
  const [etapa, setEtapa] = useState<Etapa>("selecao");
  const [imagens, setImagens] = useState<string[]>([]);
  const [erro, setErro] = useState<string>("");
  const [baixandoPDF, setBaixandoPDF] = useState(false);

  const categoriaAtual = CATEGORIAS.find((c) => c.id === categoriaId);
  const subcategoriaAtual = categoriaAtual?.subcategorias.find((s) => s.label === subcategoria);
  const faixaAtual = FAIXAS_ETARIAS.find((f) => f.value === faixaEtaria);
  const pronto = !!categoriaId && !!subcategoria && !!faixaEtaria;

  async function handleGerar() {
    if (!pronto) return;
    setEtapa("gerando");
    setErro("");

    try {
      const res = await fetch("/api/gerar-desenhos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria: categoriaId,
          subcategoria,
          promptEn: subcategoriaAtual?.promptEn,
          faixaEtaria,
          complexidade: faixaAtual?.complexidade,
          quantidade,
        }),
      });

      const data = await res.json();

      if (data.stub) {
        setErro("Configure a variável IDEOGRAM_API_KEY na Vercel para ativar a geração de desenhos.");
        setEtapa("selecao");
        return;
      }

      if (!res.ok || data.error) {
        setErro(data.error ?? "Erro ao gerar os desenhos. Tente novamente.");
        setEtapa("selecao");
        return;
      }

      setImagens(data.imagens);
      setEtapa("resultado");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setEtapa("selecao");
    }
  }

  async function handleBaixarPDF() {
    setBaixandoPDF(true);
    try {
      const res = await fetch("/api/desenhos-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagens,
          titulo: `${categoriaAtual?.label} — ${subcategoria}`,
          faixaEtaria: faixaAtual?.label ?? "",
        }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `desenhos-${subcategoria.toLowerCase().normalize("NFD").replace(/[^\w]/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setBaixandoPDF(false);
    }
  }

  if (etapa === "gerando") return <TelaGerando quantidade={quantidade} />;

  if (etapa === "resultado") {
    return (
      <TelaResultado
        imagens={imagens}
        titulo={`${categoriaAtual?.label} — ${subcategoria}`}
        faixaEtaria={faixaAtual?.label ?? ""}
        erro={erro}
        baixandoPDF={baixandoPDF}
        onNovo={() => { setEtapa("selecao"); setImagens([]); setErro(""); }}
        onBaixarPDF={handleBaixarPDF}
      />
    );
  }

  const dicaProgresso = !categoriaId
    ? "Escolha uma categoria para começar"
    : !subcategoria
    ? "Agora escolha o tema"
    : !faixaEtaria
    ? "Selecione a faixa etária"
    : `Pronto! ${quantidade} desenho${quantidade > 1 ? "s" : ""} de ${subcategoria}`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-32 lg:pb-8 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-5 lg:p-7 text-white shadow-xl shadow-pink-200">
        <div className="flex items-start gap-3 lg:gap-4">
          <div className="w-11 h-11 lg:w-14 lg:h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl lg:text-3xl shrink-0">
            🎨
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black leading-tight">Desenhos para Colorir</h1>
            <p className="text-pink-100 text-sm mt-1 leading-relaxed">
              Gere folhas de colorir prontas para impressão, personalizadas por faixa etária.
            </p>
          </div>
        </div>
      </div>

      {/* Passo 1 — Categoria */}
      <Passo numero={1} titulo="Escolha a categoria" concluido={!!categoriaId}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIAS.map((cat) => (
            <BotaoCategoria
              key={cat.id}
              categoria={cat}
              selecionado={categoriaId === cat.id}
              onClick={() => { setCategoriaId(cat.id); setSubcategoria(""); }}
            />
          ))}
        </div>
      </Passo>

      {/* Passo 2 — Subcategoria */}
      {categoriaAtual && (
        <Passo numero={2} titulo={`Escolha o tema — ${categoriaAtual.label}`} concluido={!!subcategoria}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoriaAtual.subcategorias.map((sub) => (
              <button
                key={sub.label}
                type="button"
                onClick={() => setSubcategoria(sub.label)}
                className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all text-left ${
                  subcategoria === sub.label
                    ? `${categoriaAtual.corBorda} bg-pink-50 shadow-md`
                    : "border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/40"
                }`}
              >
                <span className="text-xl shrink-0">{sub.emoji}</span>
                <span className={`text-sm font-semibold leading-tight ${subcategoria === sub.label ? categoriaAtual.corTexto : "text-slate-700"}`}>
                  {sub.label}
                </span>
              </button>
            ))}
          </div>
        </Passo>
      )}

      {/* Passo 3 — Faixa etária */}
      {subcategoria && (
        <Passo numero={3} titulo="Faixa etária" concluido={!!faixaEtaria}>
          <div className="grid sm:grid-cols-3 gap-3">
            {FAIXAS_ETARIAS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFaixaEtaria(f.value)}
                className={`flex flex-col p-4 rounded-xl border-2 transition-all text-left ${
                  faixaEtaria === f.value
                    ? "border-pink-500 bg-pink-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/40"
                }`}
              >
                <span className={`font-black text-base ${faixaEtaria === f.value ? "text-pink-700" : "text-slate-800"}`}>
                  {f.label}
                </span>
                <span className="text-xs text-slate-500 mt-1">{f.desc}</span>
              </button>
            ))}
          </div>
        </Passo>
      )}

      {/* Passo 4 — Quantidade */}
      {faixaEtaria && (
        <Passo numero={4} titulo="Quantidade de desenhos" concluido>
          <div className="grid grid-cols-4 gap-3">
            {QUANTIDADES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantidade(q)}
                className={`flex flex-col items-center gap-1 py-4 rounded-xl border-2 transition-all ${
                  quantidade === q
                    ? "border-pink-500 bg-pink-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/40"
                }`}
              >
                <span className={`font-black text-2xl ${quantidade === q ? "text-pink-600" : "text-slate-700"}`}>
                  {q}
                </span>
                <span className="text-xs text-slate-500">
                  {q === 1 ? "desenho" : "desenhos"}
                </span>
              </button>
            ))}
          </div>
        </Passo>
      )}

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-red-500 shrink-0 text-lg">⚠️</span>
          <p className="text-red-700 text-sm font-medium">{erro}</p>
        </div>
      )}

      {/* Botão gerar — sticky no mobile */}
      <div className="sticky bottom-24 lg:static -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 py-3 lg:py-0 bg-white lg:bg-transparent border-t border-slate-100 lg:border-0 shadow-lg lg:shadow-none">
        <button
          type="button"
          onClick={handleGerar}
          disabled={!pronto}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl text-lg transition-all shadow-xl shadow-pink-200 flex items-center justify-center gap-3"
        >
          🎨 Gerar desenhos
        </button>
        <p className="text-center text-slate-400 text-xs mt-2">{dicaProgresso}</p>
      </div>

    </div>
  );
}

/* ── Componentes auxiliares ──────────────────────────────────────────────── */

function Passo({
  numero,
  titulo,
  concluido,
  children,
}: {
  numero: number;
  titulo: string;
  concluido: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 lg:p-7 space-y-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 transition-colors ${
            concluido ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {concluido ? "✓" : numero}
        </div>
        <h2 className="font-bold text-slate-900 text-base">{titulo}</h2>
      </div>
      {children}
    </div>
  );
}

function BotaoCategoria({
  categoria,
  selecionado,
  onClick,
}: {
  categoria: Categoria;
  selecionado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
        selecionado
          ? `${categoria.corBorda} bg-pink-50 shadow-md`
          : "border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/40"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${categoria.gradiente} shadow-sm`}
      >
        {categoria.emoji}
      </div>
      <span className={`text-xs font-bold leading-tight ${selecionado ? categoria.corTexto : "text-slate-700"}`}>
        {categoria.label}
      </span>
    </button>
  );
}

function TelaGerando({ quantidade }: { quantidade: number }) {
  return (
    <div className="w-full max-w-lg mx-auto mt-16 text-center space-y-6 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl mx-auto flex items-center justify-center text-5xl animate-bounce">
        🎨
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-900">Criando seus desenhos...</h2>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          Gerando {quantidade} desenho{quantidade > 1 ? "s" : ""} de alta qualidade para colorir.
          <br />
          Isso pode levar alguns segundos.
        </p>
      </div>
      <div className="flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function TelaResultado({
  imagens,
  titulo,
  faixaEtaria,
  erro,
  baixandoPDF,
  onNovo,
  onBaixarPDF,
}: {
  imagens: string[];
  titulo: string;
  faixaEtaria: string;
  erro: string;
  baixandoPDF: boolean;
  onNovo: () => void;
  onBaixarPDF: () => void;
}) {
  const cols =
    imagens.length === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : imagens.length <= 4
      ? "grid-cols-2"
      : "grid-cols-2 lg:grid-cols-3";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">

      {/* Header sucesso */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 lg:p-7 text-white shadow-xl shadow-pink-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
            🎉
          </div>
          <div>
            <h1 className="text-2xl font-black">
              {imagens.length} desenho{imagens.length > 1 ? "s" : ""} pronto{imagens.length > 1 ? "s" : ""}!
            </h1>
            <p className="text-pink-100 text-sm mt-1">{titulo} · {faixaEtaria}</p>
          </div>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-red-500 shrink-0">⚠️</span>
          <p className="text-red-700 text-sm font-medium">{erro}</p>
        </div>
      )}

      {/* Ações */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={onBaixarPDF}
          disabled={baixandoPDF}
          className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
        >
          {baixandoPDF ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando PDF...
            </>
          ) : (
            "📥 Baixar PDF para impressão"
          )}
        </button>
        <button
          onClick={onNovo}
          className="bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          🎨 Gerar novos desenhos
        </button>
      </div>

      {/* Preview */}
      <div className={`grid gap-4 ${cols}`}>
        {imagens.map((url, i) => (
          <div
            key={i}
            className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm aspect-square"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Desenho ${i + 1}`}
              className="w-full h-full object-contain p-3"
            />
          </div>
        ))}
      </div>

      <p className="text-center text-slate-400 text-xs pb-4">
        Dica: imprima em papel A4 e distribua os lápis de cor antes da aula.
      </p>
    </div>
  );
}
