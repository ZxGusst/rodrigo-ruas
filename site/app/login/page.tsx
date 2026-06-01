import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const USUARIO = process.env.SITE_USUARIO ?? "admin"
const SENHA   = process.env.SITE_SENHA   ?? "rr2026"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; erro?: string }>
}) {
  const { from = "/", erro } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#060F18]">
      <div className="w-full max-w-sm px-8 py-10 border border-white/10 rounded-2xl bg-[#0C1B27]">

        <div className="mb-8 text-center">
          <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-white/30 mb-3">
            Acesso restrito
          </p>
          <h1 className="text-[24px] font-bold text-white">RR Viagens</h1>
        </div>

        <form action={login} className="flex flex-col gap-4">
          <input type="hidden" name="from" value={from} />

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase">
              Usuário
            </label>
            <input
              name="usuario"
              type="text"
              autoComplete="username"
              required
              className="bg-white/5 border border-white/10 rounded-lg
                         px-4 py-3 text-[16px] text-white placeholder-white/20
                         focus:outline-none focus:border-white/30 transition-colors"
              placeholder="usuário"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-white/50 tracking-wide uppercase">
              Senha
            </label>
            <input
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              className="bg-white/5 border border-white/10 rounded-lg
                         px-4 py-3 text-[16px] text-white placeholder-white/20
                         focus:outline-none focus:border-white/30 transition-colors"
              placeholder="••••••"
            />
          </div>

          {erro === "1" && (
            <p className="text-[13px] text-red-400 text-center">
              Usuário ou senha incorretos.
            </p>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-white text-[#060F18] text-[16px] font-bold
                       py-3.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}

async function login(data: FormData) {
  "use server"
  const usuario = data.get("usuario") as string
  const senha   = data.get("senha")   as string
  const from    = (data.get("from") as string) || "/"

  if (usuario === USUARIO && senha === SENHA) {
    const jar = await cookies()
    jar.set("rr_sessao", `${USUARIO}:${SENHA}`, {
      httpOnly: true,
      secure:   true,
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 7, /* 7 dias */
      path:     "/",
    })
    redirect(from)
  }

  redirect(`/login?from=${encodeURIComponent(from)}&erro=1`)
}
