import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { SmoothScroll, PageTransition, PageCurtain } from "@/components/gsap"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "RR Viagens — Pacotes pelo Mundo",
  description: "Curadoria de expert para viajantes exigentes. 93 países visitados pessoalmente.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <SmoothScroll>
          <PageCurtain />
          <PageTransition>
            {children}
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  )
}
