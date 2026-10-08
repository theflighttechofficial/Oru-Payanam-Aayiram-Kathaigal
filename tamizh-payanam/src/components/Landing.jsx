import React, { useEffect, useRef, useState } from 'react'

const TITLE = 'TNSTC Caravan Villupuram'

export default function Landing({ onEnter }) {
  const frameRef = useRef()
  const [progress, setProgress] = useState({ t: 0, dur: 20 })

  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data
      if (d && d.showreel === 'time') setProgress({ t: d.t, dur: d.dur })
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const send = (msg) => frameRef.current?.contentWindow?.postMessage(msg, '*')
  const pct = Math.min(100, (progress.t / progress.dur) * 100)
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    send({ showreel: 'seek', t: ((e.clientX - r.left) / r.width) * progress.dur })
  }

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>{TITLE}</h1>
      <div style={styles.frameBox}>
        <iframe
          ref={frameRef}
          src="/showreel.html"
          title="Payanam showreel"
          style={styles.frame}
          allow="autoplay"
        />
      </div>
      <div style={styles.controls}>
        <button style={styles.btn} onClick={() => send({ showreel: 'replay' })}>↻ REPLAY</button>
        <div style={styles.track} onClick={seek} role="progressbar"
          aria-valuemin={0} aria-valuemax={progress.dur} aria-valuenow={Math.round(progress.t)}>
          <div style={{ ...styles.fill, width: `${pct}%` }} />
        </div>
        <span style={styles.time}>
          {progress.t.toFixed(0).padStart(2, '0')} / {progress.dur}s
        </span>
        <button style={styles.enter} onClick={onEnter}>
          BOARD THE BUS
          <span style={styles.enterSub}>பயணத்தைத் தொடங்கவும்</span>
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'fixed', inset: 0, zIndex: 300, background: '#07080F',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '18px 24px', gap: 14,
  },
  title: {
    margin: 0, fontFamily: "'Baloo Thambi 2', sans-serif", fontWeight: 800,
    fontSize: 'clamp(20px, 3vw, 38px)', letterSpacing: 4, color: '#D89B24',
    textShadow: '0 0 24px rgba(216,155,36,0.4)', textAlign: 'center',
  },
  frameBox: {
    flex: 1, minHeight: 0, width: '100%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  frame: {
    border: '1px solid rgba(216,155,36,0.3)', borderRadius: 8, background: '#000',
    aspectRatio: '16 / 9', maxWidth: '100%', maxHeight: '100%',
    width: 'min(100%, calc((100vh - 170px) * 16 / 9))',
  },
  controls: {
    display: 'flex', alignItems: 'center', gap: 14, width: 'min(100%, 1100px)',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  btn: {
    background: 'rgba(8,8,8,0.8)', border: '1px solid rgba(216,155,36,0.4)',
    color: '#D89B24', borderRadius: 6, padding: '8px 14px', cursor: 'pointer',
    fontFamily: "'Courier Prime', monospace", fontSize: 12, letterSpacing: 2,
  },
  track: {
    flex: '1 1 200px', height: 8, background: 'rgba(255,255,255,0.12)',
    borderRadius: 4, cursor: 'pointer', overflow: 'hidden',
  },
  fill: { height: '100%', background: '#FFB547' },
  time: {
    fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#8C9C7C', letterSpacing: 2,
  },
  enter: {
    background: '#D89B24', color: '#0a0a0a', border: 'none', borderRadius: 6,
    padding: '10px 20px', cursor: 'pointer', fontFamily: "'Courier Prime', monospace",
    fontSize: 13, fontWeight: 700, letterSpacing: 2, display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: 2,
  },
  enterSub: { fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 0 },
}
