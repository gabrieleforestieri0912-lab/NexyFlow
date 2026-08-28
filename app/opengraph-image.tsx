import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Nexyflow - Analisi Social Media con AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #09090f 0%, #1a0b17 55%, #2b0a1e 100%)',
          color: '#ffffff',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            N
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Nexyflow
          </div>
        </div>
        <div
          style={{
            fontSize: '36px',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          Analisi Social Media con AI per Instagram, TikTok e YouTube
        </div>
      </div>
    ),
    { ...size }
  )
}
