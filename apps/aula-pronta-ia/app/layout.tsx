import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Aula Pronta IA — Planejamento de aulas alinhado à BNCC em segundos",
  description: "Descreva sua aula e receba em segundos um plano completo com objetivos, atividades e avaliação — tudo alinhado à BNCC. Experimente grátis.",
  keywords: "planejamento de aulas, IA para professores, BNCC, plano de aula, inteligência artificial, educação brasileira",
  other: {
    "p:domain_verify": "50246d2d1f03073bdb3d6af3c1e14c4d",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,30..100;1,9..144,300..900,30..100&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
