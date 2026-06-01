"use client"

import { useRef } from "react"
import gsap from "gsap"

interface FlipTextProps {
  children: string
  className?: string
  as?: "span" | "p" | "h1" | "h2" | "h3" | "a" | "div" | "button"
  stagger?: number
  href?: string
  onClick?: () => void
}

export function FlipText({
  children,
  className = "",
  as: Tag = "span",
  stagger = 0.022,
  href,
  onClick,
}: FlipTextProps) {
  const ref = useRef<HTMLElement>(null)

  const handleEnter = () => {
    if (!ref.current) return
    const inners = ref.current.querySelectorAll<HTMLElement>(".fi")
    gsap.killTweensOf(inners)
    /* move o flex-column para cima: esconde orig, revela clone */
    gsap.to(inners, {
      yPercent: -50,
      duration: 0.34,
      ease: "power3.inOut",
      stagger: { each: stagger },
    })
  }

  const handleLeave = () => {
    if (!ref.current) return
    const inners = ref.current.querySelectorAll<HTMLElement>(".fi")
    gsap.killTweensOf(inners)
    /* volta ao estado inicial */
    gsap.to(inners, {
      yPercent: 0,
      duration: 0.34,
      ease: "power3.inOut",
      stagger: { each: stagger },
    })
  }

  const LINE = 1.15          /* line-height usada em todo o componente */
  const H    = `${LINE}em`   /* altura de 1 char = LINE × font-size */

  const chars = [...children].map((char, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        overflow: "hidden",
        height: H,
        lineHeight: LINE,
        verticalAlign: "bottom",
      }}
    >
      {/*
        .fi = "flip inner" — flex coluna com 2 cópias do char.
        Altura total = 2 × H. yPercent: -50 move exatamente 1H para cima,
        escondendo o original e revelando o clone. Sem position:absolute,
        sem herança de cor quebrada.
      */}
      <span
        className="fi"
        style={{
          display: "flex",
          flexDirection: "column",
          willChange: "transform",
        }}
      >
        <span style={{ height: H, lineHeight: LINE, flexShrink: 0 }}>
          {char === " " ? " " : char}
        </span>
        <span style={{ height: H, lineHeight: LINE, flexShrink: 0 }} aria-hidden>
          {char === " " ? " " : char}
        </span>
      </span>
    </span>
  ))

  const props: Record<string, unknown> = {
    ref,
    className: `inline-flex items-end cursor-pointer select-none ${className}`,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
  }
  if (href)    props.href    = href
  if (onClick) props.onClick = onClick

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Tag {...(props as any)}>{chars}</Tag>
}
