import Link from "next/link"
import { NavBar, MagneticCursor } from "@/components/gsap"
import { ArrowRight, Compass } from "@phosphor-icons/react/dist/ssr"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-foreground text-primary-foreground overflow-x-clip flex flex-col">
      <MagneticCursor />
      <NavBar />

      {/* ── Centro ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">

        {/* Número decorativo */}
        <p
          className="font-bold text-primary-foreground/5 leading-none select-none mb-[-2rem] relative z-0"
          style={{ fontSize: "clamp(140px, 30vw, 320px)", letterSpacing: "-0.05em" }}
          aria-hidden
        >
          404
        </p>

        {/* Label */}
        <p className="relative z-10 text-[11px] font-bold tracking-[0.2em] uppercase text-primary-foreground/40 mb-5">
          PÁGINA NÃO ENCONTRADA
        </p>

        {/* Título */}
        <h1
          className="relative z-10 font-bold text-primary-foreground leading-tight mb-5"
          style={{ fontSize: "clamp(28px, 5vw, 56px)", letterSpacing: "-0.02em", maxWidth: "640px" }}
        >
          Ops. Esta página não existe.
        </h1>

        {/* Subtítulo */}
        <p className="relative z-10 text-[18px] text-primary-foreground/55 leading-relaxed mb-12 max-w-md">
          Mas calma — a gente te ajuda a voltar pro caminho certo.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-primary-foreground text-primary
                       text-[16px] font-bold px-8 py-4 rounded-full
                       hover:bg-gray-100 transition-colors"
          >
            Ir para a home
            <ArrowRight size={18} weight="bold" />
          </Link>

          <Link
            href="/pacotes/selecao"
            className="inline-flex items-center gap-3 border border-primary-foreground/20
                       text-primary-foreground/70 hover:text-primary-foreground
                       hover:border-primary-foreground/40
                       text-[16px] font-medium px-8 py-4 rounded-full transition-colors"
          >
            <Compass size={18} />
            Ver pacotes
          </Link>
        </div>
      </div>

      {/* ── Rodapé ─────────────────────────────────────── */}
      <footer className="py-6 border-t border-primary-foreground/10">
        <div className="wrap flex justify-between items-center">
          <p className="font-bold tracking-tight text-primary-foreground text-[15px]">RR VIAGENS</p>
          <p className="text-[13px] text-primary-foreground/30">© 2026 — Pacotes pelo Mundo</p>
        </div>
      </footer>
    </main>
  )
}
