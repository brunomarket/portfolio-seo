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

export const metadata = { title: 'Portfólio SEO', description: 'Portfólio Técnico' }
export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: extensões do navegador (ex.: ColorZilla injeta
    // cz-shortcut-listen="true" no <body>/<html> antes da hidratação) causam
    // falso-positivo de divergência SSR. Só afeta os atributos deste elemento;
    // os filhos continuam sendo hidratados normalmente.
    <html lang="pt-br" className={literata.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}