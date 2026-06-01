import { FileImage } from "@phosphor-icons/react/dist/ssr"

interface ImagePlaceholderProps {
  className?: string
  style?: React.CSSProperties
  iconSize?: number
}

export function ImagePlaceholder({
  className = "",
  style,
  iconSize = 48,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ background: "#ABABAB", ...style }}
    >
      <FileImage size={iconSize} color="white" weight="fill" />
    </div>
  )
}
