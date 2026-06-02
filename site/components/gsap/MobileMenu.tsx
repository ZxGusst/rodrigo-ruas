"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { usePathname } from "next/navigation"
import { TransitionLink } from "./TransitionLink"
import { useForm } from "@/components/FormProvider"

const LINKS = [
  { label: "Destinos",  href: "/pacotes/selecao" },
  { label: "Grupos",    href: "/pacotes/selecao"  },
  { label: "Sobre",     href: "/sobre"            },
  { label: "Contato",   href: "/contato"          },
]

export function MobileMenu() {
  const [open, setOpen]   = useState(false)
  const overlayRef        = useRef<HTMLDivElement>(null)
  const linksRef          = useRef<HTMLUListElement>(null)
  const footerRef         = useRef<HTMLDivElement>(null)
  const pathname          = usePathname()
  const { openForm }      = useForm()

  /* fecha ao mudar de página */
  useEffect(() => { setOpen(false) }, [pathname])

  /* animação de abertura/fechamento */
  useEffect(() => {
    const overlay = overlayRef.current
    const links   = linksRef.current?.children
    const footer  = footerRef.current
    if (!overlay) return

    if (open) {
      document.body.style.overflow = "hidden"
      gsap.set(overlay, { display: "flex" })
      gsap.to(overlay,  { opacity: 1, duration: 0.35, ease: "power2.out" })
      if (links) gsap.fromTo(Array.from(links),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08, delay: 0.1 }
      )
      if (footer) gsap.fromTo(footer,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.4 }
      )
    } else {
      document.body.style.overflow = ""
      gsap.to(overlay, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      })
    }
  }, [open])

  return (
    <>
      {/* Botão MENU — só mobile */}
      <div className="flex md:hidden items-center gap-4">
        <button
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground
                     text-[15px] font-semibold px-5 py-2.5 rounded-full cursor-pointer"
        >
          Contato
          <span className="w-[6px] h-[6px] rounded-full bg-primary-foreground shrink-0" />
        </button>
        <button
          onClick={() => setOpen(true)}
          className="text-[15px] font-semibold uppercase tracking-[0.12em] text-foreground cursor-pointer"
          aria-label="Abrir menu"
        >
          Menu
        </button>
      </div>

      {/* Overlay full-screen */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] flex-col bg-foreground text-primary-foreground
                   px-8 pt-6 pb-10"
        style={{ display: "none", opacity: 0 }}
      >
        {/* Topo: logo + fechar */}
        <div className="flex items-center justify-between mb-auto">
          <a href="/" onClick={() => setOpen(false)}
             className="flex flex-col leading-tight">
            <span className="text-[20px] font-bold tracking-tight text-primary-foreground">RR VIAGENS</span>
          </a>
          <button
            onClick={() => setOpen(false)}
            className="text-[15px] font-semibold uppercase tracking-[0.12em] text-primary-foreground/70
                       hover:text-primary-foreground transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

        {/* Links grandes */}
        <ul ref={linksRef} className="flex flex-col gap-2 mt-auto mb-auto pt-16">
          {LINKS.map(({ label, href }) => (
            <li key={label}>
              <TransitionLink
                href={href}
                onClick={() => setOpen(false)}
                className="block text-primary-foreground leading-none font-bold uppercase
                           hover:text-primary-foreground/60 transition-colors"
                style={{ fontSize: "clamp(52px, 14vw, 80px)", letterSpacing: "-0.02em" }}
              >
                {label}
              </TransitionLink>
            </li>
          ))}
        </ul>

        {/* Rodapé */}
        <div ref={footerRef} className="mt-auto pt-10 border-t border-primary-foreground/15 flex flex-col gap-3">
          <a href="https://instagram.com/rodrigoruas"
             className="text-[14px] font-semibold uppercase tracking-[0.1em] text-primary-foreground/50
                        hover:text-primary-foreground transition-colors">
            Instagram
          </a>
          <a href="https://wa.me/5511966401489" target="_blank" rel="noreferrer"
             className="text-[14px] font-semibold uppercase tracking-[0.1em] text-primary-foreground/50
                        hover:text-primary-foreground transition-colors">
            WhatsApp
          </a>
          <p className="text-[13px] text-primary-foreground/30 mt-2">
            © 2026 RR Viagens
          </p>
        </div>
      </div>
    </>
  )
}
