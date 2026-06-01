"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface WordRevealProps {
  text: string
  className?: string
  style?: React.CSSProperties
  as?: "p" | "h1" | "h2" | "h3" | "span"
}

export function WordReveal({ text, className = "", style, as: Tag = "p" }: WordRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Quebra em palavras com wrapper
    const words = text.split(" ")
    ref.current.innerHTML = words
      .map(w => `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom">
                   <span class="word" style="display:inline-block">${w}</span>
                 </span>`)
      .join(" ")

    gsap.fromTo(
      ref.current.querySelectorAll(".word"),
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,        // 40ms por palavra — igual OH Architecture
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [text])

  return <Tag ref={ref as React.RefObject<HTMLParagraphElement>} className={className} style={style}>{text}</Tag>
}
