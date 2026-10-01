import './globals.css'
export const metadata = { title: 'Portfólio SEO', description: 'Portfólio Técnico' }
export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}