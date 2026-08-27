import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'

const DOTS = []
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 5; c++) {
    DOTS.push([c * 18, r * 18])
  }
}

export default function Kolam() {
  const { booted, setActivePanel, showToast } = useStore()
  const [visible, setVisible] = useState(false)
  const [faded, setFaded] = useState(false)

  useEffect(() => {
    if (!booted) return
    const t1 = setTimeout(() => setVisible(true), 300)
    const t2 = setTimeout(() => setFaded(true), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [booted])

  if (!booted) return null

  return (
    <div
      className="dash-wrap-left"
      style={{
        position: 'absolute',
        left: 24,
        width: 90,
        height: 90,
        opacity: visible ? (faded ? 0.28 : 0.9) : 0,
        transition: 'opacity 1.2s ease',
        zIndex: 6,
        cursor: 'pointer',
      }}
      onClick={() => { setActivePanel('culture'); showToast('🪷 THE PATTERNS OF TAMIL NADU — கோலம்') }}
      title="Kolam — the patterns of Tamil Nadu"
    >
      <svg viewBox="0 0 90 90" width="100%" height="100%">
        {DOTS.map(([x, y], i) => (
          <circle key={i} cx={x + 9} cy={y + 9} r="1.3" fill="#F3C94B" opacity="0.5"
            style={{ animation: visible ? `kolamDot 0.4s ease ${i * 0.02}s both` : 'none' }} />
        ))}
        <path
          d="M9,45 Q45,9 81,45 Q45,81 9,45 Z M27,45 Q45,27 63,45 Q45,63 27,45 Z"
          fill="none" stroke="#F3C94B" strokeWidth="1.2" opacity="0.6"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: visible ? 0 : 300,
            transition: 'stroke-dashoffset 2.4s ease 0.3s',
          }}
        />
      </svg>
    </div>
  )
}
