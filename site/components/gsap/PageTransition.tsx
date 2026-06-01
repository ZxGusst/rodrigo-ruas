"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /* pequeno delay para a curtain sair primeiro */
    gsap.to(ref.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power1.out",
      delay: 0.1,
      clearProps: "opacity",
    })
  }, [])

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
