'use client'

import { useEffect, useRef } from 'react'

export default function LiquidGlassCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const dupRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = document.getElementById('bg-video') as HTMLVideoElement | null
    const card = cardRef.current
    const dup = dupRef.current
    const canvas = canvasRef.current
    if (!video || !card || !dup || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DUP_PIXEL_RATIO = 1
    let lastW = 0
    let lastH = 0
    let raf = 0

    const frame = () => {
      const rect = card.getBoundingClientRect()
      const vw = document.documentElement.clientWidth
      const vh = document.documentElement.clientHeight

      if (rect.width && rect.height && video.videoWidth && video.videoHeight) {
        // Viewport-aligned duplicate: the filter's channel-separation bands fall
        // outside the card, leaving only clean refraction visible inside.
        dup.style.left = -rect.left + 'px'
        dup.style.top = -rect.top + 'px'
        dup.style.width = vw + 'px'
        dup.style.height = vh + 'px'

        // 1x even on retina: the SVG filter's cost scales with pixel count.
        const w = vw * DUP_PIXEL_RATIO
        const h = vh * DUP_PIXEL_RATIO
        if (w !== lastW || h !== lastH) {
          canvas.width = w
          canvas.height = h
          lastW = w
          lastH = h
        }

        try {
          const cover = Math.max(vw / video.videoWidth, vh / video.videoHeight)
          const sw = vw / cover
          const sh = vh / cover
          const sx = (video.videoWidth - sw) / 2
          const sy = (video.videoHeight - sh) / 2
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h)
        } catch {
          // frame may not be decodable yet
        }
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <aside ref={cardRef} className="glass-card" data-glass-card>
      <div ref={dupRef} className="glass-card__dup">
        <canvas ref={canvasRef} className="glass-card__canvas" />
      </div>
      <div className="glass-card__frost" aria-hidden="true" />
      <div className="glass-card__content">{children}</div>
    </aside>
  )
}
