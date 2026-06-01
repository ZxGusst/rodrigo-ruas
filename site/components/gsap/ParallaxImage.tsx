"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ParallaxImageProps {
  src?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  /* Intensidade do parallax: 0.1 (sutil) a 0.4 (forte). Padrão 0.2 */
  intensity?: number
  children?: React.ReactNode
}

export function ParallaxImage({
  src,
  alt = "",
  className = "",
  style,
  intensity = 0.2,
  children,
}: ParallaxImageProps) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current || !innerRef.current) return

    // Escala ligeiramente maior para esconder as bordas durante o parallax
    gsap.set(innerRef.current, { scale: 1 + intensity })

    gsap.to(innerRef.current, {
      yPercent: intensity * 100,
      ease: "none",
      scrollTrigger: {
        trigger: wrapRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [intensity])

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`} style={style}>
      <div ref={innerRef} className="w-full h-full will-change-transform">
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          children
        )}
      </div>
    </div>
  )
}
