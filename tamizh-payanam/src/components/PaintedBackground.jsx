import React from 'react'

// Landmark + light-warmth switched per route id (matches ROUTES order in data/routes.js)
const SCENE_CONFIGS = {
  0: { landmark: 'lighthouse', warmth: 0.9,  haze: '#1a2a3a' }, // Chennai — coastal
  1: { landmark: 'gopuram',    warmth: 0.55, haze: '#241535' }, // Thanjavur — temple town
  2: { landmark: 'gopuram',    warmth: 0.8,  haze: '#2a1810' }, // Madurai — temple city
  3: { landmark: 'lighthouse', warmth: 0.7,  haze: '#0e2438' }, // Kanyakumari — ocean tip
  4: { landmark: 'hills',      warmth: 0.35, haze: '#152515' }, // Nilgiris — misty hills
  5: { landmark: 'paddy',      warmth: 0.45, haze: '#18200c' }, // Cauvery Delta — paddy fields
}

// A wide, deterministic twinkling starfield — each star gets its own phase
// so the sky reads as alive rather than static dots.
const STARS = Array.from({ length: 90 }, (_, i) => {
  const seed = i * 137.508 // golden-angle scatter, deterministic + well spread
  const x = (seed * 3.7) % 100
  const y = ((seed * 5.3) % 62)
  const r = 0.5 + ((i * 13) % 10) / 10
  const delay = (i * 0.37) % 6
  const dur = 3 + (i % 5)
  return { x, y, r, delay, dur }
})

export default function PaintedBackground({ route }) {
  const cfg = SCENE_CONFIGS[route.id] || SCENE_CONFIGS[0]
  const [sky1, sky2, sky3, skyBase] = route.sky

  return (
    <div style={styles.wrap}>
      {/* ── Deep sky with real depth (three-stop vertical gradient + radial warmth near horizon) ── */}
      <div style={{
        ...styles.sky,
        background: `
          radial-gradient(ellipse 60% 40% at 50% 100%, ${cfg.haze}88 0%, transparent 70%),
          linear-gradient(180deg, ${sky1} 0%, ${sky2} 38%, ${sky3} 72%, ${skyBase} 100%)
        `,
        transition: 'background 1.8s ease',
      }} />

      <svg viewBox="0 0 1600 900" preserveAspectRatio="none" style={styles.svg}>
        <defs>
          <filter id="painterly" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id="moonBody" cx="35%" cy="32%">
            <stop offset="0%" stopColor="#fffdf0" />
            <stop offset="55%" stopColor={route.moonColor} />
            <stop offset="100%" stopColor={route.moonColor} stopOpacity="0.85" />
          </radialGradient>
          <radialGradient id="moonHalo" cx="50%" cy="50%">
            <stop offset="0%" stopColor={route.moonColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={route.moonColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="roadWet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={route.moonColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={route.moonColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Twinkling starfield ── */}
        <g>
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x * 16} cy={s.y * 9} r={s.r}
              fill="#fff"
              style={{ animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }}
            />
          ))}
        </g>

        {/* ── Distant city glow on the horizon ── */}
        <ellipse cx="800" cy="640" rx="900" ry="70" fill={route.moonColor} opacity="0.05" />

        {/* ── Moon: halo + body + craters, painterly filter applied ── */}
        <g filter="url(#painterly)">
          <circle cx="1310" cy="130" r="170" fill="url(#moonHalo)" />
          <circle cx="1310" cy="130" r="92" fill="url(#moonBody)" />
          <circle cx="1284" cy="102" r="9"  fill={route.moonColor} opacity="0.35" />
          <circle cx="1338" cy="140" r="6"  fill={route.moonColor} opacity="0.25" />
          <circle cx="1298" cy="158" r="7"  fill={route.moonColor} opacity="0.3" />
        </g>

        {/* ── Landmark silhouette, painterly filter for organic edges ── */}
        <g filter="url(#painterly)" opacity="0.85">
          {cfg.landmark === 'gopuram' && <Gopuram />}
          {cfg.landmark === 'lighthouse' && <Lighthouse />}
          {cfg.landmark === 'hills' && <MistyHills />}
          {cfg.landmark === 'paddy' && <PaddyFields />}
        </g>

        {/* ── Coconut palms, left and right edges ── */}
        <g filter="url(#painterly)" opacity="0.75">
          <Palm x={90}   y={520} scale={1.1} />
          <Palm x={230}  y={480} scale={0.85} />
          <Palm x={1490} y={540} scale={1} />
        </g>

        {/* ── Ashok Leyland truck — painted decorative panels ── */}
        <g filter="url(#painterly)" opacity="0.5">
          <TruckSilhouette />
        </g>

        {/* ── Tea shop — warm light spilling out ── */}
        <TeaShop warmth={cfg.warmth} />

        {/* ── Tamil cinema poster on a wall ── */}
        <CinemaPoster />

        {/* ── String festival lights, pulsing ── */}
        <g>
          <path d="M 40,260 Q 400,220 800,255 Q 1200,215 1560,260" fill="none" stroke="#3a3a3a" strokeWidth="1.2" opacity="0.5" />
          {Array.from({ length: 26 }).map((_, i) => {
            const t = i / 25
            const x = 40 + t * 1520
            const y = 260 - Math.sin(t * Math.PI) * 40 + (i % 2 === 0 ? -4 : 6)
            const colors = ['#F3C94B', '#cc2222', '#2E8B57', '#D89B24', '#8C3026']
            return (
              <circle key={i} cx={x} cy={y} r="4"
                fill={colors[i % colors.length]}
                style={{ animation: `bulbPulse ${1.6 + (i % 4) * 0.3}s ease-in-out ${i * 0.12}s infinite` }}
              />
            )
          })}
        </g>

        {/* ── Wet asphalt reflection strip near the bottom ── */}
        <rect x="0" y="760" width="1600" height="140" fill="url(#roadWet)" />
      </svg>

      {/* ── Vignette to focus attention toward centre ── */}
      <div style={styles.vignette} />
    </div>
  )
}

function Gopuram() {
  return (
    <g transform="translate(1140,90)">
      <rect x="0" y="0" width="130" height="560" fill="#1a1230" />
      {Array.from({ length: 11 }).map((_, tier) => (
        <rect key={tier} x={tier * 3} y={tier * 32} width={130 - tier * 6} height="34"
          fill={tier % 2 === 0 ? '#251840' : '#1e1535'} />
      ))}
      <rect x="45" y="-38" width="40" height="36" rx="6" fill="#251840" />
      <rect x="55" y="-58" width="20" height="24" rx="4" fill="#1e1535" />
      <ellipse cx="65" cy="-64" rx="7" ry="8" fill="#D89B24" />
      {[30, 65, 100].map((cx) => (
        <circle key={cx} cx={cx} cy="20" r="3.5" fill="#F3C94B" opacity="0.7"
          style={{ animation: 'bulbPulse 2.4s ease-in-out infinite' }} />
      ))}
    </g>
  )
}

function Lighthouse() {
  return (
    <g transform="translate(1370,140)">
      <rect x="0" y="0" width="40" height="300" fill="#1a2030" />
      <rect x="-6" y="-18" width="52" height="26" rx="4" fill="#253040" />
      <circle cx="20" cy="-5" r="10" fill="#F3C94B" opacity="0.6" style={{ animation: 'bulbPulse 2s ease-in-out infinite' }} />
      <circle cx="20" cy="-5" r="5" fill="#fff" opacity="0.7" />
      {[40, 74, 108, 142].map((y) => (
        <rect key={y} x="2" y={y} width="36" height="28" fill="#cc3322" opacity="0.5" />
      ))}
    </g>
  )
}

function MistyHills() {
  return (
    <g transform="translate(950,300)">
      <ellipse cx="0" cy="260" rx="340" ry="140" fill="#0d1a10" opacity="0.7" />
      <ellipse cx="220" cy="290" rx="260" ry="110" fill="#0a1508" opacity="0.6" />
      <ellipse cx="80" cy="330" rx="500" ry="60" fill="#12251a" opacity="0.5" />
    </g>
  )
}

function PaddyFields() {
  return (
    <g transform="translate(700,600)">
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={-600} y1={i * 14} x2={900} y2={i * 14 - 40} stroke="#1c2208" strokeWidth="2" opacity="0.4" />
      ))}
    </g>
  )
}

function Palm({ x, y, scale }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M0,0 C -6,40 4,90 -3,160" stroke="#2a1f0e" strokeWidth="9" fill="none" />
      {[-70, -35, 0, 35, 70].map((rot, i) => (
        <ellipse key={i} cx="0" cy="0" rx="55" ry="16" fill="#0e2413"
          transform={`rotate(${rot})`} opacity="0.85" />
      ))}
      <circle cx="10" cy="8" r="7" fill="#2a1f0e" />
      <circle cx="-8" cy="6" r="6" fill="#2a1f0e" />
    </g>
  )
}

function TruckSilhouette() {
  return (
    <g transform="translate(880,540)">
      <rect x="0" y="0" width="320" height="110" fill="#1a0f05" rx="6" />
      <rect x="250" y="-40" width="95" height="105" fill="#1a0f05" rx="5" />
      <rect x="258" y="-32" width="78" height="58" fill="#0a1808" rx="3" stroke="#1a3510" strokeWidth="1" />
      <text x="140" y="60" textAnchor="middle" fill="#8C3026" fontFamily="Courier Prime" fontSize="13" fontWeight="700" opacity="0.85">ASHOK LEYLAND</text>
      <text x="140" y="82" textAnchor="middle" fill="#D89B24" fontFamily="Noto Sans Tamil" fontSize="11" opacity="0.7">தமிழ் நாடு</text>
      {[40, 90, 140, 190, 240].map((cx) => (
        <circle key={cx} cx={cx} cy="98" r="5" fill="none" stroke="#D89B24" strokeWidth="0.8" opacity="0.4" />
      ))}
      <circle cx="55" cy="112" r="26" fill="#111" stroke="#333" strokeWidth="2" />
      <circle cx="270" cy="112" r="26" fill="#111" stroke="#333" strokeWidth="2" />
    </g>
  )
}

function TeaShop({ warmth }) {
  return (
    <g transform="translate(120,560)" opacity={0.55 + warmth * 0.2}>
      <rect x="0" y="0" width="200" height="105" fill="#1a0f08" rx="4" />
      <rect x="-6" y="-14" width="212" height="18" fill="#3a1a08" rx="2" />
      <rect x="10" y="-10" width="184" height="26" fill="#0d0a06" rx="3" stroke="#D89B24" strokeWidth="0.5" />
      <text x="102" y="8" textAnchor="middle" fill="#D89B24" fontFamily="Noto Sans Tamil" fontSize="12" fontWeight="600">காபி கடை</text>
      <rect x="14" y="24" width="70" height="52" fill="#F3C94B" opacity={0.05 + warmth * 0.08} rx="3" />
      <rect x="96" y="24" width="70" height="52" fill="#F3C94B" opacity={0.04 + warmth * 0.06} rx="3" />
      <ellipse cx="102" cy="118" rx="90" ry="14" fill="#F3C94B" opacity={0.04 + warmth * 0.05} />
    </g>
  )
}

function CinemaPoster() {
  return (
    <g transform="translate(560,470)" opacity="0.7">
      <rect x="0" y="0" width="100" height="150" fill="#1a0808" rx="4" stroke="#8C3026" strokeWidth="1" />
      <rect x="4" y="4" width="92" height="98" fill="#2d1515" />
      <ellipse cx="48" cy="40" rx="15" ry="19" fill="#0d0808" />
      <rect x="36" y="56" width="24" height="36" fill="#0d0808" rx="2" />
      <rect x="4" y="106" width="92" height="20" fill="#cc2222" />
      <text x="50" y="120" textAnchor="middle" fill="#fff" fontFamily="Noto Sans Tamil" fontSize="9" fontWeight="700">சூப்பர் ஸ்டார்</text>
      <text x="50" y="142" textAnchor="middle" fill="#D89B24" fontFamily="Courier Prime" fontSize="9">★ 1983 ★</text>
    </g>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    overflow: 'hidden',
  },
  sky: {
    position: 'absolute',
    inset: 0,
  },
  svg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)',
    pointerEvents: 'none',
  },
}
