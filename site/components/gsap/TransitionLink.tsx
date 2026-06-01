"use client"

import { useRouter } from "next/navigation"
import { type MouseEvent, type ReactNode, useRef } from "react"

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
}

/**
 * Link que dispara o swipe-up (PageCurtain) antes de navegar.
 * Funciona com qualquer elemento filho.
 */
export function TransitionLink({ href, children, className = "" }: TransitionLinkProps) {
  const router  = useRouter()
  const pending = useRef(false)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (pending.current) return
    pending.current = true

    /* dispara curtain:in → PageCurtain sobe e cobre a tela */
    window.dispatchEvent(new Event("curtain:in"))

    /* navega após a curtain cobrir a tela (~450ms) */
    setTimeout(() => {
      pending.current = false
      router.push(href)
    }, 460)
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
