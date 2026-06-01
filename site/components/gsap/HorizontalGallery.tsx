"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ImagePlaceholder } from "./ImagePlaceholder"
import { FlipText } from "./FlipText"

gsap.registerPlugin(ScrollTrigger)

const DESTINOS = [
  { label: "JAPÃO",     sub: "12 dias", tall: true  },
  { label: "GRÉCIA",    sub: "10 dias", tall: false },
  { label: "TURQUIA",   sub: "10 dias", tall: true  },
  { label: "EGITO",     sub: "10 dias", tall: false },
  { label: "MARROCOS",  sub: "8 dias",  tall: true  },
  { label: "ISLÂNDIA",  sub: "9 dias",  tall: false },
  { label: "TAILÂNDIA", sub: "11 dias", tall: true  },
  { label: "PORTUGAL",  sub: "7 dias",  tall: false },
]

export function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      const getDistance = () => -(track.scrollWidth - section.clientWidth)

      const tween = gsap.to(track, {
        x: getDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.abs(getDistance())}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      return () => tween.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="overflow-hidden bg-background">
      {/* Header */}
      <div className="flex justify-between items-end px-[clamp(24px,5vw,64px)] pt-16 pb-8 border-t border-border">
        <div>
          <p className="t-label mb-2">Destinos</p>
          <p className="t-h2 text-foreground">Onde você quer ir?</p>
        </div>
        <span className="t-small hidden md:block text-foreground-subtle">
          SCROLL TO EXPLORE →
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex items-end gap-3 px-[clamp(24px,5vw,64px)] pb-12 will-change-transform"
        style={{ width: "max-content" }}
      >
        {DESTINOS.map(({ label, sub, tall }) => (
          <Card key={label} label={label} sub={sub} tall={tall} />
        ))}
        <div className="shrink-0 w-[clamp(24px,5vw,64px)]" aria-hidden />
      </div>
    </section>
  )
}

function Card({ label, sub, tall }: { label: string; sub: string; tall: boolean }) {
  const imgRef  = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    gsap.to(imgRef.current, { scale: 1.04, duration: 0.7, ease: "power2.out" })
  }
  const handleLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: "power2.out" })
  }

  const width  = tall ? "clamp(200px,18vw,280px)" : "clamp(260px,24vw,380px)"
  const height = tall ? "clamp(320px,42vw,520px)" : "clamp(200px,26vw,340px)"

  return (
    <div
      className="shrink-0 cursor-pointer"
      style={{ width }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="overflow-hidden mb-3" style={{ height }}>
        <div ref={imgRef} className="w-full h-full will-change-transform">
          <ImagePlaceholder className="w-full h-full" iconSize={36} />
        </div>
      </div>

      <FlipText
        as="p"
        className="text-[11px] font-semibold tracking-[0.08em] text-foreground"
        stagger={0.015}
      >
        {label}
      </FlipText>
      <p className="text-[11px] text-foreground-subtle mt-0.5">{sub}</p>
    </div>
  )
}
