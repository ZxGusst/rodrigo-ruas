"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface HorizontalScrollProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Container de scroll horizontal que:
 * 1. Para o Lenis de interceptar eventos (data-lenis-prevent)
 * 2. Converte deltaY do mouse wheel em scrollLeft
 *    para funcionar com mouse comum (não só trackpad)
 */
export function HorizontalScroll({ children, className = "", style }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      /* se já tem scroll horizontal nativo (trackpad), usa ele */
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

      e.preventDefault()
      e.stopPropagation()

      /* scroll suave: acumula o delta vertical em scrollLeft */
      el.scrollLeft += e.deltaY * 1.5
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  return (
    <div
      ref={ref}
      data-lenis-prevent
      className={className}
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
