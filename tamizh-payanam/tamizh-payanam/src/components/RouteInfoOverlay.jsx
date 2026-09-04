import React, { useState, useEffect } from 'react'

export default function RouteInfoOverlay({ route, phase }) {
  const [visible, setVisible] = useState(false)
  const [prevRoute, setPrevRoute] = useState(route.id)

  useEffect(() => {
    if (phase === 'arriving' && route.id !== prevRoute) {
      setPrevRoute(route.id)
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 4500)
      return () => clearTimeout(t)
    }
  }, [phase, route.id])

  if (!visible) return null

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Route label */}
        <div style={styles.routeLabel}>ARRIVED AT</div>

        {/* City name */}
        <div style={styles.cityEng}>{route.name.toUpperCase()}</div>
        <div style={styles.cityTamil}>{route.nameT}</div>

        <div style={styles.divider} />

        {/* Ambience tags */}
        <div style={styles.ambiences}>
          {route.ambience.map((a, i) => (
            <span key={i} style={styles.ambTag}>{a}</span>
          ))}
        </div>

        <div style={styles.divider} />

        {/* Highlights */}
        <div style={styles.highlights}>
          {route.highlights.map((h, i) => (
            <div key={i} style={styles.highlight}>
              <span style={styles.hlDot}>◆</span>
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Tap to dismiss */}
        <div style={styles.dismiss} onClick={() => setVisible(false)}>
          tap to continue →
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    bottom: 110,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 70,
    animation: 'arrivalSlide 0.5s ease',
  },
  card: {
    background: 'rgba(6,10,6,0.96)',
    border: '1px solid rgba(216,155,36,0.45)',
    borderRadius: 10,
    padding: '16px 28px',
    minWidth: 360,
    textAlign: 'center',
    boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 30px rgba(216,155,36,0.08)',
  },
  routeLabel: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 9,
    color: '#444',
    letterSpacing: 4,
    marginBottom: 6,
  },
  cityEng: {
    fontFamily: "'Baloo Thambi 2', sans-serif",
    fontSize: 26,
    fontWeight: 800,
    color: '#F3C94B',
    letterSpacing: 3,
    lineHeight: 1,
  },
  cityTamil: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 16,
    color: '#D89B24',
    marginTop: 4,
  },
  divider: {
    borderTop: '1px solid #1a2a1a',
    margin: '10px 0',
  },
  ambiences: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  ambTag: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    color: '#888',
    background: '#0e160e',
    border: '1px solid #1a2a1a',
    borderRadius: 3,
    padding: '3px 8px',
  },
  highlights: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-start',
  },
  highlight: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    color: '#666',
  },
  hlDot: {
    color: '#2E8B57',
    fontSize: 7,
  },
  dismiss: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 9,
    color: '#333',
    letterSpacing: 2,
    marginTop: 12,
    cursor: 'pointer',
  },
}
