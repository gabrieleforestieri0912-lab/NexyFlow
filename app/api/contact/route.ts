import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    await resend.emails.send({
      from: 'Nexyflow <onboarding@resend.dev>',
      replyTo: email,
      to: process.env.CONTACT_EMAIL || 'gabriele.forestieri0912@gmail.com',
      subject: `Nuovo contatto da ${name}`,
      html: `
        <div style="max-width:520px;margin:0 auto;padding:32px 24px;font-family:Arial,sans-serif;background:#fff;border-radius:16px;border:1px solid #eee;">
          <h2 style="color:#111;margin:0 0 16px;">📩 Nuovo messaggio dal form contatti</h2>
          <p style="margin:0 0 8px;"><strong>Nome:</strong> ${name}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin:16px 0 8px;"><strong>Messaggio:</strong></p>
          <div style="background:#f9f9f9;border-radius:8px;padding:16px;color:#444;line-height:1.6;">${message}</div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return NextResponse.json({ error: 'Errore invio messaggio' }, { status: 500 })
  }
}
