"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface CountUpProps {
  value: number
  suffix?: string
  className?: string
  duration?: number
}

export function CountUp({ value, suffix = "", className = "", duration = 2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const obj = { val: 0 }

    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration,
          ease: "power2.out",
          onUpdate() {
            if (ref.current) {
              ref.current.textContent = Math.round(obj.val).toLocaleString("pt-BR") + suffix
            }
          },
          onComplete() {
            if (ref.current) {
              ref.current.textContent = value.toLocaleString("pt-BR") + suffix
            }
          },
        })
      },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [value, suffix, duration])

  return <span ref={ref} className={className}>0</span>
}
