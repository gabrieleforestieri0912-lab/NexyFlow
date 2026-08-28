'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterTextProps {
  texts?: string[]
  text?: string
  speed?: number
  className?: string
  stop?: boolean
  onComplete?: () => void
}

export default function TypewriterText({ texts, text, speed = 120, className = '', stop = false, onComplete }: TypewriterTextProps) {
  const words = (texts || (text ? [text] : []))[0]?.split(' ') || []
  const [visibleIndex, setVisibleIndex] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (stop || words.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetta il testo quando l'animazione si ferma
      setVisibleIndex(words.length)
      completedRef.current = true
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- riavvia la digitazione
    setVisibleIndex(0)
    completedRef.current = false
    lastTimeRef.current = 0

    function animate(time: number) {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const delta = time - lastTimeRef.current

      if (delta >= speed) {
        lastTimeRef.current = time
        setVisibleIndex(prev => {
          const next = prev + 1
          if (next >= words.length && !completedRef.current) {
            completedRef.current = true
            setTimeout(() => onCompleteRef.current?.(), 0)
          }
          return Math.min(next, words.length)
        })
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [text ?? texts?.[0], speed, stop])

  return <span className={className}>{words.slice(0, visibleIndex).join(' ')}</span>
}
