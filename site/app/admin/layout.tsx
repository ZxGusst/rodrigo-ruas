/**
 * Layout isolado para o Sanity Studio — sem SmoothScroll, SoundProvider
 * ou qualquer wrapper que intercepte eventos do Studio.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
