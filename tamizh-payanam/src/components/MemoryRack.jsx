import React from 'react'
import useStore from '../store/useStore'
import { ROUTES } from '../data/routes'

export default function MemoryRack() {
  const { exploredRoutes, currentRoute, setRoute, transitioning } = useStore()

  return (
    <div className="desktop-only" style={styles.wrap}>
      <div style={styles.label}>MEMORY RACK</div>
      <div style={styles.labelT}>நினைவு அடுக்கு</div>
      <div style={styles.list}>
        {ROUTES.map((r, i) => {
          const unlocked = exploredRoutes.has(i)
          const active = currentRoute === i
          return (
            <div
              key={i}
              onClick={() => unlocked && !transitioning && setRoute(i)}
              title={unlocked ? `Load ${r.name} cassette` : 'Not yet visited'}
              style={{
                ...styles.cassette,
                borderColor: active ? '#F3C94B' : unlocked ? 'rgba(46,139,87,0.55)' : 'rgba(255,255,255,0.08)',
                opacity: unlocked ? 1 : 0.35,
                cursor: unlocked ? 'pointer' : 'default',
              }}
            >
              <div style={{ ...styles.reelRow }}>
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
      <div style={styles.progress}>
        {exploredRoutes.size} / {ROUTES.length} COLLECTED
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    top: 330,
    right: 16,
    width: 178,
    background: 'rgba(8,8,8,0.85)',
    border: '1px solid rgba(216,155,36,0.3)',
    borderRadius: 8,
    padding: '10px 10px',
    zIndex: 28,
    boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
  },
  label: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 9, letterSpacing: 2, color: '#D89B24', textAlign: 'center', fontWeight: 700,
  },
  labelT: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 8, color: '#555', textAlign: 'center', marginBottom: 8,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 340, overflowY: 'auto' },
  cassette: {
    position: 'relative',
    background: '#151515',
    border: '1px solid #333',
    borderRadius: 4,
    padding: '5px 6px',
    transition: 'all 0.2s ease',
  },
  reelRow: { display: 'flex', justifyContent: 'space-between', padding: '0 4px' },
  miniReel: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'radial-gradient(circle, #444 0%, #111 70%)',
    border: '1px solid #555',
  },
  cassetteName: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 8, color: '#D89B24', fontWeight: 700, letterSpacing: 0.5, marginTop: 3,
  },
  cassetteNameT: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 7, color: '#666',
  },
  lock: { position: 'absolute', top: 4, right: 5, fontSize: 8 },
  playing: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 7, color: '#F3C94B', display: 'block', marginTop: 2,
  },
  progress: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 8, color: '#555', textAlign: 'center', marginTop: 8, letterSpacing: 1,
  },
}
