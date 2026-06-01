import { NextRequest, NextResponse } from "next/server"

const USUARIO = process.env.SITE_USUARIO ?? "admin"
const SENHA   = process.env.SITE_SENHA   ?? "rr2026"

/* Rotas que não precisam de autenticação */
const PUBLIC_PATHS = ["/api/", "/login"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  /* Rotas de API ficam livres (webhooks, destinos) */
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  /* Verifica cookie de sessão */
  const sessao = req.cookies.get("rr_sessao")?.value
  if (sessao === `${USUARIO}:${SENHA}`) {
    return NextResponse.next()
  }

  /* Verifica se está enviando o formulário de login */
  if (req.method === "POST" && pathname === "/login") {
    return NextResponse.next()
  }

  /* Redireciona para o login */
  const loginUrl = new URL("/login", req.url)
  loginUrl.searchParams.set("from", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
}
