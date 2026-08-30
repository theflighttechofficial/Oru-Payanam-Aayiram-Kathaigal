import React from 'react'
import useStore from '../store/useStore'

export default function Road() {
  const { transitPhase, engineOn } = useStore()
  const isMoving = transitPhase === 'moving'

  return (
    <div style={styles.road}>
      {/* Road surface */}
      <div style={styles.surface} />

      {/* Center dashes - animated when bus is moving */}
      <div
        style={{
          ...styles.dashLine,
          animationDuration: isMoving ? '0.7s' : '2.6s',
          animationPlayState: engineOn ? 'running' : 'paused',
        }}
      />

      {/* Edge stripe */}
      <div style={styles.edgeLeft} />
      <div style={styles.edgeRight} />

      {/* Road texture dots */}
      {[60,160,280,400,520,640,760,880,1000,1120].map(left => (
        <div key={left} style={{ ...styles.pebble, left }} />
      ))}

      {/* Wet-road sheen — after light rain, per the intended scene mood */}
      <div style={styles.wetSheen} />
      <div style={styles.puddleGlow1} />
      <div style={styles.puddleGlow2} />
    </div>
  )
}

const styles = {
  road: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 92,
    zIndex: 2,
    overflow: 'hidden',
  },
  surface: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, #181818 0%, #131313 100%)',
  },
  dashLine: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    height: 4,
    backgroundImage: 'repeating-linear-gradient(90deg, #F3C94B 0, #F3C94B 40px, transparent 40px, transparent 90px)',
    animation: 'roadScroll 0.7s linear infinite',
    opacity: 0.6,
  },
  edgeLeft: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    height: 2,
    background: '#333',
  },
  edgeRight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    background: '#0a0a0a',
  },
  pebble: {
    position: 'absolute',
    top: 60,
    width: 3,
    height: 2,
    background: '#222',
    borderRadius: 1,
    opacity: 0.5,
  },
  wetSheen: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(120,150,200,0.05) 0%, rgba(80,110,160,0.08) 40%, rgba(40,60,90,0.03) 100%)',
    pointerEvents: 'none',
  },
  puddleGlow1: {
    position: 'absolute',
    left: '22%',
    top: 30,
    width: 140,
    height: 8,
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(216,155,36,0.12) 0%, transparent 75%)',
    pointerEvents: 'none',
  },
  puddleGlow2: {
    position: 'absolute',
    left: '68%',
    top: 50,
    width: 100,
    height: 6,
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(120,150,220,0.1) 0%, transparent 75%)',
    pointerEvents: 'none',
  },
}
