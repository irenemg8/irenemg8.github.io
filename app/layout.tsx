import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '700'], 
  subsets: ['latin'], 
  variable: '--font-poppins'
})

export const metadata = {
  title: "Creative Portfolio | Frontend Developer & Designer",
  description:
    "Portfolio showcasing projects, artworks, hackathons, and press features of a creative frontend developer and designer.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${poppins.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
