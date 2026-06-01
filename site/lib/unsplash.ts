/**
 * Imagens Unsplash por slug de destino — usadas como fallback
 * enquanto o Sanity não tem imagem real cadastrada.
 * Já servidas em WebP com compressão q=80.
 */
const BASE = "https://images.unsplash.com"

export const UNSPLASH: Record<string, string> = {
  japao:      `${BASE}/photo-1540959733332-eab4deabeeaf?w=1200&q=80&fm=webp&fit=crop`,
  alemanha:   `${BASE}/photo-1467269204594-9661b134dd2b?w=1200&q=80&fm=webp&fit=crop`,
  grecia:     `${BASE}/photo-1555993539-1732b0258235?w=1200&q=80&fm=webp&fit=crop`,
  turquia:    `${BASE}/photo-1524231757912-21f4fe3a7200?w=1200&q=80&fm=webp&fit=crop`,
  egito:      `${BASE}/photo-1568322445389-f64ac2515020?w=1200&q=80&fm=webp&fit=crop`,
  islandia:   `${BASE}/photo-1476610182048-b716b8518aae?w=1200&q=80&fm=webp&fit=crop`,
  marrocos:   `${BASE}/photo-1500530855697-b586d89ba3ee?w=1200&q=80&fm=webp&fit=crop`,
  tailandia:  `${BASE}/photo-1528181304800-259b08848526?w=1200&q=80&fm=webp&fit=crop`,
  portugal:   `${BASE}/photo-1555881400-74d7acaacd8b?w=1200&q=80&fm=webp&fit=crop`,
  peru:       `${BASE}/photo-1526392060635-9d6019884377?w=1200&q=80&fm=webp&fit=crop`,
  /* hero da home + página do Japão */
  hero:       `${BASE}/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85&fm=webp&fit=crop`,
  rodrigo:    `${BASE}/photo-1507003211169-0a1dd7228f2d?w=900&q=80&fm=webp&fit=crop`,
}

/** Retorna URL Unsplash pelo slug, ou null se não encontrado */
export function getUnsplash(slug: string, size: "sm" | "md" | "lg" = "md"): string | null {
  const w = { sm: 600, md: 900, lg: 1400 }[size]
  const url = UNSPLASH[slug.toLowerCase().replace(/[^a-z]/g, "")]
  if (!url) return null
  return url.replace("w=1200", `w=${w}`)
}
