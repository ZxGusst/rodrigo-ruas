"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Cursor customizado que adapta cor baseado em data-cursor-theme="dark"|"light".
 * Seções com imagem/fundo escuro recebem data-cursor-theme="dark" → cursor branco.
 * Padrão (sem atributo) → cursor dark (foreground).
 */
export function MagneticCursor() {
  const ballRef  = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const ball  = ballRef.current!
    const arrow = arrowRef.current!

    const OX = 10
    const OY = 10

    /* cor atual para evitar animações desnecessárias */
    let currentTheme = "light"

    const DARK_BG   = "hsl(209, 57%, 12%)"   /* --foreground */
    const LIGHT_BG  = "#ffffff"
    const DARK_TEXT = "hsl(209, 57%, 12%)"
    const LIGHT_TEXT = "#ffffff"

    function applyTheme(theme: string) {
      if (theme === currentTheme) return
      currentTheme = theme
      const isDark = theme === "dark"
      gsap.to(ball, {
        backgroundColor: isDark ? LIGHT_BG  : DARK_BG,
        duration: 0.25,
        ease: "power2.out",
      })
      /* troca cor do texto/ícone */
      arrow.style.color = isDark ? DARK_TEXT : LIGHT_TEXT
    }

    gsap.set(ball, { x: -100, y: -100 })

    const onMove = (e: MouseEvent) => {
      gsap.to(ball, {
        x: e.clientX + OX,
        y: e.clientY + OY,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      })

      /* detecta tema: esconde temporariamente o cursor para elementFromPoint não o interceptar */
      ball.style.display = "none"
      const el = document.elementFromPoint(e.clientX, e.clientY)
      ball.style.display = ""
      const themed = el?.closest("[data-cursor-theme]")
      const theme  = themed?.getAttribute("data-cursor-theme") ?? "light"
      applyTheme(theme)
    }
    window.addEventListener("mousemove", onMove)

    const grow = () => {
      gsap.to(ball,  { width: 86, height: 86, padding: 8, duration: 0.35, ease: "power3.out" })
      gsap.to(arrow, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out", delay: 0.08 })
    }
    const shrink = () => {
      gsap.to(ball,  { width: 14, height: 14, padding: 0, duration: 0.35, ease: "power3.out" })
      gsap.to(arrow, { opacity: 0, scale: 0.4, duration: 0.15 })
    }

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
                 flex items-center justify-center rounded-full"
      style={{
        width: 14, height: 14, padding: 0,
        overflow: "hidden",
        transform: "translate(-100px,-100px)",
        backgroundColor: "hsl(209, 57%, 12%)",
      }}
    >
      <span
        ref={arrowRef}
        className="flex flex-row items-center gap-[3px] select-none"
        style={{ opacity: 0, transform: "scale(0.4)", color: "#ffffff" }}
        aria-hidden
      >
        <span className="text-[10px] font-black tracking-[0.12em] uppercase leading-none">
          clique
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
             viewBox="0 0 256 256" fill="currentColor" className="shrink-0">
          <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
        </svg>
      </span>
    </div>
  )
}
