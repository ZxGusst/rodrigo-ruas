/**
 * Overlay padrão para imagens com texto sobreposto.
 *
 * Técnica: 2 camadas absolutas com inset:0
 *  1. Backdrop-blur com mask de baixo pra cima (blur só na área do texto)
 *  2. Gradiente escuro de baixo pra cima (contraste para o texto)
 *
 * Usar assim:
 *  <div className="relative overflow-hidden">
 *    <img ... />
 *    <ImageOverlay />
 *    <div className="absolute bottom-0 ...">Texto</div>
 *  </div>
 */

interface ImageOverlayProps {
  blur?:        number   /* intensidade do blur — padrão 10 */
  darkFrom?:    number   /* opacidade da cor escura no bottom — padrão 0.65 */
  darkMid?:     number   /* opacidade no meio — padrão 0.15 */
  blurStop?:    string   /* até onde vai o blur sólido — padrão "40%" */
  blurFade?:    string   /* onde o blur termina — padrão "75%" */
}

export function ImageOverlay({
  blur     = 10,
  darkFrom = 0.65,
  darkMid  = 0.15,
  blurStop = "40%",
  blurFade = "75%",
}: ImageOverlayProps) {
  /* Máscara: totalmente opaca no bottom → transparente no topo */
  const mask = `linear-gradient(to top, black 0%, black ${blurStop}, rgba(0,0,0,0.6) ${blurFade}, transparent 100%)`

  return (
    /* Apenas o gradiente escuro — o blur vai na div do texto, não aqui */
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(to top,
          hsl(209 57% 12% / ${darkFrom}) 0%,
          hsl(209 57% 12% / ${darkMid}) 50%,
          transparent 100%)`,
      }}
    />
  )
}
