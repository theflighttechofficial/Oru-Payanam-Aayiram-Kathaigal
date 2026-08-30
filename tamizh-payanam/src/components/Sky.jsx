import React from 'react'

export default function Sky({ route, transitioning }) {
  const [c1, c2, c3, c4] = route.sky

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, ${c1} 0%, ${c2} 40%, ${c3} 70%, ${c4} 100%)`,
        transition: 'background 1.8s ease',
        zIndex: 0,
      }}
    />
  )
}
