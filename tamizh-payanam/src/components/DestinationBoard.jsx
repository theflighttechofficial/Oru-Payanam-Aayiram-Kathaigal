import React, { useState, useEffect } from 'react'
import useStore from '../store/useStore'

export default function DestinationBoard({ route }) {
  const { transitioning } = useStore()
  const [displayed, setDisplayed] = useState(route.board)
  const [displayedT, setDisplayedT] = useState(route.boardT)
  // Split-flap arrival-board flip: 'down' rotates the current card away
  // (hinge at the bottom, like the real thing), then at the exact moment
  // it's edge-on and invisible the text swaps underneath and 'up' rotates
  // the new card back into view.
  const [flipPhase, setFlipPhase] = useState('idle')

  useEffect(() => {
    if (transitioning) {
      setFlipPhase('down')
      const t1 = setTimeout(() => {
        setDisplayed(route.board)
        setDisplayedT(route.boardT)
        setFlipPhase('up')
      }, 420)
      const t2 = setTimeout(() => setFlipPhase('idle'), 840)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [transitioning, route])

  const flipping = flipPhase !== 'idle'

  return (
    <div style={styles.wrap}>
      {/* Tamil Nadu emblem / TNSTC header */}
      <div style={styles.header}>
        <span style={styles.headerText}>TNSTC · VILLUPURAM REGION · அரசுப் போக்குவரத்துக்கழகம்</span>
      </div>

      {/* Main route display — split-flap card flip, airport arrival board style */}
      <div style={styles.flipViewport}>
        <div style={{
          ...styles.mainBoard,
          transform: `rotateX(${flipPhase === 'down' ? '-90deg' : '0deg'})`,
          transition: flipping ? 'transform 0.42s cubic-bezier(0.6, 0, 0.85, 0.35)' : 'none',
        }}>
          <span style={styles.routeText}>{displayed}</span>
          {/* Center crease + sheen — sells the physical split-flap card look */}
          <div style={styles.flipCrease} />
          <div style={{ ...styles.flipSheen, opacity: flipping ? 0.35 : 0 }} />
        </div>
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
  flipViewport: {
    perspective: 300,
  },
  mainBoard: {
    position: 'relative',
    minHeight: 32,
    transformOrigin: 'center bottom',
    backfaceVisibility: 'hidden',
    willChange: 'transform',
  },
  flipCrease: {
    position: 'absolute',
    left: 0, right: 0, top: '50%',
    height: 1,
    background: 'rgba(0,0,0,0.5)',
    pointerEvents: 'none',
  },
  flipSheen: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
    transition: 'opacity 0.15s ease',
    pointerEvents: 'none',
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
