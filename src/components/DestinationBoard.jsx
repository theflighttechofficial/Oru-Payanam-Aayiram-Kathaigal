import React, { useState, useEffect } from 'react'
import useStore from '../store/useStore'

export default function DestinationBoard({ route }) {
  const { transitioning } = useStore()
  const [displayed, setDisplayed] = useState(route.board)
  const [displayedT, setDisplayedT] = useState(route.boardT)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (transitioning) {
      setFlipping(true)
      setTimeout(() => {
        setDisplayed(route.board)
        setDisplayedT(route.boardT)
        setFlipping(false)
      }, 900)
    }
  }, [transitioning, route])

  return (
    <div style={styles.wrap}>
      {/* Tamil Nadu emblem / TNSTC header */}
      <div style={styles.header}>
        <span style={styles.headerText}>TNSTC · VILLUPURAM REGION · அரசுப் போக்குவரத்துக்கழகம்</span>
      </div>

      {/* Main route display */}
      <div style={{
        ...styles.mainBoard,
        opacity: flipping ? 0.3 : 1,
        transform: flipping ? 'scaleY(0.85)' : 'scaleY(1)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        <span style={styles.routeText}>{displayed}</span>
      </div>

      {/* Tamil route text */}
      <div style={styles.tamilRow}>
        <span style={styles.tamilText}>{displayedT}</span>
        <span style={styles.routeNum}>ROUTE {route.routeNum}</span>
      </div>

      {/* Status LEDs */}
      <div style={styles.leds}>
        <div style={{ ...styles.led, background: transitioning ? '#cc2222' : '#2d8a2d' }} />
        <span style={styles.ledLabel}>{transitioning ? 'ON MOVE' : 'AT STAND'}</span>
        <div style={{ ...styles.led, background: '#D89B24', marginLeft: 12 }} />
        <span style={styles.ledLabel}>VLP</span>
      </div>

      {/* Nudge toward hiding the bus and playing music for the full nostalgic feel */}
      <div style={styles.musicHint}>🎵 பேருந்தை மறைத்து, கீழே உள்ள பட்டியில் இசையை இயக்கி பழைய நினைவுகளை மீட்டெடுங்கள் — hide the bus and play music from the player below to relive the nostalgia</div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#080808',
    border: '2px solid #D89B24',
    borderRadius: 8,
    padding: '8px 28px 6px',
    minWidth: 460,
    textAlign: 'center',
    boxShadow: '0 0 25px rgba(216,155,36,0.25), inset 0 0 20px rgba(0,0,0,0.6)',
    zIndex: 30,
  },
  musicHint: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: 8,
    width: 'min(90vw, 560px)',
    textAlign: 'center',
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: '#D89B24',
    opacity: 0.9,
    letterSpacing: 0.5,
    lineHeight: 1.4,
    pointerEvents: 'none',
    textShadow: '0 0 10px rgba(216,155,36,0.35), 0 2px 4px rgba(0,0,0,0.8)',
  },
  header: {
    borderBottom: '1px solid #333',
    paddingBottom: 4,
    marginBottom: 5,
  },
  headerText: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 9,
    letterSpacing: 2,
    color: '#555',
  },
  mainBoard: {
    minHeight: 32,
  },
  routeText: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 22,
    fontWeight: 700,
    color: '#F3C94B',
    letterSpacing: 2,
    textShadow: '0 0 12px rgba(243,201,75,0.5)',
    display: 'block',
  },
  tamilRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  tamilText: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 12,
    color: '#D89B24',
    letterSpacing: 1,
  },
  routeNum: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    color: '#555',
    letterSpacing: 2,
  },
  leds: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 5,
    borderTop: '1px solid #222',
    paddingTop: 4,
  },
  led: {
    width: 6, height: 6,
    borderRadius: '50%',
    boxShadow: '0 0 4px currentColor',
  },
  ledLabel: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 8,
    color: '#444',
    letterSpacing: 2,
  },
}
