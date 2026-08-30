import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'

const CHECKS = [
  'BUS ...................... OK',
  'ROAD ...................... OK',
  'RADIO ..................... OK',
  'HEADLIGHTS ................ OK',
  'TAPE RACK .................. OK',
]

export default function Intro() {
  const { booted, boot } = useStore()
  const [lines, setLines] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (booted) return
    if (lines < CHECKS.length) {
      const t = setTimeout(() => setLines(l => l + 1), 260)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setReady(true), 300)
      return () => clearTimeout(t)
    }
  }, [lines, booted])

  if (booted) return null

  return (
    <div style={styles.wrap}>
      <div style={styles.inner}>
        <div style={styles.brand}>TNSTC</div>
        <div style={styles.depot}>VILLUPURAM DEPOT · விழுப்புரம் நிலையம்</div>
        <div style={styles.checklist}>
          {CHECKS.slice(0, lines).map((c, i) => (
            <div key={i} style={styles.line}>{c}</div>
          ))}
        </div>
        {ready && (
          <>
            <div style={styles.readyLine}>READY FOR DEPARTURE</div>
            <button style={styles.startBtn} onClick={boot}>
              PRESS START TO BOARD
              <span style={styles.startSub}>பயணத்தைத் தொடங்கவும்</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'fixed', inset: 0, zIndex: 200,
    background: '#050705',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  inner: { textAlign: 'center', minWidth: 340 },
  brand: {
    fontFamily: "'Baloo Thambi 2', sans-serif",
    fontSize: 42, fontWeight: 800, color: '#D89B24', letterSpacing: 6,
    textShadow: '0 0 30px rgba(216,155,36,0.4)',
  },
  depot: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11, color: '#4a6a4a', letterSpacing: 2, marginTop: 6, marginBottom: 28,
  },
  checklist: { textAlign: 'left', display: 'inline-block' },
  line: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13, color: '#7acca0', letterSpacing: 1, marginBottom: 6,
  },
  readyLine: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13, color: '#F3C94B', letterSpacing: 3, marginTop: 18, marginBottom: 18,
    animation: 'pulseDot 1.2s ease infinite',
  },
  startBtn: {
    background: '#111',
    border: '2px solid #D89B24',
    borderRadius: 8,
    padding: '14px 30px',
    color: '#F3C94B',
    fontFamily: "'Baloo Thambi 2', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 3,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    boxShadow: '0 0 30px rgba(216,155,36,0.2)',
  },
  startSub: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 11, fontWeight: 400, letterSpacing: 1, color: '#8C9C7C',
  },
}
