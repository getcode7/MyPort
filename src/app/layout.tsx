'use client';

// ============================================================================
// IMPORTS ORGANIZADOS
// ============================================================================
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navbar } from '@/components/Navbar';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { Inter } from 'next/font/google';
import './globals.css';

// ============================================================================
// 1. CONFIGURAÇÕES DE FONTE
// ============================================================================

/** Fonte Inter com configurações otimizadas */
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Otimiza performance de carregamento
  preload: true,   // Pré-carrega a fonte
});

// ============================================================================
// 2. CONSTANTES DE ESTILO
// ============================================================================

/** Classes CSS do body (mantidas exatamente iguais ao original) */
const BODY_CLASSES = `
  bg-[#f5f7fb] dark:bg-[#0b0f19]
  text-gray-900 dark:text-white
  overflow-x-hidden
  antialiased
  relative
`.trim().replace(/\s+/g, ' ');

/** Classes do container principal */
const MAIN_CLASSES = "relative";

// ============================================================================
// 3. COMPONENTES DE BACKGROUND (Separados para melhor organização)
// ============================================================================

/**
 * Componente de efeitos de glow no fundo
 * (Mantém exatamente os mesmos efeitos visuais)
 */
const BackgroundGlows = () => (
  <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
    {/* Glow topo esquerdo */}
    <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

    {/* Glow topo direito */}
    <div className="absolute top-[-250px] right-[-100px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

    {/* Glow inferior */}
    <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full" />
  </div>
);

// ============================================================================
// 4. LAYOUT PRINCIPAL (Memoizado para performance)
// ============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="pt" 
      suppressHydrationWarning
      className="h-full"
    >
      <body
        className={`${inter.className} ${BODY_CLASSES}`}
      >
        <ThemeProvider>
          {/* Efeitos de fundo decorativos */}
          <BackgroundGlows />

          {/* Partículas interativas */}
          <InteractiveBackground />

          {/* Barra de navegação */}
          <Navbar />

          {/* Conteúdo principal */}
          <main className={MAIN_CLASSES}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

// ============================================================================
// 5. EXPORTS ADICIONAIS (Opcionais - para uso em outros lugares)
// ============================================================================

/**
 * Exporta as configurações do layout para possível uso em testes ou
 * componentes que precisam acessar as mesmas configurações
 */
export { inter, BODY_CLASSES, MAIN_CLASSES };