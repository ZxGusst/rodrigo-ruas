"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface LineRevealProps {
  children: string
  className?: string
  style?: React.CSSProperties
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  delay?: number
  /* "scroll" (padrão) ou "load" — dispara direto sem ScrollTrigger */
  trigger?: "scroll" | "load"
}

/**
 * Divide o texto em linhas e revela cada linha de baixo pra cima,
 * com overflow hidden no wrapper de cada linha — estilo editorial/fluido.
 */
export function LineReveal({
  children,
  className = "",
  style,
  as: Tag = "p",
  delay = 0,
  trigger = "scroll",
}: LineRevealProps) {
  const wrapRef  = useRef<HTMLElement>(null)
  const linesRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    if (!wrapRef.current) return

    /* Quebra em palavras e reconstrói linha a linha após render */
    const el = wrapRef.current
    const text = children

    /* Cada palavra vira um span, depois agrupamos por linha geométrica */
    el.innerHTML = text
      .split(" ")
      .map(w => `<span class="rl-word" style="display:inline-block">${w}&nbsp;</span>`)
      .join("")

    const words = Array.from(el.querySelectorAll<HTMLElement>(".rl-word"))

    /* Agrupa palavras que compartilham o mesmo offsetTop (= mesma linha) */
    const lineGroups: HTMLElement[][] = []
    let lastTop = -1
    words.forEach(w => {
      const top = w.getBoundingClientRect().top
      if (top !== lastTop) {
        lineGroups.push([])
        lastTop = top
      }
      lineGroups[lineGroups.length - 1].push(w)
    })

    /* Envolve cada linha em overflow:hidden + span interno animável */
    el.innerHTML = ""
    linesRef.current = []

    lineGroups.forEach(group => {
      const outer = document.createElement("span")
      outer.style.cssText = "display:block; overflow:hidden;"

      const inner = document.createElement("span")
      inner.style.cssText = "display:block; transform:translateY(110%);"
      inner.textContent = group.map(w => w.textContent).join("").trimEnd()

      outer.appendChild(inner)
      el.appendChild(outer)
      linesRef.current.push(inner)
    })

    const animProps = {
      y: "0%",
      duration: 0.85,
      ease: "power4.out",
      stagger: 0.1,
      delay,
    }

    if (trigger === "load") {
      gsap.to(linesRef.current, animProps)
    } else {
      gsap.to(linesRef.current, {
        ...animProps,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      })
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Tag ref={wrapRef as React.RefObject<HTMLParagraphElement>} className={className} style={style}>{children}</Tag>
}
