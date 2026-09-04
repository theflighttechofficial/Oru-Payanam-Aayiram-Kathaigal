import React from 'react'
import useStore from '../store/useStore'
import { STORIES } from '../data/stories'

const PANEL_DATA = {
  culture: {
    titleEng: 'Culture',
    titleTamil: 'கலாச்சாரம்',
    icon: '🎭',
    color: '#D89B24',
    sections: [
      { heading: 'Classical Arts', body: 'Bharatanatyam, Carnatic music, Veena, Nadaswaram — the living arts of Tamil Nadu trace their roots to Sangam poetry and Chola temple culture.' },
      { heading: 'Tamil Literature', body: 'Thirukkural, Silappathikaram, Sangam poetry — among the oldest surviving literature in the world, still read and recited today.' },
      { heading: 'Kolam', body: 'Every morning, Tamil women draw intricate rice-flour patterns at doorways — a living tradition of geometry, prayer, and welcome.' },
    ],
  },
  history: {
    titleEng: 'History',
    titleTamil: 'வரலாறு',
    icon: '📜',
    color: '#8C3026',
    sections: [
      { heading: 'Sangam Era (300 BCE – 300 CE)', body: 'Five landscapes — kurinji, mullai, marutham, neithal, paalai — each with its own poetry, emotion, and season. Tamil civilization\'s golden literary age.' },
      { heading: 'Chola Empire (848–1279 CE)', body: 'The Cholas built the Brihadeeswarar temple, maintained a navy, and patronized bronze sculpture that defined South Asian art.' },
      { heading: 'Modern Tamil Nadu', body: 'From the Dravidian movement to global software engineers — Tamil Nadu\'s journey through the 20th century shaped modern India.' },
    ],
  },
  places: {
    titleEng: 'Places',
    titleTamil: 'இடங்கள்',
    icon: '🗺️',
    color: '#315A42',
    sections: [
      { heading: 'Marina Beach', body: 'The world\'s second-longest urban beach. At 5 AM, joggers, fishermen, and tea sellers share the same stretch of sand.' },
      { heading: 'Meenakshi Temple', body: 'Fourteen gopurams covered in 33,000 sculpted figures. The temple city of Madurai has been continuously inhabited for 2,500 years.' },
      { heading: 'Nilgiri Railway', body: 'A UNESCO heritage toy train climbs 46 km through 16 tunnels and 250 bridges from Mettupalayam to Ooty.' },
    ],
  },
  food: {
    titleEng: 'Food',
    titleTamil: 'உணவு',
    icon: '🍛',
    color: '#D89B24',
    sections: [
      { heading: 'Filter Coffee', body: 'Brewed in a brass filter, poured between tumblers from a height to create froth — Tamil filter coffee is a ritual, not just a drink.' },
      { heading: 'Chettinad Cuisine', body: 'Kara Kulambu, Chicken Chettinad, Kavuni Arisi — the cuisine of the Nattukotai Chettiars uses 25+ freshly ground spices.' },
      { heading: 'Jigarthanda', body: 'Madurai\'s legendary cold drink: milk, almond resin, sarsaparilla syrup, and ice cream. Nothing else like it on earth.' },
    ],
  },
  cinema: {
    titleEng: 'Tamil Cinema',
    titleTamil: 'தமிழ் சினிமா',
    icon: '🎬',
    color: '#8C3026',
    sections: [
      { heading: 'The Golden Era (1960s–80s)', body: 'M.S. Viswanathan and T.K. Ramamoorthy scored hundreds of films. Sivaji Ganesan and Rajinikanth defined what stardom means in Tamil Nadu.' },
      { heading: 'Ilaiyaraaja', body: 'Over 1,000 film scores, 7,000 songs, in 17 languages. Born in Pannaipuram, he wove Western orchestration into Tamil folk music.' },
      { heading: 'AR Rahman', body: 'From Roja (1992) to global stages — the Maestro from Chennai proved Tamil music belonged on the world stage.' },
    ],
  },
}

export default function ContentPanel() {
  const { activePanel, dismissPanel, storyCity } = useStore()
  const story = activePanel === 'story' ? STORIES[storyCity] : null
  const data = activePanel === 'story'
    ? (story && {
        titleEng: 'Outside the Window',
        titleTamil: storyCity,
        icon: '🪟',
        color: '#7acca0',
        sections: [{ heading: story.en, body: story.body }],
      })
    : PANEL_DATA[activePanel]

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: activePanel ? 1 : 0,
        pointerEvents: activePanel ? 'all' : 'none',
        transform: activePanel ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
      onClick={dismissPanel}
    >
      {data && (
        <div style={styles.panel} onClick={e => e.stopPropagation()}>
          {/* Panel header */}
          <div style={styles.header}>
            <span style={styles.icon}>{data.icon}</span>
            <div style={styles.titles}>
              <div style={{ ...styles.titleEng, color: data.color }}>{data.titleEng}</div>
              <div style={styles.titleTamil}>{data.titleTamil}</div>
            </div>
            <button style={styles.closeBtn} onClick={dismissPanel}>✕</button>
          </div>

          {/* Decorative rule */}
          <div style={{ ...styles.rule, background: data.color }} />

          {/* Sections */}
          <div style={styles.body}>
            {data.sections.map((sec, i) => (
              <div key={i} style={styles.section}>
                <div style={{ ...styles.sectionHead, color: data.color }}>
                  <span style={styles.sectionNum}>0{i+1}</span>
                  {sec.heading}
                </div>
                <p style={styles.sectionBody}>{sec.body}</p>
              </div>
            ))}
          </div>

          {/* Bottom Tamil footer */}
          <div style={styles.footer}>
            <span style={styles.footerText}>தமிழ்நாடு · TAMIL NADU</span>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 240,
    background: 'rgba(5,8,5,0.6)',
    backdropFilter: 'blur(2px)',
  },
  panel: {
    width: 380,
    maxHeight: '72vh',
    background: '#0e100e',
    border: '1px solid rgba(216,155,36,0.4)',
    borderRadius: 10,
    padding: '20px 22px',
    overflowY: 'auto',
    boxShadow: '0 12px 60px rgba(0,0,0,0.8)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  icon: { fontSize: 28, lineHeight: 1 },
  titles: { flex: 1 },
  titleEng: {
    fontFamily: "'Baloo Thambi 2', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
  },
  titleTamil: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 13,
    color: '#666',
    marginTop: 1,
  },
  closeBtn: {
    background: 'none',
    border: '1px solid #333',
    borderRadius: '50%',
    width: 28,
    height: 28,
    color: '#666',
    cursor: 'pointer',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rule: {
    height: 1,
    borderRadius: 1,
    marginBottom: 16,
    opacity: 0.4,
  },
  body: { display: 'flex', flexDirection: 'column', gap: 16 },
  section: {},
  sectionHead: {
    fontFamily: "'Baloo Thambi 2', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 5,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sectionNum: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    color: '#444',
    letterSpacing: 1,
  },
  sectionBody: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    color: '#888',
    lineHeight: 1.7,
    paddingLeft: 20,
  },
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTop: '1px solid #222',
    textAlign: 'center',
  },
  footerText: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 9,
    color: '#333',
    letterSpacing: 3,
  },
}
