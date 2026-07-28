import { Resend } from 'resend'

const resendKey = process.env.RESEND_API_KEY
const resend = resendKey ? new Resend(resendKey) : null
const from = 'NextBrand <onboarding@resend.dev>'

export async function sendWelcomeEmail(name: string, email: string) {
  if (!resend) return
  try {
    await resend.emails.send({
      from,
      to: email,
      subject: 'Benvenuto su NextBrand! 🚀',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2743, #f97316); padding: 40px 24px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Benvenuto su NextBrand!</h1>
          </div>
          <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Ciao <strong>${name}</strong>,</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Grazie per esserti registrato su NextBrand! Siamo entusiasti di aiutarti a far crescere la tua presenza sui social media con l'intelligenza artificiale.
            </p>
            <div style="margin: 32px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                 style="background: linear-gradient(135deg, #dc2743, #f97316); color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;">
                Vai alla Dashboard
              </a>
            </div>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
              <p style="color: #6b7280; font-size: 14px;">Ecco cosa puoi fare subito:</p>
              <ul style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                <li>Connetti i tuoi profili Instagram, TikTok e YouTube</li>
                <li>Analizza le tue performance con la dashboard</li>
                <li>Chiedi consigli alla nostra AI nella chat</li>
                <li>Genera contenuti virali con l'AI</li>
              </ul>
            </div>
          </div>
          <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 12px;">
            <p>© 2026 NextBrand. Tutti i diritti riservati.</p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendWeeklyReport(name: string, email: string, stats: { followers: number; views: number; engagement: number; growth: number }) {
  if (!resend) return
  try {
    await resend.emails.send({
      from,
      to: email,
      subject: 'Il tuo report settimanale NextBrand 📊',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2743, #f97316); padding: 40px 24px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Report Settimanale</h1>
            <p style="color: rgba(255,255,255,0.8); margin-top: 8px;">Ciao ${name}, ecco il riepilogo della tua settimana</p>
          </div>
          <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 16px; text-align: center; background: #f9fafb; border-radius: 12px;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Followers</p>
                  <p style="color: #111827; font-size: 24px; font-weight: 700; margin: 4px 0;">${stats.followers.toLocaleString()}</p>
                </td>
                <td style="width: 12px;"></td>
                <td style="padding: 16px; text-align: center; background: #f9fafb; border-radius: 12px;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Views</p>
                  <p style="color: #111827; font-size: 24px; font-weight: 700; margin: 4px 0;">${stats.views.toLocaleString()}</p>
                </td>
              </tr>
              <tr><td colspan="3" style="height: 12px;"></td></tr>
              <tr>
                <td style="padding: 16px; text-align: center; background: #f9fafb; border-radius: 12px;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Engagement</p>
                  <p style="color: #111827; font-size: 24px; font-weight: 700; margin: 4px 0;">${stats.engagement}%</p>
                </td>
                <td style="width: 12px;"></td>
                <td style="padding: 16px; text-align: center; background: #f9fafb; border-radius: 12px;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Crescita</p>
                  <p style="color: #111827; font-size: 24px; font-weight: 700; margin: 4px 0;">+${stats.growth}%</p>
                </td>
              </tr>
            </table>
            <div style="margin-top: 32px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics" 
                 style="background: linear-gradient(135deg, #dc2743, #f97316); color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;">
                Vedi analisi complete
              </a>
            </div>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send weekly report:', error)
  }
}
