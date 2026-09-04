import React from 'react'
import useStore from '../store/useStore'
import { ROUTES, TAPES } from '../data/routes'
import { playClick } from '../audio/sound'

// The full tape rack — Caravan-style side panel. Shows the 4 curated music
// tapes (load into the YouTube-backed deck) AND the 6 region cassettes
// (unlocked as routes are visited; clicking one also drives the bus there).
export default function TapeRack() {
  const {
    showTapeRack, toggleTapeRack, loadTape, deckTape,
    exploredRoutes, currentRoute, setRoute, transitioning,
  } = useStore()

  if (!showTapeRack) return null

  return (
    <div style={styles.wrap}>
      <div style={styles.trimLine} />

      <div style={styles.header}>
        <div style={styles.brandBlock}>
          <div style={styles.brandRow}>
            <span style={styles.brand}>SONY</span>
            <span style={styles.brandModel}>ICF-SW7600</span>
          </div>
          <div style={styles.title}>TAPE RACK · தட்டு அடுக்கு</div>
        </div>
        <button style={styles.closeBtn} onClick={() => { playClick(); toggleTapeRack() }}>✕</button>
      </div>

      <div style={styles.section}>MUSIC TAPES</div>
      <div style={styles.grid}>
        {TAPES.map((tape) => {
          const active = deckTape?.id === tape.id
          return (
            <div
              key={tape.id}
              onClick={() => loadTape(tape)}
              title={`Load ${tape.labelEng}`}
              style={{
                ...styles.cassette,
                borderColor: active ? '#F3C94B' : '#0a0a0a',
                boxShadow: active
                  ? '0 0 12px rgba(243,201,75,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <div style={styles.cassetteWindow}>
                <div style={styles.reelRow}>
                  <span style={styles.miniReel} />
                  <span style={styles.miniReel} />
                </div>
              </div>
              <div style={{ ...styles.cassetteName, color: tape.accent }}>{tape.labelEng}</div>
              <div style={styles.cassetteNameT}>{tape.label}</div>
              <div style={styles.cassetteMeta}>SIDE {tape.side} · {tape.era}</div>
              {active && <span style={styles.playing}>▶ IN DECK</span>}
            </div>
          )
        })}
      </div>

      <div style={styles.section}>REGION CASSETTES</div>
      <div style={styles.grid}>
        {ROUTES.map((r, i) => {
          const unlocked = exploredRoutes.has(i)
          const active = currentRoute === i
          return (
            <div
              key={i}
              onClick={() => unlocked && !transitioning && setRoute(i)}
              title={unlocked ? `Drive to ${r.name}` : 'Not yet visited'}
              style={{
                ...styles.cassette,
                borderColor: active ? '#F3C94B' : unlocked ? 'rgba(46,139,87,0.55)' : '#0a0a0a',
                opacity: unlocked ? 1 : 0.4,
                cursor: unlocked ? 'pointer' : 'default',
              }}
            >
              <div style={styles.cassetteWindow}>
                <div style={styles.reelRow}>
                  <span style={styles.miniReel} />
                  <span style={styles.miniReel} />
                </div>
              </div>
              <div style={styles.cassetteName}>{r.name.toUpperCase()}</div>
              <div style={styles.cassetteNameT}>{r.nameT}</div>
              {!unlocked && <span style={styles.lock}>🔒</span>}
              {unlocked && active && <span style={styles.playing}>▶ NOW</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Brushed-metal receiver panel, matching the redesigned bottom radio bar —
// graphite gradient body, chrome trim, and cassette cards styled like actual
// cassette shells set into a rack rather than flat toolbar chips.
const styles = {
  wrap: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 'min(210px, calc(100vw - 32px))',
    maxHeight: 'calc(100vh - 280px)',
    overflowY: 'auto',
    background: 'linear-gradient(180deg, #4a4d52 0%, #34363a 30%, #232427 100%)',
    border: '1px solid #17181a',
    borderTop: '1px solid #6a6d72',
    borderRadius: 8,
    padding: 12,
    zIndex: 55,
    boxShadow: '0 10px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  trimLine: {
    position: 'absolute', top: 6, left: 10, right: 10, height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(216,155,36,0.5) 20%, rgba(216,155,36,0.5) 80%, transparent)',
    pointerEvents: 'none',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, marginTop: 4 },
  brandBlock: { display: 'flex', flexDirection: 'column', gap: 1 },
  brandRow: { display: 'flex', alignItems: 'baseline', gap: 5 },
  brand: {
    fontFamily: "'Arial Narrow', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 12, fontWeight: 800, fontStyle: 'italic', color: '#eceef0', letterSpacing: 0.5,
    textShadow: '0 1px 0 rgba(0,0,0,0.7)',
  },
  brandModel: {
    fontFamily: "'Courier Prime', monospace", fontSize: 7, fontWeight: 700,
    color: '#D89B24', letterSpacing: 1,
  },
  title: {
    fontFamily: "'Courier Prime', monospace", fontSize: 8, fontWeight: 700, color: '#9a9da2',
    letterSpacing: 1, marginTop: 3,
  },
  closeBtn: {
    background: 'linear-gradient(180deg, #3a3c40 0%, #202124 100%)',
    border: '1px solid #17181a', borderTop: '1px solid #5a5d62', borderRadius: '50%',
    width: 22, height: 22, color: '#D89B24', cursor: 'pointer', fontSize: 10,
    boxShadow: '0 2px 0 #0a0a0a',
  },
  section: {
    fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#7d8085', fontWeight: 700,
    letterSpacing: 2, marginTop: 10, marginBottom: 6, borderTop: '1px solid rgba(0,0,0,0.4)', paddingTop: 8,
  },
  grid: { display: 'flex', flexDirection: 'column', gap: 6 },
  cassette: {
    position: 'relative', border: '1px solid #0a0a0a', borderRadius: 4,
    padding: '6px 8px',
    background: 'linear-gradient(165deg, #202124 0%, #17181a 100%)',
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  cassetteWindow: {
    background: '#0a0a0a', borderRadius: 3, padding: '3px 4px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)',
  },
  reelRow: { display: 'flex', justifyContent: 'space-between', padding: '0 6px' },
  miniReel: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%, #8a8d92 0%, #2a2b2e 75%)',
    border: '1px solid #5a5d62',
  },
  cassetteName: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#D89B24',
    fontWeight: 700, letterSpacing: 0.5, marginTop: 4,
  },
  cassetteNameT: { fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 7, color: '#8a8d92' },
  cassetteMeta: { fontFamily: "'Courier Prime', monospace", fontSize: 6, color: '#6a6d72', marginTop: 2, letterSpacing: 1 },
  lock: { position: 'absolute', top: 4, right: 5, fontSize: 8 },
  playing: {
    fontFamily: "'Courier Prime', monospace", fontSize: 7, color: '#F3C94B', display: 'block', marginTop: 2,
  },
}
