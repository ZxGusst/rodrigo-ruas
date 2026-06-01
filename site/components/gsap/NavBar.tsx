"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TransitionLink } from "./TransitionLink"
import { useForm } from "@/components/FormProvider"

gsap.registerPlugin(ScrollTrigger)

const links = [
  { label: "Pacotes",  href: "/pacotes/selecao" },
  { label: "Destinos", href: "#destinos" },
  { label: "Sobre",    href: "#sobre"    },
  { label: "Contato",  href: "#contato"  },
]

export function NavBar() {
  const navRef = useRef<HTMLElement>(null)
  const { openForm } = useForm()

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 }
    )

    ScrollTrigger.create({
      start: "top -80px",
      onUpdate: (self) => {
        navRef.current?.classList.toggle("nav--scrolled", self.progress > 0)
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      <style>{`
        .nav--scrolled {
          background: rgba(250,250,248,0.95) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 hsl(36 16% 85%);
        }
        .nav-link {
          position: relative;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2px;
          background: hsl(209 57% 12%);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
      `}</style>

      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                   bg-background px-[clamp(20px,5vw,64px)] h-20
                   transition-all duration-300"
      >
        {/* Logo */}
        <a href="/" className="flex flex-col leading-tight group">
          <span className="text-xl font-bold tracking-tight text-foreground">RR VIAGENS</span>
          <span className="text-[12px] tracking-[0.1em] text-foreground-subtle uppercase">
            Pacotes pelo Mundo
          </span>
        </a>

        {/* Links — sem FlipText, hover simples e claro */}
        <ul className="hidden md:flex items-center gap-10 list-none">
          {links.map(({ label, href }) => (
            <li key={label}>
              {href.startsWith("/") ? (
                <TransitionLink
                  href={href}
                  className="nav-link text-[16px] font-medium text-foreground-muted
                             hover:text-foreground transition-colors duration-200"
                >
                  {label}
                </TransitionLink>
              ) : (
                <a
                  href={href}
                  className="nav-link text-[16px] font-medium text-foreground-muted
                             hover:text-foreground transition-colors duration-200"
                >
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* CTA — abre o formulário */}
        <button
          onClick={() => openForm()}
          className="hidden md:inline-flex items-center gap-3
                     bg-primary text-primary-foreground
                     text-[16px] font-semibold
                     px-7 py-3.5 rounded-full
                     hover:opacity-90 transition-opacity cursor-pointer"
        >
          Falar no WhatsApp
          <span className="w-[7px] h-[7px] rounded-full bg-primary-foreground shrink-0" />
        </button>
      </nav>
    </>
  )
}
