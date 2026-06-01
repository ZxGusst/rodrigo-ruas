"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"

/**
 * Painel fixo que executa o swipe-up em toda troca de rota:
 *  1. TransitionLink dispara evento 'curtain:in'
 *     → curtain sobe de baixo, cobre a tela
 *  2. Router navega (página monta por baixo da curtain)
 *  3. usePathname detecta mudança
 *     → curtain sobe e sai pelo topo, revelando nova página
 */
export function PageCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null)
  const pathname   = usePathname()
  const prevPath   = useRef(pathname)
  const isIn       = useRef(false)

  useEffect(() => {
    const curtain = curtainRef.current
    if (!curtain) return

    /* posição inicial: fora de cena embaixo */
    gsap.set(curtain, { yPercent: 100, display: "block" })

    const handleIn = () => {
      isIn.current = true
      /* sobe e cobre a tela */
      gsap.to(curtain, {
        yPercent: 0,
        duration: 0.45,
        ease: "power3.inOut",
      })
    }

    window.addEventListener("curtain:in", handleIn)
    return () => window.removeEventListener("curtain:in", handleIn)
  }, [])

  /* quando o pathname muda → curtain sai pelo topo */
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname

    const curtain = curtainRef.current
    if (!curtain || !isIn.current) return

    isIn.current = false

    gsap.to(curtain, {
      yPercent: -100,
      duration: 0.45,
      ease: "power3.inOut",
      delay: 0.05,          /* pequena pausa para nova página renderizar */
      onComplete: () => {
        /* reset fora de cena embaixo para próxima transição */
        gsap.set(curtain, { yPercent: 100 })
      },
    })
  }, [pathname])

  return (
    <div
      ref={curtainRef}
      className="fixed inset-0 z-[9990] pointer-events-none"
      style={{ background: "hsl(var(--foreground))", display: "none" }}
      aria-hidden
    />
  )
}
