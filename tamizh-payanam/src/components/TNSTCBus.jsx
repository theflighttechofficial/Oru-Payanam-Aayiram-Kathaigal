import React from 'react'
import useStore from '../store/useStore'

/*
  TNSTC VILLUPURAM BUS — rebuilt to match the reference night photo exactly.
  viewBox 0 0 960 280. Horizontal (not diagonal) stripe bands, warm amber
  window glow instead of iron bars, pink-red hub wheels, full night atmosphere.
*/

const MINT     = '#4EC87E'
const MINT_ROOF= '#3AB56A'
const DKGRN    = '#1B6B3A'
const DKGRN_HL = '#2D8A50'
const TEXT_GRN = '#1B5E35'
const GLASS    = '#081510'
const AMBER    = '#F5A623'
const BRASS    = '#D89B24'
const PINK_HUB = '#D9534F'
const YELLOW   = '#F0C000'
const BLACK    = '#0a0a0a'

// Route stops, back to front — matches data/stories.js so window clicks show real content
const STOP_NAMES = [
  'சென்னை', 'விழுப்புரம்', 'கும்பகோணம்', 'தஞ்சாவூர்', 'மதுரை',
  'திருநெல்வேலி', 'கன்னியாகுமரி', 'தேனி', 'ஊட்டி',
]

const BODY_TOP = 45
const BODY_BOTTOM = 220

export default function TNSTCBus({ route, moving }) {
  const {
    showToast, showStory, ringBell, transitPhase, hornPressed,
    headlightsOn, engineOn, leftIndicatorLit, rightIndicatorLit, clickMirror, isPlaying,
  } = useStore()
  const isMoving = moving ?? transitPhase === 'moving'
  const isCranking = transitPhase === 'cranking'
  const lightsOn = headlightsOn || isCranking || isMoving
  const cabinBright = engineOn || isPlaying

  const windowGlow = cabinBright ? 0.18 : 0.12

  // Door: full body height, pulled up close to the cab with only a window-sized gap
  const DOOR_W = 66
  const DOOR_X = 845 - 22 - DOOR_W
  const DOOR_TOP = BODY_TOP + 18
  const DOOR_H = BODY_BOTTOM - DOOR_TOP

  // Windows: stretched to fill the strip right up to the door, no dead space
  const WIN_START = 43
  const WIN_GAP = 5
  const WIN_END = DOOR_X - 8
  const WIN_W = (WIN_END - WIN_START - 8 * WIN_GAP) / 9

  return (
    <svg
      viewBox="0 0 1060 280"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.8))', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="beamThrow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF6D0" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#F3C94B" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F3C94B" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* ══════════════ ROOF RACK ══════════════ */}
      <rect x="75" y="34" width="770" height="4" rx="2" fill="#1a1a1a" />
      <rect x="75" y="42" width="770" height="4" rx="2" fill="#1a1a1a" />
      {[100, 165, 230, 295, 360, 425, 490, 555, 620, 685, 750, 815].map((x) => (
        <rect key={x} x={x} y="34" width="3" height="14" rx="1" fill="#222" />
      ))}
      <rect x="840" y="30" width="5" height="22" rx="2" fill="#1a1a1a" />
      <rect x="75" y="30" width="5" height="22" rx="2" fill="#1a1a1a" />

      {/* Fleet number badge, roof-mounted, unobstructed */}
      <rect x="760" y="10" width="30" height="13" rx="2" fill="#0a0a0a" opacity="0.85" />
      <text x="775" y="19.5" textAnchor="middle" fill={BRASS} fontFamily="Courier Prime" fontSize="8" fontWeight="700">439</text>

      {/* REAR LADDER */}
      <rect x="52" y="30" width="5" height="110" rx="2" fill="#1a1a1a" />
      <rect x="68" y="30" width="5" height="110" rx="2" fill="#1a1a1a" />
      {[36, 52, 68, 84, 100, 114].map((y) => (
        <rect key={y} x="52" y={y} width="21" height="3" rx="1" fill="#222" />
      ))}

      {/* ══════════════ BODY ══════════════ */}
      <rect x="15" y={BODY_TOP} width="870" height="175" rx="10" fill={MINT} />
      <rect x="15" y={BODY_TOP} width="870" height="18" rx="6" fill={MINT_ROOF} />

      {/* ══════════════ WINDOW ROW — pulled in to leave room for the door ══════════════ */}
      {/* Window backing strip */}
      <rect x={WIN_START - 2} y="53" width={WIN_END - WIN_START + 4} height="58" rx="4" fill={BLACK} />

      {(() => {
        const wins = []
        const ww = WIN_W
        const gap = WIN_GAP
        for (let i = 0; i < 9; i++) {
          const wx = WIN_START + i * (ww + gap)
          const city = STOP_NAMES[i]
          wins.push(
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => showStory(city)}>
              {/* Frame */}
              <rect x={wx} y="55" width={ww} height="54" rx="2" fill="none" stroke={BLACK} strokeWidth="2" />
              {/* Glass — dark with warm interior glow */}
              <rect x={wx + 1} y="56" width={ww - 2} height="52" rx="1" fill={GLASS} />
              <rect x={wx + 1} y="56" width={ww - 2} height="52" rx="1" fill={AMBER} opacity={windowGlow} />
              <rect x={wx + 6} y="61" width={ww - 12} height="42" rx="1" fill={AMBER} opacity={windowGlow * 0.6} />
              {/* Passenger silhouettes */}
              {[0.22, 0.45, 0.68, 0.86].map((f, pi) => (
                <g key={pi} opacity="0.85">
                  <ellipse cx={wx + ww * f} cy="79" rx="5" ry="6" fill="#111" />
                  <rect x={wx + ww * f - 6} y="85" width="12" height="16" rx="3" fill="#111" />
                </g>
              ))}
              {/* Hover glow */}
              <rect x={wx} y="55" width={ww} height="54" rx="2" fill="#F3C94B" opacity="0" className="win-glow" />
            </g>
          )
        }
        return wins
      })()}

      {/* Stop name labels */}
      {STOP_NAMES.map((text, i) => {
        const wx = WIN_START + i * (WIN_W + WIN_GAP)
        return (
          <g key={i}>
            <rect x={wx + 1} y="56" width={WIN_W - 2} height="12" rx="1" fill="#fffbe0" opacity="0.8" />
            <text x={wx + WIN_W / 2} y="65" textAnchor="middle" fill="#1a1a1a" fontFamily="Noto Sans Tamil" fontSize="5.5" fontWeight="600">
              {text}
            </text>
          </g>
        )
      })}

      {/* ══════════════ STRIPE SYSTEM — horizontal bands ══════════════ */}
      {/* Upper stripe */}
      <rect x="15" y={BODY_TOP + 68} width="870" height="16" fill={DKGRN} />
      <rect x="15" y={BODY_TOP + 68} width="870" height="1" fill={DKGRN_HL} />

      {/* Lower stripe */}
      <rect x="15" y={BODY_TOP + 118} width="870" height="22" fill={DKGRN} />
      <rect x="15" y={BODY_TOP + 118} width="870" height="1" fill={DKGRN_HL} />

      {/* Body text, centered between stripes */}
      <text
        x="390" y={BODY_TOP + 100}
        textAnchor="middle"
        fill={TEXT_GRN}
        fontFamily="Noto Sans Tamil"
        fontSize="11"
        fontWeight="600"
        opacity="0.9"
      >
        தமிழ்நாடு அரசு போக்குவரத்து கழகம் - விழுப்புரம்
      </text>

      {/* Route number + class badge — tucked into the rear roof area, clear of the body text */}
      <rect x="82" y="16" width="34" height="12" rx="2" fill={YELLOW} />
      <text x="99" y="25" textAnchor="middle" fill={BLACK} fontFamily="Courier Prime" fontSize="8" fontWeight="800">{route.routeNum}</text>
      <rect x="120" y="16" width="48" height="12" rx="2" fill="#cc2222" />
      <text x="144" y="25" textAnchor="middle" fill="#fff" fontFamily="Courier Prime" fontSize="6" fontWeight="700" letterSpacing="0.5">
        {route.passType === 'EXP' ? 'EXPRESS' : 'ORDINARY'}
      </text>

      {/* ══════════════ DOOR — full-height, pulled up close to the front cab, leaving one window's worth of gap ══════════════ */}
      <rect x={DOOR_X} y={DOOR_TOP} width={DOOR_W} height={DOOR_H - 6} rx="2" fill="#155C30" />
      <rect x={DOOR_X + 2} y={DOOR_TOP + 2} width={DOOR_W / 2 - 3.5} height={DOOR_H - 14} rx="1" fill={GLASS} />
      <rect x={DOOR_X + 2} y={DOOR_TOP + 2} width={DOOR_W / 2 - 3.5} height={DOOR_H - 14} rx="1" fill={AMBER} opacity={windowGlow} />
      <rect x={DOOR_X + DOOR_W / 2 + 1.5} y={DOOR_TOP + 2} width={DOOR_W / 2 - 3.5} height={DOOR_H - 14} rx="1" fill={GLASS} />
      <rect x={DOOR_X + DOOR_W / 2 + 1.5} y={DOOR_TOP + 2} width={DOOR_W / 2 - 3.5} height={DOOR_H - 14} rx="1" fill={AMBER} opacity={windowGlow} />
      <line x1={DOOR_X + DOOR_W / 2} y1={DOOR_TOP + 2} x2={DOOR_X + DOOR_W / 2} y2={DOOR_TOP + DOOR_H - 12} stroke="#0a2a14" strokeWidth="2" />
      <rect x={DOOR_X + 11} y={DOOR_TOP + DOOR_H / 2 - 9} width="6" height="18" rx="3" fill={BRASS} opacity="0.85" />
      <rect x={DOOR_X + DOOR_W - 17} y={DOOR_TOP + DOOR_H / 2 - 9} width="6" height="18" rx="3" fill={BRASS} opacity="0.85" />
      <rect x={DOOR_X} y={BODY_BOTTOM - 8} width={DOOR_W} height="8" rx="2" fill="#0d3a20" />

      {/* ══════════════ REAR FACE ══════════════ */}
      <ellipse cx="21" cy="137" rx="16" ry="18" fill="#FF2020" opacity="0.35" />
      <rect x="15" y="125" width="12" height="25" rx="3" fill="#FF3B30" opacity="1" />
      <g style={{ cursor: 'pointer' }} onClick={() => showToast('⬅ Left indicator')}>
        <rect x="15" y="152" width="12" height="14" rx="2" fill={leftIndicatorLit ? '#FF6600' : '#5a3010'} opacity={leftIndicatorLit ? 1 : 0.7} />
        {leftIndicatorLit && <ellipse cx="21" cy="159" rx="14" ry="10" fill="#FF6600" opacity="0.25" />}
      </g>
      <rect x="18" y="196" width="60" height="14" rx="2" fill={YELLOW} stroke="#333" strokeWidth="0.5" />
      <text x="19" y="203" fill="#111" fontFamily="Noto Sans Tamil" fontSize="5" fontWeight="700">தன-32</text>
      <text x="19" y="209" fill="#111" fontFamily="Courier Prime" fontSize="5" fontWeight="700">TN 32</text>
      <text x="48" y="203" fill="#111" fontFamily="Noto Sans Tamil" fontSize="5" fontWeight="700">ந-4192</text>
      <text x="48" y="209" fill="#111" fontFamily="Courier Prime" fontSize="5" fontWeight="700">N 4192</text>

      {/* Rear mirror easter egg — small mirror stub left of the rear ladder */}
      <g style={{ cursor: 'pointer' }} onClick={clickMirror}>
        <rect x="30" y="100" width="12" height="9" rx="2" fill="#ccc" stroke="#333" strokeWidth="1" />
        <rect x="32" y="102" width="8" height="5" rx="1" fill="#8fd0ff" opacity="0.5" />
      </g>

      {/* Conductor bell — sits in the narrow panel between the door and the cab */}
      <g style={{ cursor: 'pointer' }} onClick={() => { ringBell(); showToast('🔔 அடுத்த நிறுத்தம்!') }}>
        <rect x="828" y="96" width="14" height="11" rx="4" fill={BRASS} />
        <circle cx="835" cy="101" r="3.5" fill="#F3C94B" />
      </g>

      {/* ══════════════ FRONT FACE / CAB — shifted 15px left so nothing exceeds x=945 ══════════════ */}
      <rect x="845" y={BODY_TOP} width="90" height="175" rx="8" fill={MINT_ROOF} />

      {/* Windshield */}
      <rect x="850" y="52" width="60" height="90" rx="4" fill={GLASS} stroke={DKGRN} strokeWidth="2" />
      <rect x="850" y="52" width="60" height="90" rx="4" fill={AMBER} opacity="0.06" />
      <polygon points="855,56 865,56 860,135 852,135" fill="#fff" opacity="0.04" />
      {/* Driver silhouette */}
      <ellipse cx="870" cy="88" rx="7" ry="8" fill="#050a08" opacity="0.55" />
      <path d="M859,110 Q870,96 881,110 L881,114 L859,114 Z" fill="#050a08" opacity="0.5" />

      {/* Destination board */}
      <rect x="847" y="46" width="68" height="16" rx="2" fill={BLACK} stroke={BRASS} strokeWidth="1" />
      <text x="881" y="54.5" textAnchor="middle" fill="#F3C94B" fontFamily="Noto Sans Tamil" fontSize="6.5" fontWeight="700">
        {route.nameT}
      </text>
      <text x="881" y="60.5" textAnchor="middle" fill="#aaa" fontFamily="Courier Prime" fontSize="4.5">
        VLR - {route.tktTo}
      </text>

      {/* Orange front indicators — outer edges of both headlamp pods, blinking in tandem with their matching rear indicator */}
      <g style={{ cursor: 'pointer' }} onClick={() => showToast('⬅ Left indicator')}>
        <rect x="843" y="146" width="6" height="12" rx="2" fill={leftIndicatorLit ? '#FF7700' : '#5a3a10'} opacity={leftIndicatorLit ? 1 : 0.6} />
        {leftIndicatorLit && <ellipse cx="846" cy="152" rx="11" ry="9" fill="#FF7700" opacity="0.3" />}
      </g>
      <g style={{ cursor: 'pointer' }} onClick={() => showToast('➡ Right indicator')}>
        <rect x="931" y="146" width="6" height="12" rx="2" fill={rightIndicatorLit ? '#FF7700' : '#5a3a10'} opacity={rightIndicatorLit ? 1 : 0.6} />
        {rightIndicatorLit && <ellipse cx="934" cy="152" rx="11" ry="9" fill="#FF7700" opacity="0.3" />}
      </g>

      {/* SPLIT HEADLAMPS — two pods flanking a centred grille, each split into
          an upper parking-light lens and a lower main-beam lens */}
      {[
        { x: 850, side: 'left' },
        { x: 906, side: 'right' },
      ].map(({ x, side }) => (
        <g key={side} style={isCranking ? { animation: 'headlightFlicker 0.2s ease-in-out infinite' } : undefined}>
          {lightsOn && <ellipse cx={x + 11} cy="164" rx="26" ry="28" fill="#FFF3C0" opacity="0.7" />}
          {lightsOn && <ellipse cx={x + 11} cy="164" rx="14" ry="16" fill="#FFFFF0" opacity="0.55" />}
          {/* Housing */}
          <rect x={x} y="146" width="22" height="36" rx="7" fill="#ddd" stroke="#888" strokeWidth="1" />
          {/* Split line dividing parking lamp (upper) from main beam (lower) */}
          <line x1={x + 2} y1="163" x2={x + 20} y2="163" stroke="#888" strokeWidth="1" />
          {/* Upper parking lamp — small amber, always faintly lit */}
          <rect x={x + 4} y="149" width="14" height="11" rx="4" fill="#F5A623" opacity={lightsOn ? 1 : 0.4} />
          {/* Lower main beam — bright when lights are on */}
          <rect x={x + 3} y="166" width="16" height="13" rx="5" fill={lightsOn ? '#FFFDF0' : '#aaa'} opacity={lightsOn ? 1 : 0.5} />
          {/* Pink/red trim ring */}
          <rect x={x} y="146" width="22" height="36" rx="7" fill="none" stroke={PINK_HUB} strokeWidth="1.5" />
        </g>
      ))}

      {/* Front grille — centred between the two headlamp pods */}
      <rect x="875" y="150" width="30" height="32" rx="3" fill="#145C30" />
      {[157, 163, 169, 175].map((y) => (
        <line key={y} x1="878" y1={y} x2="902" y2={y} stroke="#0a2a12" strokeWidth="1.5" />
      ))}
      <circle cx="890" cy="166" r="7" fill={BRASS} opacity="0.8" />
      <circle cx="890" cy="166" r="4" fill="#0a2010" />

      {/* Front number plate */}
      <rect x="860" y="186" width="60" height="14" rx="2" fill={YELLOW} stroke="#333" strokeWidth="0.5" />
      <text x="890" y="196" textAnchor="middle" fill="#111" fontFamily="Courier Prime" fontSize="6" fontWeight="700">TN 01 AN 5040</text>

      {/* Front bumper */}
      <rect x="843" y="202" width="84" height="12" rx="3" fill={MINT_ROOF} />

      {/* ══════════════ NIGHT ATMOSPHERE ══════════════ */}
      {/* Undercarriage ground shadow */}
      <rect x="50" y="268" width="820" height="12" rx="6" fill="#000" opacity="0.6" />
      {/* Ground reflection glow */}
      <rect x="100" y="270" width="720" height="8" rx="4" fill={MINT} opacity="0.06" />
      {/* Headlight beam throw — actual light cones fanning out from each lamp onto the road ahead */}
      {lightsOn && (
        <>
          <polygon points="861,157 861,171 1050,110 1050,205" fill="url(#beamThrow)" />
          <polygon points="917,157 917,171 1050,130 1050,225" fill="url(#beamThrow)" />
          <ellipse cx="1010" cy="168" rx="60" ry="24" fill="#F3C94B" opacity="0.12" />
          <ellipse cx="1010" cy="255" rx="70" ry="10" fill="#fffde0" opacity="0.16" />
        </>
      )}

      {/* ══════════════ WHEELS ══════════════ */}
      <Wheel cx={175} cy={235} r={34} moving={isMoving} spinning={engineOn} />
      <Wheel cx={680} cy={235} r={34} moving={isMoving} spinning={engineOn} />

      {/* HORN FLASH */}
      {hornPressed && (
        <rect x="0" y="0" width="960" height="280" fill="#F3C94B" opacity="0.06" rx="8" />
      )}
    </svg>
  )
}

function Wheel({ cx, cy, r = 34, moving, spinning }) {
  const treadOuter = r
  const treadInner = r - 6
  const rim = r - 9
  const hub = r - 14
  const hubInner = r - 18
  const spokeOuter = r - 21
  const spokeInner = r - 30
  return (
    <g>
      <ellipse cx={cx} cy="220" rx="38" ry="7" fill="#000" opacity="0.4" />

      <circle cx={cx} cy={cy} r={treadOuter} fill="#0f0f0f" />
      <circle cx={cx} cy={cy} r={treadOuter} fill="none" stroke="#1a1a1a" strokeWidth="5" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = cx + treadInner * Math.cos(rad), y1 = cy + treadInner * Math.sin(rad)
        const x2 = cx + treadOuter * Math.cos(rad), y2 = cy + treadOuter * Math.sin(rad)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="2" />
      })}
      <circle cx={cx} cy={cy} r={rim} fill="#1c1c1c" stroke="#2a2a2a" strokeWidth="2" />

      <g style={spinning ? { animation: `hubSpin ${moving ? '0.8s' : '2.6s'} linear infinite`, transformOrigin: `${cx}px ${cy}px` } : undefined}>
        <circle cx={cx} cy={cy} r={hub} fill={PINK_HUB} />
        <circle cx={cx} cy={cy} r={hubInner} fill="#C03535" />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180
          return (
            <line key={deg}
              x1={cx + spokeInner * Math.cos(rad)} y1={cy + spokeInner * Math.sin(rad)}
              x2={cx + spokeOuter * Math.cos(rad)} y2={cy + spokeOuter * Math.sin(rad)}
              stroke="#E06060" strokeWidth="3" strokeLinecap="round"
            />
          )
        })}
        <circle cx={cx} cy={cy} r="6" fill="#A02020" />
        <circle cx={cx} cy={cy} r="3" fill="#C04040" />
      </g>
    </g>
  )
}
