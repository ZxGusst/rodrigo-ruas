"use client"

import { useRef } from "react"
import gsap from "gsap"

interface BtnPrimaryProps {
  children: string
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
  className?: string
  stagger?: number
  variant?: "primary" | "outline"
}

/**
 * Botão padrão — hover no container inteiro dispara flip char-by-char no texto.
 * Mesmo visual em toda a app: pill, dot, icon opcional.
 */
export function BtnPrimary({
  children,
  href,
  target,
  rel,
  onClick,
  className = "",
  stagger = 0.014,
  variant = "primary",
}: BtnPrimaryProps) {
  const textRef = useRef<HTMLSpanElement>(null)

  const animate = (dir: 1 | -1) => {
    if (!textRef.current) return
    const inners = textRef.current.querySelectorAll<HTMLElement>(".bi")
    gsap.killTweensOf(inners)
    gsap.to(inners, {
      yPercent: dir === 1 ? -50 : 0,
      duration: 0.32,
      ease: "power3.inOut",
      stagger: { each: stagger },
    })
  }

  const LINE = 1.15
  const H    = `${LINE}em`

  const chars = [...children].map((char, i) => {
    /* espaço: não-quebrável + minWidth para não colapsar */
    const isSpace = char === " "
    const ch = isSpace ? " " : char
    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          overflow: "hidden",
          height: H,
          lineHeight: LINE,
          verticalAlign: "bottom",
          minWidth: isSpace ? "0.32em" : undefined,
          whiteSpace: "pre",
        }}
      >
        <span
          className="bi"
          style={{ display: "flex", flexDirection: "column", willChange: "transform", whiteSpace: "pre" }}
        >
          <span style={{ height: H, lineHeight: LINE, flexShrink: 0, whiteSpace: "pre" }}>{ch}</span>
          <span style={{ height: H, lineHeight: LINE, flexShrink: 0, whiteSpace: "pre" }} aria-hidden>{ch}</span>
        </span>
      </span>
    )
  })

  const variantCls = variant === "outline"
    ? `bg-transparent text-foreground border-[1.5px] border-foreground hover:bg-foreground hover:text-background`
    : `bg-primary text-primary-foreground hover:opacity-90`

  const cls =
    `inline-flex items-center gap-3 ` +
    `text-[20px] font-semibold px-8 py-4 rounded-full ` +
    `transition-all duration-200 cursor-pointer ${variantCls} ${className}`

  const events = {
    onMouseEnter: () => animate(1),
    onMouseLeave: () => animate(-1),
  }

  const inner = (
    <>
      <span ref={textRef} className="inline-flex items-end select-none">{chars}</span>
      <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${variant === "outline" ? "bg-foreground" : "bg-primary-foreground"}`} />
    </>
  )

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={cls} {...events}>
        {inner}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={cls} {...events}>
      {inner}
    </button>
  )
}
