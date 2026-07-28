import { NextResponse } from "next/server";
import { Resend } from "resend";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);
const CODES: Record<string, { code: string; expiresAt: number }> =
  (globalThis as any)._verificationCodes ||
  ((globalThis as any)._verificationCodes = {});

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email richiesta" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Se l'email esiste, riceverai un codice di verifica." },
        { status: 200 },
      );
    }

    const code = generateCode();
    CODES[email] = { code, expiresAt: Date.now() + 5 * 60 * 1000 };

    try {
      const html = `
        <div style="max-width:480px;margin:0 auto;padding:32px 24px;font-family:Arial,sans-serif;background:#fff;border-radius:16px;border:1px solid #eee;">
          <div style="text-align:center;margin-bottom:24px;">
            <img src="https://nextbrand.app/nextbrand.png" alt="NextBrand" style="width:48px;height:48px;border-radius:12px;" />
          </div>
          <h1 style="font-size:24px;font-weight:800;color:#111;text-align:center;margin:0 0 8px;">Recupero Accesso</h1>
          <p style="color:#666;text-align:center;margin:0 0 24px;font-size:15px;line-height:1.5;">
            Usa il codice qui sotto per reimpostare la tua password. Il codice scade tra <strong>5 minuti</strong>.
          </p>
          <div style="background:#f9f9f9;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#dc2743;font-family:monospace;">${code}</span>
          </div>
          <p style="color:#999;font-size:13px;text-align:center;margin:0;">Se non hai richiesto tu questo codice, ignora questa email.</p>
        </div>
      `;

      await resend.emails.send({
        from: "NextBrand <onboarding@resend.dev>",
        to: email,
        subject: "Il tuo codice di recupero NextBrand",
        html,
      });
    } catch (emailErr) {
      console.error("Send email failed:", emailErr);
    }

    return NextResponse.json(
      { message: "Se l'email esiste, riceverai un codice di verifica." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
