"use client"

import { useEffect, useRef } from "react"
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function FloatingWhatsApp() {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    /* aparece após rolar um pouco */
    gsap.set(ref.current, { opacity: 0, scale: 0.8, y: 20 })
    ScrollTrigger.create({
      start: "top -120px",
      onEnter:     () => gsap.to(ref.current, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }),
      onLeaveBack: () => gsap.to(ref.current, { opacity: 0, scale: 0.8, y: 20, duration: 0.25 }),
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <a
      ref={ref}
      href="https://wa.me/5511966401489"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50
                 inline-flex items-center gap-3
                 bg-primary text-primary-foreground
                 text-[16px] font-semibold
                 px-7 py-3.5 rounded-full
                 shadow-xl hover:opacity-90
                 transition-opacity"
    >
      <WhatsappLogo size={18} weight="fill" />
      Falar agora
      <span className="w-[7px] h-[7px] rounded-full bg-primary-foreground shrink-0" />
    </a>
  )
}
