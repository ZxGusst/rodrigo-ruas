"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"

interface SoundContextValue {
  enabled:   boolean
  toggle:    () => void
  playToc:   () => void
}

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle:  () => {},
  playToc: () => {},
})

export function useSound() {
  return useContext(SoundContext)
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  function getCtx() {
    if (!ctxRef.current) ctxRef.current = new AudioContext()
    if (ctxRef.current.state === "suspended") ctxRef.current.resume()
    return ctxRef.current
  }

  function playToc() {
    if (!enabled) return
    try {
      const ctx  = getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = "sine"
      osc.frequency.setValueAtTime(1100, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.06)

      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.06)
    } catch {}
  }

  function toggle() {
    setEnabled(v => !v)
  }

  /* dispara toc em qualquer clique em elementos interativos */
  useEffect(() => {
    function onGlobalClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [data-cursor]")) playToc()
    }
    document.addEventListener("click", onGlobalClick)
    return () => document.removeEventListener("click", onGlobalClick)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return (
    <SoundContext.Provider value={{ enabled, toggle, playToc }}>
      {children}
    </SoundContext.Provider>
  )
}
