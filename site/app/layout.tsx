import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { SmoothScroll, PageTransition, PageCurtain } from "@/components/gsap"
import { FormProvider } from "@/components/FormProvider"
import { SoundProvider } from "@/components/SoundProvider"
import { client } from "@/sanity/lib/client"
import { FORMULARIO_QUERY } from "@/sanity/lib/queries"
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let formConfig = null
  try {
    formConfig = await client.fetch(FORMULARIO_QUERY, {}, { next: { revalidate: 60 } })
  } catch {}

  return (
    <html lang="pt-BR" className={`${dmSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <SmoothScroll>
          <SoundProvider>
          <FormProvider formConfig={formConfig}>
            <PageCurtain />
            <PageTransition>
              {children}
            </PageTransition>
          </FormProvider>
          </SoundProvider>
        </SmoothScroll>
      </body>
    </html>
  )
}
