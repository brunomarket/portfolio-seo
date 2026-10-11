import './globals.css'
import { Literata } from 'next/font/google'

// Fonte de conteúdo do livro (texto corrido das páginas). O next/font baixa o
// arquivo no build e auto-hospeda (sem requisições ao Google em runtime);
// a variável --font-content vira a utility `font-literata` no globals.css.
const literata = Literata({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-content',
})

// SEO: título e description com as palavras-chave reais do perfil
// (nome, cargo, SEO/GEO, Search Console). metadataBase evita avisos de URL
// relativa e habilita URLs absolutas no OpenGraph; o favicon é por convenção
// de arquivo (src/app/icon.svg → <link rel="icon" type="image/svg+xml">).
const SITE_URL = 'https://portfolio-seo-one.vercel.app'
const TITLE = 'Bruno Vilela — Analista de SEO | Portfólio de Resultados'
const DESCRIPTION =
  'Portfólio de Bruno Vilela, Analista de SEO. Projetos reais de SEO e GEO com resultados no Google Search Console: cliques, impressões e posições.'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'Portfólio SEO — Bruno Vilela',
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Portfólio SEO — Bruno Vilela',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
  },
}
export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: extensões do navegador (ex.: ColorZilla injeta
    // cz-shortcut-listen="true" no <body>/<html> antes da hidratação) causam
    // falso-positivo de divergência SSR. Só afeta os atributos deste elemento;
    // os filhos continuam sendo hidratados normalmente.
    <html lang="pt-BR" className={literata.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}