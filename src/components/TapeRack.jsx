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
    <div className="desktop-only" style={styles.wrap}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>TAPE RACK</div>
          <div style={styles.titleT}>தட்டு அடுக்கு</div>
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
                background: tape.color,
                borderColor: active ? tape.accent : 'rgba(255,255,255,0.1)',
                boxShadow: active ? `0 0 12px ${tape.accent}55` : 'none',
              }}
            >
              <div style={styles.reelRow}>
                <span style={styles.miniReel} />
                <span style={styles.miniReel} />
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
                background: '#151515',
                borderColor: active ? '#F3C94B' : unlocked ? 'rgba(46,139,87,0.55)' : 'rgba(255,255,255,0.08)',
                opacity: unlocked ? 1 : 0.35,
                cursor: unlocked ? 'pointer' : 'default',
              }}
            >
              <div style={styles.reelRow}>
                <span style={styles.miniReel} />
                <span style={styles.miniReel} />
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

const styles = {
  wrap: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 200,
    maxHeight: 'calc(100vh - 280px)',
    overflowY: 'auto',
    background: 'rgba(6,6,6,0.95)',
    border: '1px solid rgba(216,155,36,0.4)',
    borderRadius: 8,
    padding: 12,
    zIndex: 55,
    boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  title: { fontFamily: "'Courier Prime', monospace", fontSize: 11, fontWeight: 700, color: '#D89B24', letterSpacing: 2 },
  titleT: { fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 9, color: '#666', marginTop: 1 },
  closeBtn: {
    background: 'none', border: '1px solid #333', borderRadius: '50%',
    width: 22, height: 22, color: '#666', cursor: 'pointer', fontSize: 10,
  },
  section: {
    fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#444',
    letterSpacing: 2, marginTop: 10, marginBottom: 6, borderTop: '1px solid #1a1a1a', paddingTop: 8,
  },
  grid: { display: 'flex', flexDirection: 'column', gap: 6 },
  cassette: {
    position: 'relative', border: '1px solid #333', borderRadius: 4,
    padding: '6px 8px', cursor: 'pointer', transition: 'all 0.2s ease',
  },
  reelRow: { display: 'flex', justifyContent: 'space-between', padding: '0 4px' },
  miniReel: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'radial-gradient(circle, #444 0%, #111 70%)', border: '1px solid #555',
  },
  cassetteName: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#D89B24',
    fontWeight: 700, letterSpacing: 0.5, marginTop: 4,
  },
  cassetteNameT: { fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 7, color: '#888' },
  cassetteMeta: { fontFamily: "'Courier Prime', monospace", fontSize: 6, color: '#555', marginTop: 2, letterSpacing: 1 },
  lock: { position: 'absolute', top: 4, right: 5, fontSize: 8 },
  playing: {
    fontFamily: "'Courier Prime', monospace", fontSize: 7, color: '#F3C94B', display: 'block', marginTop: 2,
  },
}
