"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"

interface SoundContextValue {
  enabled:   boolean
  toggle:    () => void
  playToc:   () => void   /* click */
  playTic:   () => void   /* hover — tipo iOS picker */
}

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle:  () => {},
  playToc: () => {},
  playTic: () => {},
})

export function useSound() {
  return useContext(SoundContext)
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true)
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
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(1100, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.06)
      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.06)
    } catch {}
  }

  function playTic() {
    if (!enabled) return
    try {
      const ctx  = getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(1800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.03)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.03)
    } catch {}
  }

  function toggle() {
    setEnabled(v => !v)
  }

  /* click → toc | hover → tic */
  useEffect(() => {
    function onGlobalClick(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (t.closest("a, button, [data-cursor]")) playToc()
    }
    function onGlobalEnter(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (t.closest("a, button, [data-cursor]")) playTic()
    }
    document.addEventListener("click",      onGlobalClick)
    document.addEventListener("mouseover",  onGlobalEnter)
    return () => {
      document.removeEventListener("click",     onGlobalClick)
      document.removeEventListener("mouseover", onGlobalEnter)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return (
    <SoundContext.Provider value={{ enabled, toggle, playToc, playTic }}>
      {children}
    </SoundContext.Provider>
  )
}
