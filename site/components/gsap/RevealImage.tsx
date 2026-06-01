"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface RevealImageProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right"
}

/**
 * Revela filhos com clip-path — efeito wipe de baixo pra cima.
 * Envolva qualquer imagem/placeholder neste componente.
 */
export function RevealImage({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const from: Record<string, string> = {
      up:    "inset(100% 0% 0% 0%)",
      left:  "inset(0% 100% 0% 0%)",
      right: "inset(0% 0% 0% 100%)",
    }

    gsap.fromTo(
      ref.current,
      { clipPath: from[direction] },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.1,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [delay, direction])

  return (
    <div ref={ref} className={className} style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
      {children}
    </div>
  )
}
