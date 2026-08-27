import React from 'react'
import useStore from '../store/useStore'

/*
  AUTHENTIC TNSTC BUS — rebuilt from reference photos
  
  Key visual facts from references:
  - Body: light mint green (#5DC882 / #48C878)
  - Two dark forest-green DIAGONAL STRIPE BANDS (parallelogram shape, not rectangles)
    with a thin light-green highlight line through each stripe
  - Windows: tall rectangular, black iron bar grilles, continuous row
  - Stop name labels inside upper window area (yellow bg, Tamil text)
  - PINK/RED wheel hubs (very distinctive — not grey)
  - Roof rack: black steel frame + rear ladder
  - Front face: rounded cab, large windshield, 4-round-headlight cluster
  - Number plate: yellow bg, Tamil + English
  - அரசுப் போக்குவரத்துக்கழகம் - விழுப்புரம் written ONCE on lower body
  - Route number + EXPRESS badge in window strip area
*/

const MINT   = '#52C87A'   // light mint body
const MINT_D = '#3BA55C'   // slightly darker mint for shading
const DKGRN  = '#1B5E35'   // dark forest green stripes
const DKGRN2 = '#144D2A'   // deeper shade for stripe depth
const STRP_H = '#2D8A50'   // stripe highlight line
const GLASS  = '#0D2018'   // dark window glass
const GRILLE = '#111'      // window grille bars
const CREAM  = '#F5EDD6'   // text color on dark
const BRASS  = '#D89B24'   // gold/brass accent
const PINK_W = '#D9534F'   // pink/red wheel hubs (authentic!)
const BLACK  = '#0a0a0a'
const YELLOW = '#F0C000'   // number plate yellow

// Route board stops, back to front — matches the destination board window labels
const STOP_NAMES = [
  'சென்னை', 'விழுப்புரம்', 'கும்பகோணம்', 'தஞ்சாவூர்', 'மதுரை',
  'திருநெல்வேலி', 'கன்னியாகுமரி', 'தேனி', 'ஊட்டி',
]

export default function TNSTCBus({ route, moving }) {
  const {
    showToast, showStory, pressHorn, ringBell, transitPhase, hornPressed,
    headlightsOn, engineOn, leftIndicatorLit, rightIndicatorLit, clickMirror,
  } = useStore()
  const isMoving  = transitPhase === 'moving'
  const isCranking = transitPhase === 'cranking'
  const lightsOn = headlightsOn || isCranking || isMoving

  // ── bus dimensions ──
  // viewBox: 0 0 920 260
  // Body rect: x=10 y=40 w=840 h=165  → bottom at y=205
  // Roof: y=28 h=14
  // Wheels: cy=222 r=34

  const W = 920   // total svg width
  const BX = 10   // body left x
  const BY = 40   // body top y
  const BW = 840  // body width
  const BH = 165  // body height  → bottom y = BY+BH = 205
  const FRONT = BX + BW  // x=850 front of bus (right side in side view)
  const BACK  = BX        // x=10  back of bus (left side)
  const CAB_X = 786       // left edge of the front cab — stripes must stop before this

  // Stripe band positions (Y from top of body)
  // Upper stripe: covers window-to-body transition area
  // Lower stripe: on lower third of body
  // From reference: two thick dark bands with diagonal ends
  const S1Y = BY + 55   // upper stripe top  (y=95)
  const S1H = 18        // upper stripe height
  const S2Y = BY + 105  // lower stripe top  (y=145)
  const S2H = 20        // lower stripe height (thicker)

  // Window row: sits between roof and upper stripe
  const WIN_Y  = BY + 2   // window top y
  const WIN_H  = 52       // window height
  const WIN_BOT = WIN_Y + WIN_H  // y=94

  // Stop label strip (inside top of window area)
  const LABEL_Y = WIN_Y + 2
  const LABEL_H = 14

  return (
    <svg
      viewBox={`0 0 ${W} 260`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', filter: 'drop-shadow(0 14px 40px rgba(0,0,0,0.75))' }}
    >
      {/* ══════════════════════════════════════════════
          ROOF RACK  — black steel frame on top
      ══════════════════════════════════════════════ */}
      {/* Main longitudinal bars */}
      <rect x="80"  y="16" width="720" height="5"  rx="2" fill="#1a1a1a" />
      <rect x="80"  y="26" width="720" height="4"  rx="2" fill="#1a1a1a" />
      {/* Cross bars */}
      {[110,170,230,290,350,410,470,530,590,650,710,760].map(x => (
        <rect key={x} x={x} y="16" width="3" height="16" rx="1" fill="#222" />
      ))}
      {/* Side uprights */}
      <rect x="80"  y="14" width="5" height="28" rx="2" fill="#1a1a1a" />
      <rect x="796" y="14" width="5" height="28" rx="2" fill="#1a1a1a" />

      {/* Fleet number badge — fictional bus identity, distinct from route number */}
      <rect x="742" y="10" width="30" height="12" rx="2" fill="#0a0a0a" opacity="0.85" />
      <text x="757" y="19" textAnchor="middle" fill={BRASS} fontFamily="Courier Prime" fontSize="7.5" fontWeight="700">439</text>

      {/* REAR LADDER — on back (left) end */}
      <rect x="62"  y="14" width="5" height="105" rx="2" fill="#1a1a1a" />
      <rect x="76"  y="14" width="5" height="105" rx="2" fill="#1a1a1a" />
      {[20,35,50,65,80,95].map(y => (
        <rect key={y} x="62" y={y} width="19" height="3" rx="1" fill="#222" />
      ))}

      {/* ══════════════════════════════════════════════
          BUS BODY — light mint green
      ══════════════════════════════════════════════ */}
      {/* Main body rectangle */}
      <rect x={BX} y={BY} width={BW} height={BH} rx="8" fill={MINT} />

      {/* Top edge darker band (roof-body join) */}
      <rect x={BX} y={BY} width={BW} height="8" rx="0" fill={MINT_D} />

      {/* ══════════════════════════════════════════════
          FRONT FACE  (right side in this left→right view)
          Widened cab: windshield / route board / grille /
          headlights / indicators / bumper — clearly layered
      ══════════════════════════════════════════════ */}
      {/* Front face panel */}
      <rect x="786" y={BY} width="70" height={BH} rx="8" fill={MINT_D} />
      <rect x="786" y={BY} width="70" height="6" fill={MINT_D} opacity="0.6" />

      {/* Front destination board — TNSTC + Tamil destination, mounted above the windshield like a real marquee */}
      <rect x="791" y={BY+2} width="60" height="19" rx="2" fill={BLACK} />
      <text x="821" y={BY+10} textAnchor="middle" fill="#7fb894" fontFamily="Courier Prime" fontSize="5.5" fontWeight="700" letterSpacing="1">TNSTC</text>
      <text x="821" y={BY+18.5} textAnchor="middle" fill={BRASS} fontFamily="Noto Sans Tamil" fontSize="6" fontWeight="700">{route.tktTo === 'OOTY' ? 'ஊட்டி' : route.nameT}</text>

      {/* Front windshield - starts clear below the marquee board, no overlap */}
      <polygon points="796,64 852,64 858,74 858,116 796,116" fill={GLASS} />
      <polygon points="796,64 852,64 858,74 858,116 796,116" fill="none" stroke="#1a4a2a" strokeWidth="2" />
      {/* Driver silhouette — subtle, visible through the windshield */}
      <g
        style={{ cursor: 'pointer' }}
        onClick={() => showToast("👤 THE DRIVER'S VIEW — road, dashboard, destination")}
      >
        <ellipse cx="812" cy="90" rx="7" ry="8" fill="#050a08" opacity="0.55" />
        <path d="M801,112 Q812,98 823,112 L823,116 L801,116 Z" fill="#050a08" opacity="0.5" />
      </g>

      {/* Windshield glare streak */}
      <polygon points="800,68 812,68 808,110 796,110" fill="#fff" opacity="0.05" />
      {/* Wiper */}
      <line x1="800" y1="112" x2="836" y2="72" stroke="#222" strokeWidth="1.5" opacity="0.6" />

      {/* Front grille — below windshield, clear gap from glass */}
      <rect x="792" y="124" width="56" height="26" rx="3" fill={DKGRN2} />
      {[798,807,816,825,834,843].map(x => (
        <rect key={x} x={x} y="127" width="2" height="20" rx="1" fill={BLACK} opacity="0.7" />
      ))}
      {/* TNSTC emblem circle centered on grille */}
      <circle cx="820" cy="137" r="7" fill={BRASS} opacity="0.8" />
      <circle cx="820" cy="137" r="3.5" fill={DKGRN2} opacity="0.9" />

      {/* Headlight cluster — glow driven by lightsOn state, bright when on */}
      {[801, 814, 827].map((cx, i) => (
        <g key={i}>
          {lightsOn && <circle cx={cx} cy="163" r="15" fill="#FFF8D8" opacity="0.55" />}
          {lightsOn && <circle cx={cx} cy="163" r="9" fill="#FFFDE0" opacity="0.8" />}
          <circle cx={cx} cy="163" r="8" fill="#ccc" stroke="#999" strokeWidth="1.5" />
          <circle cx={cx} cy="163" r="5.5"
            fill={lightsOn ? '#FFFFF2' : '#aaa'}
            opacity={lightsOn ? 1 : 0.5}
          />
          <circle cx={cx} cy="163" r="8" fill="none" stroke={PINK_W} strokeWidth="1.2" />
        </g>
      ))}

      {/* Right (front) indicator — amber, bezel matches headlight cluster, blinks via store state */}
      <g style={{ cursor: 'pointer' }} onClick={() => { showToast('➡ Right indicator') }}>
        {rightIndicatorLit && <circle cx="843" cy="163" r="13" fill="#FFA500" opacity="0.3" />}
        <circle cx="843" cy="163" r="7" fill="#5a4a2a" stroke="#3a2a10" strokeWidth="1" />
        <circle cx="843" cy="163" r="4.5" fill={rightIndicatorLit ? '#FFA500' : '#5a3a10'} opacity={rightIndicatorLit ? 1 : 0.6} />
      </g>

      {/* Front bumper */}
      <rect x="784" y="186" width="72" height="12" rx="3" fill={DKGRN2} />

      {/* Side mirror — easter egg: "Where we've been..." */}
      <g style={{ cursor: 'pointer' }} onClick={clickMirror}>
        <line x1="856" y1="60" x2="868" y2="48" stroke="#222" strokeWidth="2" />
        <rect x="866" y="40" width="14" height="10" rx="2" fill="#ccc" stroke="#333" strokeWidth="1" />
        <rect x="868" y="42" width="10" height="6" rx="1" fill="#8fd0ff" opacity="0.5" />
      </g>


      {/* ══════════════════════════════════════════════
          WINDOW ROW — large rectangular windows
          with black iron bar grilles (authentic)
      ══════════════════════════════════════════════ */}
      {/* Window backing strip (black) */}
      <rect x={BX+8} y={WIN_Y} width="764" height={WIN_H+2} rx="4" fill={BLACK} />

      {/* Individual windows with grilles — clicking one opens "Outside the Window"
          for that exact stop (the story matches the label sitting above it) */}
      {(() => {
        const wins = []
        // 9 windows from back to front: x=24 → x=754, width ~74 each, gap ~8
        const startX = 24
        const ww = 74   // window width
        const gap = 8
        for (let i = 0; i < 9; i++) {
          const wx = startX + i * (ww + gap)
          if (wx + ww > 782) break
          if (i === 0) continue // rear-most slot is the rear door, not a window
          const city = STOP_NAMES[i]
          wins.push(
            <g key={i} style={{ cursor: 'pointer' }}
              onClick={() => showStory(city)}>
              {/* Window glass */}
              <rect x={wx} y={WIN_Y+2} width={ww} height={WIN_H-2} rx="2" fill={GLASS} />
              {/* Iron bar grilles — 5 vertical bars per window */}
              {[0,1,2,3,4].map(b => (
                <rect key={b} x={wx + 12 + b*12} y={WIN_Y+2} width="2.5" height={WIN_H-2} rx="1" fill={GRILLE} opacity="0.9" />
              ))}
              {/* Glass reflection */}
              <rect x={wx+3} y={WIN_Y+4} width="10" height={WIN_H-14} rx="1" fill="#fff" opacity="0.03" />
              {/* Hover glow */}
              <rect x={wx} y={WIN_Y+2} width={ww} height={WIN_H-2} rx="2"
                fill="#F3C94B" opacity="0" className="win-glow"
              />
            </g>
          )
        }
        return wins
      })()}

      {/* Stop label strip — inside top of each window: cream bg with Tamil stop names */}
      {STOP_NAMES.map((text, i) => ({ x: 24 + i * 82, text })).map(({ x, text }, i) => (
        <g key={i}>
          <rect x={x+1} y={LABEL_Y} width="72" height={LABEL_H} rx="1" fill="#fffbe0" opacity="0.85" />
          <text x={x+37} y={LABEL_Y+10} textAnchor="middle" fill="#1a1a1a"
            fontFamily="Noto Sans Tamil" fontSize="6.5" fontWeight="600">
            {text}
          </text>
        </g>
      ))}

      {/* Route number + EXPRESS badge in window area (like ref image) */}
      <rect x="354" y={WIN_Y+16} width="40" height="14" rx="2" fill="#F0C000" />
      <text x="374" y={WIN_Y+26} textAnchor="middle" fill={BLACK}
        fontFamily="Courier Prime" fontSize="10" fontWeight="800">{route.routeNum}</text>
      <rect x="398" y={WIN_Y+16} width="56" height="14" rx="2" fill="#cc2222" />
      <text x="426" y={WIN_Y+26} textAnchor="middle" fill="#fff"
        fontFamily="Courier Prime" fontSize="8" fontWeight="700" letterSpacing="1">
        {route.passType === 'EXP' ? 'EXPRESS' : 'ORDINARY'}
      </text>

      {/* ══════════════════════════════════════════════
          DARK GREEN DIAGONAL STRIPE BANDS
          Authentic shape: parallelogram (diagonal cuts at ends)
          Two bands: upper thin, lower thick
      ══════════════════════════════════════════════ */}

      {/* ── UPPER STRIPE — stops cleanly before the cab, never crosses the windshield ── */}
      {/* Main stripe shape (parallelogram) */}
      <polygon
        points={`${BX},${S1Y} ${CAB_X-20},${S1Y} ${CAB_X-14},${S1Y+S1H} ${BX},${S1Y+S1H}`}
        fill={DKGRN}
      />
      {/* Highlight line through stripe */}
      <polygon
        points={`${BX},${S1Y+S1H/2-1} ${CAB_X-18},${S1Y+S1H/2-1} ${CAB_X-15},${S1Y+S1H/2+2} ${BX},${S1Y+S1H/2+2}`}
        fill={STRP_H} opacity="0.5"
      />
      {/* Stripe top edge highlight */}
      <polygon
        points={`${BX},${S1Y} ${CAB_X-20},${S1Y} ${CAB_X-18},${S1Y+2} ${BX},${S1Y+2}`}
        fill="#4aaa70" opacity="0.4"
      />

      {/* ── LOWER STRIPE (thicker) — same cab-safe boundary ── */}
      <polygon
        points={`${BX},${S2Y} ${CAB_X-20},${S2Y} ${CAB_X-12},${S2Y+S2H} ${BX},${S2Y+S2H}`}
        fill={DKGRN}
      />
      {/* Highlight line */}
      <polygon
        points={`${BX},${S2Y+S2H/2-1} ${CAB_X-17},${S2Y+S2H/2-1} ${CAB_X-14},${S2Y+S2H/2+2} ${BX},${S2Y+S2H/2+2}`}
        fill={STRP_H} opacity="0.5"
      />
      {/* Top edge highlight */}
      <polygon
        points={`${BX},${S2Y} ${CAB_X-20},${S2Y} ${CAB_X-18},${S2Y+2} ${BX},${S2Y+2}`}
        fill="#4aaa70" opacity="0.4"
      />

      {/* ══════════════════════════════════════════════
          BODY TEXT — once only, between the two stripes
          அரசுப் போக்குவரத்துக்கழகம் - விழுப்புரம்
      ══════════════════════════════════════════════ */}
      {/* Large Tamil text in the middle section between stripes */}
      <text
        x="400" y={S1Y + 33}
        textAnchor="middle"
        fill={DKGRN}
        fontFamily="Noto Sans Tamil"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.2"
        opacity="0.85"
      >
        அரசுப் போக்குவரத்துக்கழகம் - விழுப்புரம்
      </text>

      {/* ══════════════════════════════════════════════
          LOWER BODY (between lower stripe and underbody)
      ══════════════════════════════════════════════ */}
      {/* Underbody panel — slightly darker mint */}
      <rect x={BX} y={S2Y+S2H} width={BW} height={BY+BH - (S2Y+S2H)} rx="0" fill={MINT_D} />

      {/* Bottom sill */}
      <rect x={BX} y={BY+BH-6} width={BW} height="6" rx="0" fill={DKGRN2} />

      {/* ══════════════════════════════════════════════
          DOOR — between rear and mid, authentic TNSTC
      ══════════════════════════════════════════════ */}
      {/* Door opening */}
      <rect x="720" y={S1Y+S1H} width="60" height={BY+BH - (S1Y+S1H) - 6} rx="2" fill={DKGRN2} />
      {/* Door panels */}
      <rect x="722" y={S1Y+S1H+2} width="27" height={BY+BH - (S1Y+S1H) - 14} rx="1" fill="#1a3a22" />
      <rect x="751" y={S1Y+S1H+2} width="27" height={BY+BH - (S1Y+S1H) - 14} rx="1" fill="#1a3a22" />
      {/* Door center line */}
      <line x1="750" y1={S1Y+S1H+2} x2="750" y2={BY+BH-8} stroke="#0a1a0e" strokeWidth="2" />
      {/* Door handles */}
      <rect x="733" y={S2Y-8} width="6" height="18" rx="3" fill={BRASS} opacity="0.8" />
      <rect x="760" y={S2Y-8} width="6" height="18" rx="3" fill={BRASS} opacity="0.8" />
      {/* Door window */}
      <rect x="724" y={WIN_Y+2} width="23" height={WIN_H-2} rx="2" fill={GLASS} />
      <rect x="753" y={WIN_Y+2} width="23" height={WIN_H-2} rx="2" fill={GLASS} />
      {/* Door grille bars */}
      {[730,738].map(x => (
        <rect key={x} x={x} y={WIN_Y+2} width="2" height={WIN_H-2} rx="1" fill={GRILLE} opacity="0.9" />
      ))}
      {[759,767].map(x => (
        <rect key={x} x={x} y={WIN_Y+2} width="2" height={WIN_H-2} rx="1" fill={GRILLE} opacity="0.9" />
      ))}

      {/* Door step */}
      <rect x="720" y={BY+BH} width="60" height="10" rx="2" fill={DKGRN2} />

      {/* ══════════════════════════════════════════════
          REAR DOOR — rear-most slot, no window above it
          (only the small stop-label panel sits above)
      ══════════════════════════════════════════════ */}
      <rect x="22" y={S1Y+S1H} width="60" height={BY+BH - (S1Y+S1H) - 6} rx="2" fill={DKGRN2} />
      <rect x="24" y={S1Y+S1H+2} width="27" height={BY+BH - (S1Y+S1H) - 14} rx="1" fill="#1a3a22" />
      <rect x="53" y={S1Y+S1H+2} width="27" height={BY+BH - (S1Y+S1H) - 14} rx="1" fill="#1a3a22" />
      <line x1="52" y1={S1Y+S1H+2} x2="52" y2={BY+BH-8} stroke="#0a1a0e" strokeWidth="2" />
      <rect x="35" y={S2Y-8} width="6" height="18" rx="3" fill={BRASS} opacity="0.8" />
      <rect x="62" y={S2Y-8} width="6" height="18" rx="3" fill={BRASS} opacity="0.8" />
      <rect x="22" y={BY+BH} width="60" height="10" rx="2" fill={DKGRN2} />

      {/* ══════════════════════════════════════════════
          NUMBER PLATES — yellow, Tamil + English
      ══════════════════════════════════════════════ */}
      {/* Rear (back of bus, left side) */}
      <rect x="20" y="186" width="55" height="16" rx="2" fill={YELLOW} stroke="#333" strokeWidth="0.5" />
      <text x="21" y="193" fill="#111" fontFamily="Noto Sans Tamil" fontSize="5" fontWeight="700">தன-32</text>
      <text x="21" y="200" fill="#111" fontFamily="Courier Prime" fontSize="5" fontWeight="700">TN 32</text>
      <text x="52" y="193" fill="#111" fontFamily="Noto Sans Tamil" fontSize="5" fontWeight="700">ந-4192</text>
      <text x="52" y="200" fill="#111" fontFamily="Courier Prime" fontSize="5" fontWeight="700">N 4192</text>

      {/* Front plate */}
      <rect x="795" y="176" width="46" height="16" rx="2" fill={YELLOW} stroke="#333" strokeWidth="0.5" />
      <text x="796" y="183" fill="#111" fontFamily="Noto Sans Tamil" fontSize="5" fontWeight="700">தன-32</text>
      <text x="796" y="190" fill="#111" fontFamily="Courier Prime" fontSize="5" fontWeight="700">TN 32</text>
      <text x="819" y="183" fill="#111" fontFamily="Noto Sans Tamil" fontSize="5" fontWeight="700">ந-4192</text>
      <text x="819" y="190" fill="#111" fontFamily="Courier Prime" fontSize="5" fontWeight="700">N 4192</text>

      {/* ══════════════════════════════════════════════
          TAIL LIGHTS (rear, left side)
      ══════════════════════════════════════════════ */}
      <rect x={BX}   y="130" width="12" height="22" rx="3" fill={lightsOn ? '#ff3333' : '#cc2222'} opacity={lightsOn ? 1 : 0.6} />
      {/* Left (rear) indicator — amber, blinks via store state */}
      <g style={{ cursor: 'pointer' }} onClick={() => showToast('⬅ Left indicator')}>
        <rect x={BX} y="154" width="12" height="14" rx="2" fill={leftIndicatorLit ? '#FFA500' : '#5a3a10'} opacity={leftIndicatorLit ? 1 : 0.5} />
        {leftIndicatorLit && <ellipse cx={BX+6} cy="161" rx="14" ry="10" fill="#FFA500" opacity="0.2" />}
      </g>
      {/* Rear reflector */}
      <rect x={BX+2} y="170" width="8"  height="5"  rx="1" fill="#FFFF00" opacity="0.5" />

      {/* ══════════════════════════════════════════════
          WHEELS — authentic TNSTC style
          Pink/Red hub caps, large tyres
      ══════════════════════════════════════════════ */}
      {/* Shadow under wheels */}
      <ellipse cx="165" cy="225" rx="38" ry="8" fill="#000" opacity="0.35" />
      <ellipse cx="650" cy="225" rx="38" ry="8" fill="#000" opacity="0.35" />

      {/* ── REAR WHEEL — spins in place while the bus is moving ── */}
      <g style={moving ? { animation: 'wheelSpin 0.5s linear infinite', transformOrigin: '165px 222px' } : undefined}>
      {/* Tyre */}
      <circle cx="165" cy="222" r="36" fill="#111" />
      {/* Tyre outer ring */}
      <circle cx="165" cy="222" r="36" fill="none" stroke="#222" strokeWidth="4" />
      {/* Tyre tread marks */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
        const r = (deg * Math.PI) / 180
        const x1 = 165 + 30*Math.cos(r), y1 = 222 + 30*Math.sin(r)
        const x2 = 165 + 36*Math.cos(r), y2 = 222 + 36*Math.sin(r)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="1.5" />
      })}
      {/* Rim */}
      <circle cx="165" cy="222" r="26" fill="#1c1c1c" stroke="#333" strokeWidth="2" />
      {/* PINK HUB CAP — the most distinctive TNSTC feature */}
      <circle cx="165" cy="222" r="18" fill={PINK_W} />
      <circle cx="165" cy="222" r="14" fill="#c03030" />
      {/* Hub spokes */}
      {[0,60,120,180,240,300].map(deg => {
        const r = (deg * Math.PI) / 180
        return (
          <line key={deg}
            x1={165 + 5*Math.cos(r)} y1={222 + 5*Math.sin(r)}
            x2={165 + 13*Math.cos(r)} y2={222 + 13*Math.sin(r)}
            stroke="#e06060" strokeWidth="2.5" strokeLinecap="round"
          />
        )
      })}
      {/* Center cap */}
      <circle cx="165" cy="222" r="5"  fill="#aa2222" />
      <circle cx="165" cy="222" r="2.5" fill="#cc4444" />
      </g>

      {/* ── FRONT WHEEL — spins in place while the bus is moving ── */}
      <g style={moving ? { animation: 'wheelSpin 0.5s linear infinite', transformOrigin: '650px 222px' } : undefined}>
      <circle cx="650" cy="222" r="36" fill="#111" />
      <circle cx="650" cy="222" r="36" fill="none" stroke="#222" strokeWidth="4" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
        const r = (deg * Math.PI) / 180
        const x1 = 650 + 30*Math.cos(r), y1 = 222 + 30*Math.sin(r)
        const x2 = 650 + 36*Math.cos(r), y2 = 222 + 36*Math.sin(r)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="1.5" />
      })}
      <circle cx="650" cy="222" r="26" fill="#1c1c1c" stroke="#333" strokeWidth="2" />
      <circle cx="650" cy="222" r="18" fill={PINK_W} />
      <circle cx="650" cy="222" r="14" fill="#c03030" />
      {[0,60,120,180,240,300].map(deg => {
        const r = (deg * Math.PI) / 180
        return (
          <line key={deg}
            x1={650 + 5*Math.cos(r)} y1={222 + 5*Math.sin(r)}
            x2={650 + 13*Math.cos(r)} y2={222 + 13*Math.sin(r)}
            stroke="#e06060" strokeWidth="2.5" strokeLinecap="round"
          />
        )
      })}
      <circle cx="650" cy="222" r="5"  fill="#aa2222" />
      <circle cx="650" cy="222" r="2.5" fill="#cc4444" />
      </g>

      {/* Chassis / axle beam */}
      <rect x="100" y="198" width="130" height="8" rx="3" fill="#111" />
      <rect x="590" y="198" width="110" height="8" rx="3" fill="#111" />

      {/* ══════════════════════════════════════════════
          HEADLIGHT BEAM EFFECT (on transition)
      ══════════════════════════════════════════════ */}
      {lightsOn && (
        <>
          <ellipse cx="960" cy="165" rx="120" ry="34" fill="#F3C94B" opacity="0.16" />
          <ellipse cx="985" cy="165" rx="85" ry="20" fill="#fffde0" opacity="0.12" />
        </>
      )}

      {/* HORN FLASH */}
      {hornPressed && (
        <rect x="0" y="0" width={W} height="260" fill="#F3C94B" opacity="0.07" rx="8" />
      )}

      {/* ══════════════════════════════════════════════
          CONDUCTOR BELL — clickable
      ══════════════════════════════════════════════ */}
      <g style={{ cursor:'pointer' }}
        onClick={() => { ringBell(); showToast('🔔 அடுத்த நிறுத்தம்!') }}>
        <rect x="758" y="92" width="22" height="12" rx="4" fill={BRASS} />
        <circle cx="769" cy="98" r="5" fill="#F3C94B" />
      </g>
    </svg>
  )
}
