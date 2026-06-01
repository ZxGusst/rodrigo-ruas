import { NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { FORMULARIO_QUERY } from "@/sanity/lib/queries"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { _webhookUrl, ...dados } = body

    /* 1. Tenta pegar a URL do Sanity (fonte confiável) */
    let webhookUrl: string | undefined
    try {
      const form = await client.fetch(FORMULARIO_QUERY)
      webhookUrl = form?.webhookUrl
    } catch { /* Sanity indisponível */ }

    /* 2. Fallback: URL enviada pelo cliente (útil para testes) */
    if (!webhookUrl && _webhookUrl) {
      webhookUrl = _webhookUrl
    }

    if (!webhookUrl || webhookUrl.includes("placeholder")) {
      return NextResponse.json(
        { error: "Webhook não configurado. Adicione a URL no Sanity → Formulário de Contato." },
        { status: 422 }
      )
    }

    const res = await fetch(webhookUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(dados),
    })

    if (!res.ok) {
      console.error("Webhook error:", res.status, await res.text().catch(() => ""))
      return NextResponse.json({ error: `Webhook retornou ${res.status}` }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("submit-form error:", err)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}
