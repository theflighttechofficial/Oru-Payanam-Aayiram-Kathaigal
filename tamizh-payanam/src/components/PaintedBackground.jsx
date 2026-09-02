import React, { useState, useEffect } from 'react'

// The site background is the supplied hand-painted Tamil Nadu night scene —
// a single static image, no motion, no per-route swapping. The image is a
// large hand-painted asset, so a gradient skeleton shows immediately underneath
// and the image itself fades in once it's actually decoded, instead of a blank/
// flash-of-empty-background on slower connections.
export default function PaintedBackground({ bright }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setLoaded(true)
    img.src = '/images/background2.png'
    if (img.complete) setLoaded(true)
  }, [])

  return (
    <div style={styles.wrap}>
      {/* Fallback gradient — visible immediately, sits behind the photo */}
      <div style={styles.skeleton} />
      <div style={{
        ...styles.image,
        opacity: loaded ? 1 : 0,
        filter: bright ? 'brightness(1.15) saturate(1.05)' : 'brightness(1) saturate(1)',
      }} />
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
  skeleton: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, #0A0F1C 0%, #131C2E 35%, #1C2A1E 70%, #0C0F0A 100%)',
  },
  image: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/images/background2.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center 35%',
    backgroundRepeat: 'no-repeat',
    transition: 'opacity 0.6s ease, filter 0.6s ease',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.4) 100%)',
    pointerEvents: 'none',
  },
}
