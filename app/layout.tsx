import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Poppins } from "next/font/google"
import { Space_Mono } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"

// Primary display font - Variable
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

// Secondary font - Headings
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800'], 
  subsets: ['latin'], 
  variable: '--font-poppins',
  display: 'swap',
})

// Monospace font for code
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

// Alternative monospace
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata = {
  title: "Irene MG | Diseñadora & Desarrolladora Frontend",
  description:
    "Portafolio inmersivo de Irene Medina García - Diseñadora UX/UI y Desarrolladora Frontend especializada en experiencias digitales inolvidables",
  generator: 'Next.js + Framer Motion + Three.js',
  keywords: 'diseño ux ui, desarrollo frontend, portfolio interactivo, experiencia digital',
  authors: [{ name: 'Irene Medina García' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${spaceMono.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
