import React from 'react'

// The site background is the supplied hand-painted Tamil Nadu night scene —
// a single static image, no motion, no per-route swapping.
export default function PaintedBackground() {
  return (
    <div style={styles.wrap}>
      <div style={styles.image} />
      <div style={styles.vignette} />
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    overflow: 'hidden',
    background: '#0C0F0A',
  },
  image: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/images/web-background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center 35%',
    backgroundRepeat: 'no-repeat',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.4) 100%)',
    pointerEvents: 'none',
  },
}
