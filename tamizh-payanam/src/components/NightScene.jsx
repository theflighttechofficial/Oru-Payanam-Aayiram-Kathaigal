import React from 'react'
import useStore from '../store/useStore'

const SCENE_CONFIGS = {
  0: { // Chennai
    gopuram: false, church: false, mosque: false, lighthouse: true,
    bgBuildings: ['#0a1520','#0d1c28','#0a1820'],
    treeColor: '#0a2010',
    teaShop: true, cinema: true, auto: true,
  },
  1: { // Thanjavur
    gopuram: true, church: false, mosque: false, lighthouse: false,
    bgBuildings: ['#100820','#150a28','#0e0818'],
    treeColor: '#0a1808',
    teaShop: true, cinema: false, auto: false,
  },
  2: { // Madurai
    gopuram: true, church: false, mosque: true, lighthouse: false,
    bgBuildings: ['#180a05','#200e08','#150808'],
    treeColor: '#180a05',
    teaShop: true, cinema: true, auto: true,
  },
  3: { // Kanyakumari
    gopuram: false, church: true, mosque: false, lighthouse: true,
    bgBuildings: ['#050e18','#080f20','#050c18'],
    treeColor: '#081510',
    teaShop: false, cinema: false, auto: false,
  },
  4: { // Nilgiris
    gopuram: false, church: false, mosque: false, lighthouse: false,
    bgBuildings: ['#050e08','#080f0a','#060c07'],
    treeColor: '#082010',
    teaShop: true, cinema: false, auto: false,
  },
  5: { // Delta
    gopuram: true, church: false, mosque: false, lighthouse: false,
    bgBuildings: ['#080c05','#0a0e06','#070b04'],
    treeColor: '#0a1806',
    teaShop: true, cinema: false, auto: false,
  },
}

export default function NightScene({ route }) {
  const { showToast, setActivePanel, ringBell } = useStore()
  const cfg = SCENE_CONFIGS[route.id] || SCENE_CONFIGS[0]

  return (
    <svg
      viewBox="0 0 1200 420"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: '90px', left: 0, right: 0, width: '100%', height: '420px' }}
    >
      {/* ── MOON ── */}
      <defs>
        <radialGradient id="moonGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="50%" stopColor={route.moonColor} />
          <stop offset="100%" stopColor={route.moonColor + 'bb'} />
        </radialGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor={route.moonColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={route.moonColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="teaGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#F3C94B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F3C94B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Moon glow halo */}
      <circle cx="980" cy="30" r="120" fill="url(#moonGlow)" />
      {/* Moon body */}
      <circle cx="980" cy="30" r="72" fill="url(#moonGrad)" />
      {/* Moon craters */}
      <circle cx="962" cy="12" r="7" fill={route.moonColor} opacity="0.3" />
      <circle cx="1002" cy="35" r="4" fill={route.moonColor} opacity="0.2" />
      <circle cx="972" cy="46" r="6" fill={route.moonColor} opacity="0.25" />

      {/* ── STARS ── */}
      {[
        [50,30,1.2,0.8],[120,55,0.8,0.6],[200,20,1,0.9],[300,45,0.7,0.5],
        [400,25,1.1,0.7],[500,40,0.9,0.8],[600,18,1.3,0.9],[700,50,0.8,0.6],
        [800,30,1,0.7],[150,80,0.7,0.5],[350,70,1,0.8],[550,65,0.8,0.6],
        [750,45,1.1,0.7],[850,35,0.9,0.8],[950,50,0.7,0.5],[1050,28,1,0.9],
        [1100,55,0.8,0.6],[1150,35,1.1,0.7],[80,100,0.7,0.5],[250,90,1,0.8],
        [450,95,0.8,0.6],[650,85,1.1,0.7],[870,90,0.9,0.8],
      ].map(([x,y,r,op],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={op} />
      ))}

      {/* ── DISTANT CITY SILHOUETTE ── */}
      {cfg.bgBuildings.map((color, i) => (
        <rect key={i} x={200 + i*150} y={180 + i*10} width={60 + i*20} height={100 - i*10} fill={color} />
      ))}

      {/* ── GOPURAM (Thanjavur / Madurai / Delta) ── */}
      {cfg.gopuram && (
        <g
          opacity="0.8" transform="translate(0,-90)"
          style={{ cursor: 'pointer' }}
          onClick={() => { ringBell(); setActivePanel('culture'); showToast('🔔 கோபுரம் — Temple bells ring across the town') }}
        >
          {/* Main tower */}
          <rect x="820" y="60" width="80" height="370" fill="#1a1230" />
          {/* Tiered taper */}
          {[0,1,2,3,4,5,6,7].map(tier => (
            <rect key={tier} x={820 + tier*4} y={60 + tier*20} width={80 - tier*8} height={22} fill={tier%2===0 ? '#251840' : '#1e1535'} />
          ))}
          {/* Shikhara tip */}
          <rect x="848" y="40" width="24" height="22" rx="4" fill="#251840" />
          <rect x="854" y="28" width="12" height="14" rx="3" fill="#1e1535" />
          <rect x="858" y="18" width="4" height="12" fill="#D89B24" opacity="0.9" />
          {/* Gold finial */}
          <ellipse cx="860" cy="17" rx="4" ry="5" fill="#D89B24" />
          {/* Gopuram decorative stripes */}
          {[80,110,140,170,200,230,260].map(y => (
            <rect key={y} x="822" y={y} width="76" height="3" fill="#8C3026" opacity="0.5" />
          ))}
          {/* Gopuram lights */}
          {[840,860,880].map(x => (
            <circle key={x} cx={x} cy="75" r="2.5" fill="#F3C94B" opacity="0.7" />
          ))}
          <text x="860" y="310" textAnchor="middle" fill="#D89B24" fontFamily="Noto Sans Tamil" fontSize="11" opacity="0.9">கோபுரம்</text>
        </g>
      )}

      {/* ── LIGHTHOUSE (Chennai/Kanyakumari) ── */}
      {cfg.lighthouse && (
        <g
          opacity="0.7" transform="translate(0,-90)"
          style={{ cursor: 'pointer' }}
          onClick={() => { setActivePanel('places'); showToast('🗼 கலங்கரை விளக்கம் — Lighthouse, watching over the coast') }}
        >
          <rect x="1060" y="120" width="28" height="300" fill="#1a2030" />
          <rect x="1056" y="108" width="36" height="20" rx="3" fill="#253040" />
          <rect x="1060" y="100" width="28" height="10" rx="2" fill="#1a2030" />
          <circle cx="1074" cy="115" r="8" fill="#F3C94B" opacity="0.6" />
          <circle cx="1074" cy="115" r="4" fill="#fff" opacity="0.7" />
          {/* Stripes */}
          {[140,165,190,215,240,265,290].map((y,i) => (
            i%2===0 ? <rect key={y} x="1062" y={y} width="24" height="20" fill="#cc3322" opacity="0.5" /> : null
          ))}
        </g>
      )}

      {/* ── MOSQUE (Madurai) ── */}
      {cfg.mosque && (
        <g
          opacity="0.6"
          style={{ cursor: 'pointer' }}
          onClick={() => { setActivePanel('culture'); showToast('🕌 பள்ளிவாசல் — a quieter corner of the city') }}
        >
          <rect x="120" y="160" width="50" height="150" fill="#151020" />
          <circle cx="145" cy="158" r="18" fill="#1a1428" />
          <rect x="140" y="140" width="4" height="20" fill="#D89B24" opacity="0.7" />
          {/* Crescent */}
          <path d="M138,132 Q145,124 152,132 Q148,127 141,130 Z" fill="#D89B24" opacity="0.8" />
        </g>
      )}

      {/* ── COCONUT TREES ── */}
      {[[80,60],[220,40],[1050,50],[1120,80]].map(([x,y],i) => (
        <g key={i} opacity={0.6 + i*0.05}>
          <rect x={x-4} y={y} width="8" height={360-y} fill="#2a1f0e" rx="3" />
          <ellipse cx={x} cy={y} rx={30-i*2} ry={14-i} fill={cfg.treeColor} transform={`rotate(${-15+i*10},${x},${y})`} />
          <ellipse cx={x} cy={y-8} rx={24-i*2} ry={11-i} fill={cfg.treeColor} opacity="0.8" transform={`rotate(${10-i*8},${x},${y-8})`} />
          <ellipse cx={x} cy={y-15} rx={18-i} ry={8} fill={cfg.treeColor} opacity="0.6" transform={`rotate(${-20+i*15},${x},${y-15})`} />
          {/* Coconuts */}
          <circle cx={x+8} cy={y+5} r="4" fill="#2a1f0e" />
          <circle cx={x-6} cy={y+3} r="3.5" fill="#2a1f0e" />
        </g>
      ))}

      {/* ── STRING LIGHTS (festival lights across scene) ── */}
      <path d="M 0,110 Q 100,100 200,115 Q 300,105 400,118 Q 500,108 600,120 Q 700,110 800,116 Q 900,106 1000,118 Q 1100,108 1200,115" fill="none" stroke="#444" strokeWidth="0.8" />
      {[20,60,100,150,200,250,300,360,420,480,540,600,660,720,780,840,900,960,1020,1080,1140].map((x,i) => (
        <circle key={i} cx={x} cy={108 + Math.sin(i)*5} r="3.5" fill={['#F3C94B','#cc2222','#315A42','#D89B24','#8C3026'][i%5]} opacity="0.85" />
      ))}

      {/* ── TEA SHOP ── */}
      {cfg.teaShop && (
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => { setActivePanel('food'); showToast('☕ Filter Coffee — காபி கடை') }}
          opacity="0.9"
        >
          {/* Shop structure */}
          <rect x="160" y="230" width="170" height="90" fill="#1a0f08" rx="4" />
          <rect x="155" y="218" width="180" height="16" fill="#3a1a08" rx="2" />
          {/* Sign board */}
          <rect x="168" y="222" width="156" height="24" fill="#0d0a06" rx="3" stroke="#D89B24" strokeWidth="0.5" />
          <text x="246" y="237" textAnchor="middle" fill="#D89B24" fontFamily="Noto Sans Tamil" fontSize="11" fontWeight="600">காபி கடை</text>
          {/* Windows with warm glow */}
          <rect x="172" y="250" width="60" height="45" fill="#F3C94B" opacity="0.06" rx="3" />
          <rect x="244" y="250" width="60" height="45" fill="#F3C94B" opacity="0.05" rx="3" />
          {/* Tumbler silhouettes */}
          {[178,192,206,220].map(x => (
            <rect key={x} x={x} y="285" width="7" height="11" fill="#888" rx="1" opacity="0.7" />
          ))}
          {/* Warm light glow on ground */}
          <ellipse cx="245" cy="320" rx="70" ry="12" fill="#F3C94B" opacity="0.05" />
        </g>
      )}

      {/* ── CINEMA POSTER ── */}
      {cfg.cinema && (
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => { setActivePanel('cinema'); showToast('🎬 Tamil Cinema — தமிழ் சினிமா') }}
          opacity="0.75"
        >
          <rect x="500" y="195" width="90" height="135" fill="#1a0808" rx="4" stroke="#8C3026" strokeWidth="1" />
          <rect x="504" y="199" width="82" height="88" fill="#2d1515" />
          {/* Silhouette hero pose */}
          <ellipse cx="545" cy="230" rx="14" ry="18" fill="#0d0808" />
          <rect x="534" y="245" width="22" height="32" fill="#0d0808" rx="2" />
          <rect x="528" y="252" width="10" height="22" fill="#0d0808" rx="4" transform="rotate(-15,533,263)" />
          <rect x="556" y="248" width="10" height="24" fill="#0d0808" rx="4" transform="rotate(20,561,260)" />
          {/* Film star name */}
          <rect x="504" y="290" width="82" height="18" fill="#cc2222" />
          <text x="545" y="302" textAnchor="middle" fill="#fff" fontFamily="Noto Sans Tamil" fontSize="11" fontWeight="700">சூப்பர் ஸ்டார்</text>
          <text x="545" y="322" textAnchor="middle" fill="#D89B24" fontFamily="Courier Prime" fontSize="11">★ 1983 ★</text>
        </g>
      )}

      {/* ── ASHOK LEYLAND TRUCK (background, behind bus position) ── */}
      <g opacity="0.55" style={{ cursor: 'pointer' }} onClick={() => showToast('🚛 Ashok Leyland — அசோக் லேலாந்து')}>
        {/* Truck body */}
        <rect x="680" y="260" width="260" height="95" fill="#1a0f05" rx="5" />
        {/* Truck cabin */}
        <rect x="880" y="235" width="80" height="90" fill="#1a0f05" rx="4" />
        {/* Cabin windshield */}
        <rect x="886" y="242" width="66" height="50" fill="#0a1808" rx="3" stroke="#1a3510" strokeWidth="1" />
        {/* Cabin text */}
        <text x="919" y="272" textAnchor="middle" fill="#D89B24" fontFamily="Noto Sans Tamil" fontSize="11" opacity="0.95">ஆசிரவாகனம்</text>
        {/* Truck side art - painted floral motifs */}
        <rect x="685" y="265" width="250" height="82" fill="#150d05" rx="3" />
        {/* Decorative border on truck */}
        <rect x="687" y="267" width="246" height="78" fill="none" stroke="#D89B24" strokeWidth="1" rx="2" opacity="0.4" />
        {/* Truck name */}
        <text x="810" y="302" textAnchor="middle" fill="#8C3026" fontFamily="Courier Prime" fontSize="11" fontWeight="700" opacity="0.9">ASHOK LEYLAND</text>
        <text x="810" y="320" textAnchor="middle" fill="#D89B24" fontFamily="Noto Sans Tamil" fontSize="11" opacity="0.9">தமிழ் நாடு</text>
        {/* Decorative flower motifs (authentic truck art) */}
        {[710,750,800,850,900].map(x => (
          <g key={x}>
            <circle cx={x} cy="338" r="5" fill="none" stroke="#D89B24" strokeWidth="0.8" opacity="0.4" />
            <circle cx={x} cy="338" r="2" fill="#D89B24" opacity="0.3" />
          </g>
        ))}
        {/* Truck wheels */}
        <circle cx="730" cy="355" r="22" fill="#111" stroke="#333" strokeWidth="2" />
        <circle cx="730" cy="355" r="14" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
        <circle cx="730" cy="355" r="6" fill="#555" />
        <circle cx="900" cy="355" r="22" fill="#111" stroke="#333" strokeWidth="2" />
        <circle cx="900" cy="355" r="14" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
        <circle cx="900" cy="355" r="6" fill="#555" />
        {/* Truck lights */}
        <circle cx="886" cy="245" r="5" fill="#F3C94B" opacity="0.5" />
        <rect x="955" y="275" width="6" height="10" rx="2" fill="#cc2222" opacity="0.6" />
      </g>

      {/* ── AUTO RICKSHAW ── */}
      {cfg.auto && (
        <g opacity="0.5">
          <rect x="1080" y="300" width="70" height="42" fill="#111" rx="6" />
          <rect x="1088" y="288" width="48" height="18" fill="#0d0d0d" rx="4" />
          <circle cx="1092" cy="342" r="13" fill="#111" stroke="#333" strokeWidth="1.5" />
          <circle cx="1092" cy="342" r="6" fill="#222" />
          <circle cx="1138" cy="342" r="13" fill="#111" stroke="#333" strokeWidth="1.5" />
          <circle cx="1138" cy="342" r="6" fill="#222" />
          <rect x="1080" y="295" width="5" height="8" rx="2" fill="#F3C94B" opacity="0.4" />
        </g>
      )}

    </svg>
  )
}
