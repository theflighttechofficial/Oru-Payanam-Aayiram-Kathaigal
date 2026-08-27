import React, { useState } from 'react'
import useStore from '../store/useStore'

export default function BusTicket({ route }) {
  const { exploredRoutes, showToast, printTicket } = useStore()
  const [flipped, setFlipped] = useState(false)
  const [clicks, setClicks] = useState(0)

  const explored = [...exploredRoutes]
  const totalRoutes = 6

  const handleClick = () => {
    setFlipped(!flipped)
    const n = clicks + 1
    setClicks(n)
    if (!flipped) {
      printTicket()
      if (n % 5 === 0) showToast('🎫 A ticket from another journey... — வேறொரு பயணத்தின் டிக்கெட்')
      else showToast(`உங்கள் பயணம் — ${explored.length}/${totalRoutes} இடங்கள்`)
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        ...styles.wrap,
        transform: flipped ? 'rotate(1deg) translateY(-4px)' : 'rotate(-0.5deg)',
      }}
    >
      {!flipped ? (
        // Front of ticket
        <>
          <div style={styles.header}>
            <div style={styles.logo}>அரசுப் போக்குவரத்துக்கழகம்</div>
            <div style={styles.subLogo}>TNSTC · VILLUPURAM</div>
          </div>

          <div style={styles.divider} />

          <Row label="FROM" value="VILLUPURAM" />
          <Row label="TO" value={route.tktTo} />
          <Row label="ROUTE" value={route.routeNum} />
          <Row label="FARE" value={`₹ ${route.fare}`} />
          <Row label="CLASS" value={route.passType} />

          <div style={styles.divider} />

          <div style={styles.tamilBottom}>
            <span style={styles.tamilText}>{route.tktTamil}</span>
            <span style={styles.tapHint}>tap ↻</span>
          </div>

          {/* Perforation line */}
          <div style={styles.perf} />

          <div style={styles.barcode}>
            {Array(18).fill(0).map((_, i) => (
              <div key={i} style={{ ...styles.barcodeBar, width: i % 3 === 0 ? 3 : 1.5 }} />
            ))}
          </div>
        </>
      ) : (
        // Back of ticket — journey map
        <>
          <div style={styles.journeyHeader}>உங்கள் பயணம்</div>
          <div style={styles.journeySubhead}>YOUR JOURNEY</div>
          <div style={styles.divider} />
          {['Chennai','Thanjavur','Madurai','Kanyakumari','Nilgiris','Delta'].map((name, i) => (
            <div key={i} style={styles.journeyRow}>
              <span style={{
                ...styles.journeyDot,
                background: explored.includes(i) ? '#2E8B57' : '#222',
                border: explored.includes(i) ? '2px solid #F3C94B' : '2px solid #444',
              }} />
              <span style={{
                ...styles.journeyName,
                color: explored.includes(i) ? '#333' : '#aaa',
              }}>{name}</span>
              {explored.includes(i) && <span style={styles.tick}>✓</span>}
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.journeyProgress}>
            <div style={{ ...styles.progressBar, width: `${(explored.length / totalRoutes) * 100}%` }} />
          </div>
          <div style={styles.progressLabel}>{explored.length}/{totalRoutes} explored</div>
        </>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={styles.rowValue}>{value}</span>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    top: 80,
    right: 16,
    width: 178,
    background: '#F5EDD6',
    borderRadius: 4,
    padding: '10px 12px',
    zIndex: 30,
    boxShadow: '0 4px 24px rgba(0,0,0,0.6), 3px 3px 0 rgba(0,0,0,0.4)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  header: { textAlign: 'center', marginBottom: 6 },
  logo: { fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 9, color: '#8C3026', fontWeight: 700, lineHeight: 1.3 },
  subLogo: { fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#555', letterSpacing: 2, marginTop: 2 },
  divider: { borderTop: '1px dashed #bbb', margin: '6px 0' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: 3 },
  rowLabel: { fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#888', letterSpacing: 1 },
  rowValue: { fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#222', fontWeight: 700 },
  tamilBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tamilText: { fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 11, color: '#8C3026' },
  tapHint: { fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#bbb' },
  perf: { borderTop: '2px dotted #ccc', margin: '6px 0' },
  barcode: { display: 'flex', alignItems: 'flex-end', gap: 1, height: 18, justifyContent: 'center' },
  barcodeBar: { height: '100%', background: '#333', borderRadius: 0.5 },
  journeyHeader: { fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 12, color: '#8C3026', textAlign: 'center', fontWeight: 700 },
  journeySubhead: { fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#888', textAlign: 'center', letterSpacing: 2 },
  journeyRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  journeyDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  journeyName: { fontFamily: "'Courier Prime', monospace", fontSize: 9, flex: 1 },
  tick: { color: '#2E8B57', fontSize: 10, fontWeight: 700 },
  journeyProgress: { height: 4, background: '#ddd', borderRadius: 2, overflow: 'hidden', marginBottom: 3 },
  progressBar: { height: '100%', background: '#2E8B57', borderRadius: 2, transition: 'width 0.5s ease' },
  progressLabel: { fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#888', textAlign: 'center' },
}
