"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Bolinha navy que fica -10px/-10px abaixo do cursor nativo (que permanece visível).
 * Em hover de elementos interativos: cresce com seta →.
 * Desativado em touch.
 */
export function MagneticCursor() {
  const ballRef  = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const ball  = ballRef.current!
    const arrow = arrowRef.current!

    /* offset em relação ao cursor nativo */
    const OX = 10   /* px à direita */
    const OY = 10   /* px abaixo   */

    gsap.set(ball, { x: -100, y: -100 })

    const onMove = (e: MouseEvent) => {
      gsap.to(ball, {
        x: e.clientX + OX,
        y: e.clientY + OY,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      })
    }
    window.addEventListener("mousemove", onMove)

    /* grow ao entrar em interativos */
    const grow = () => {
      gsap.to(ball,  { width: 86, height: 86, padding: 8, duration: 0.35, ease: "power3.out" })
      gsap.to(arrow, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out", delay: 0.08 })
    }
    const shrink = () => {
      gsap.to(ball,  { width: 14, height: 14, padding: 0, duration: 0.35, ease: "power3.out" })
      gsap.to(arrow, { opacity: 0, scale: 0.4, duration: 0.15 })
    }

    /* esconde ao sair da janela */
    const hide = () => gsap.to(ball, { opacity: 0, duration: 0.15 })
    const show = () => gsap.to(ball, { opacity: 1, duration: 0.15 })
    document.addEventListener("mouseleave", hide)
    document.addEventListener("mouseenter", show)

    const targets = document.querySelectorAll<HTMLElement>("a, button, [data-cursor]")
    targets.forEach(el => {
      el.addEventListener("mouseenter", grow)
      el.addEventListener("mouseleave", shrink)
    })

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", hide)
      document.removeEventListener("mouseenter", show)
      targets.forEach(el => {
        el.removeEventListener("mouseenter", grow)
        el.removeEventListener("mouseleave", shrink)
      })
    }
  }, [])

  return (
    <div
      ref={ballRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]
                 flex items-center justify-center rounded-full bg-foreground"
      style={{ width: 14, height: 14, padding: 0, overflow: "hidden", transform: "translate(-100px,-100px)" }}
    >
      <span
        ref={arrowRef}
        className="flex flex-row items-center gap-[3px] select-none"
        style={{ opacity: 0, transform: "scale(0.4)" }}
        aria-hidden
      >
        <span className="text-primary-foreground text-[10px] font-black tracking-[0.12em] uppercase leading-none">
          clique
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
             viewBox="0 0 256 256" fill="currentColor"
             className="text-primary-foreground shrink-0">
          <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
        </svg>
      </span>
    </div>
  )
}
