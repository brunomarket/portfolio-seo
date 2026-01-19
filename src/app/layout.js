import './globals.css';
// Importando fontes do Google
import { Cinzel_Decorative, Spectral } from 'next/font/google';

// Configurando as fontes
const cinzel = Cinzel_Decorative({ 
  subsets: ['latin'], 
  weight: ['700'],
  variable: '--font-cinzel' // Criamos uma variável CSS para usar depois
});

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-spectral'
});

export const metadata = {
  title: 'Portfólio SEO Técnico',
  description: 'Portfólio 3D interativo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${cinzel.variable} ${spectral.variable}`}>
      <body>{children}</body>
    </html>
  );
}