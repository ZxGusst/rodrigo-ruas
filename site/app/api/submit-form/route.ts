import { NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { FORMULARIO_QUERY } from "@/sanity/lib/queries"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    /* Remove _webhookUrl do payload — nunca deve ser aceito do cliente */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _webhookUrl: _ignored, ...dados } = body

    /* Webhook sempre vem do Sanity (fonte confiável — server side) */
    let webhookUrl: string | undefined
    try {
      const form = await client.fetch(FORMULARIO_QUERY)
      webhookUrl = form?.webhookUrl
    } catch { /* Sanity indisponível */ }

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
