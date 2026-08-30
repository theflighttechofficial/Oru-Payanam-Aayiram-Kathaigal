import React from 'react'

// Subtle vintage-screen treatment: scanlines, vignette, faint grain.
// Kept light so every panel and window stays fully readable.
export default function CRTOverlay() {
  return (
    <div style={styles.wrap} aria-hidden="true">
      <div style={styles.scanlines} />
      <div style={styles.vignette} />
      <svg style={styles.grain}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.025" />
      </svg>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'fixed',
    inset: 0,
    zIndex: 150,
    pointerEvents: 'none',
    mixBlendMode: 'normal',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
    opacity: 0.35,
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.35) 100%)',
  },
  grain: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
}
