"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  /* "up" (padrão), "left", "right", "fade" */
  direction?: "up" | "left" | "right" | "fade"
  /* stagger para múltiplos filhos */
  stagger?: boolean
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  stagger = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const from: gsap.TweenVars = { opacity: 0 }
    if (direction === "up")    { from.y = 50 }
    if (direction === "left")  { from.x = -40 }
    if (direction === "right") { from.x = 40 }

    const targets = stagger
      ? Array.from(ref.current.children)
      : ref.current

    gsap.fromTo(
      targets,
      from,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power4.out",
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [delay, direction, stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
