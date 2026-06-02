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
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BK5MZZHQRL" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BK5MZZHQRL');
        ` }} />
        {/* Pinterest Tag */}
        <script dangerouslySetInnerHTML={{ __html: `
          !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
          pintrk('load', '2614036570742', {em: '<user_email_address>'});
          pintrk('page');
        ` }} />
        <noscript dangerouslySetInnerHTML={{ __html: `<img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?event=init&tid=2614036570742&pd[em]=<user_email_address>&noscript=1" />` }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
