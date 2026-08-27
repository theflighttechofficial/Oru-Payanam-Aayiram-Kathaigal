// UI/effect sounds are synthesized via Web Audio. The engine idle uses a
// real recorded diesel bus loop (public/audio/engine-idle.mp3) — see
// startEngineHum/stopEngineHum below.
let ctx = null
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

let muted = false
export function setMuted(v) {
  muted = v
  if (engineEl) engineEl.muted = v
  if (ambientMasterGain) ambientMasterGain.gain.value = v ? 0 : 1
}
export function isMuted() { return muted }

function tone(freq, dur, type = 'sine', gain = 0.15, delay = 0) {
  if (muted) return
  const c = getCtx()
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, c.currentTime + delay)
  g.gain.setValueAtTime(0, c.currentTime + delay)
  g.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.02)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur)
  osc.connect(g).connect(c.destination)
  osc.start(c.currentTime + delay)
  osc.stop(c.currentTime + delay + dur + 0.05)
  return osc
}

// White-noise buffer, reused for grind/clatter textures
let noiseBuffer = null
function getNoiseBuffer(c) {
  if (noiseBuffer) return noiseBuffer
  const len = c.sampleRate * 2
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  noiseBuffer = buf
  return buf
}

export function playHorn() {
  tone(320, 0.45, 'sawtooth', 0.12)
  tone(220, 0.5, 'sawtooth', 0.1, 0.02)
}

export function playClick() {
  tone(900, 0.06, 'square', 0.05)
}

export function playIndicatorTick() {
  tone(1200, 0.045, 'square', 0.04)
}

// ── Diesel bus starter + ignition ──
// Starter motor grind (rough rhythmic cranks) -> engine catches -> settles.
export function playEngineStart() {
  if (muted) return
  const c = getCtx()
  const t0 = c.currentTime

  // Starter motor: 3 rough cranking pulses (noise through a low bandpass + a grinding tone)
  const noise = getNoiseBuffer(c)
  for (let i = 0; i < 3; i++) {
    const start = t0 + i * 0.22
    const src = c.createBufferSource()
    src.buffer = noise
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 180
    bp.Q.value = 2.2
    const g = c.createGain()
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(0.22, start + 0.03)
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.16)
    src.connect(bp).connect(g).connect(c.destination)
    src.start(start)
    src.stop(start + 0.18)

    const crank = c.createOscillator()
    crank.type = 'square'
    crank.frequency.setValueAtTime(50, start)
    crank.frequency.exponentialRampToValueAtTime(70, start + 0.15)
    const cg = c.createGain()
    cg.gain.setValueAtTime(0, start)
    cg.gain.linearRampToValueAtTime(0.1, start + 0.02)
    cg.gain.exponentialRampToValueAtTime(0.001, start + 0.16)
    crank.connect(cg).connect(c.destination)
    crank.start(start)
    crank.stop(start + 0.18)
  }

  // Engine catches ~0.75s in: low rumble sweeps up then settles, with diesel clatter
  const catchT = t0 + 0.75
  const osc = c.createOscillator()
  const osc2 = c.createOscillator()
  osc.type = 'sawtooth'
  osc2.type = 'sawtooth'
  osc.frequency.setValueAtTime(140, catchT)
  osc.frequency.exponentialRampToValueAtTime(60, catchT + 0.5)
  osc.frequency.exponentialRampToValueAtTime(46, catchT + 1.0)
  osc2.frequency.setValueAtTime(142, catchT)
  osc2.frequency.exponentialRampToValueAtTime(63, catchT + 0.5)
  osc2.frequency.exponentialRampToValueAtTime(48, catchT + 1.0)
  const g = c.createGain()
  g.gain.setValueAtTime(0, catchT)
  g.gain.linearRampToValueAtTime(0.16, catchT + 0.1)
  g.gain.linearRampToValueAtTime(0.07, catchT + 1.0)
  g.gain.exponentialRampToValueAtTime(0.001, catchT + 1.3)
  osc.connect(g)
  osc2.connect(g)
  g.connect(c.destination)
  osc.start(catchT); osc.stop(catchT + 1.35)
  osc2.start(catchT); osc2.stop(catchT + 1.35)

  // Diesel clatter burst as it catches
  const clatter = c.createBufferSource()
  clatter.buffer = noise
  const clatterFilter = c.createBiquadFilter()
  clatterFilter.type = 'bandpass'
  clatterFilter.frequency.value = 900
  clatterFilter.Q.value = 0.8
  const clatterGain = c.createGain()
  clatterGain.gain.setValueAtTime(0, catchT)
  clatterGain.gain.linearRampToValueAtTime(0.06, catchT + 0.08)
  clatterGain.gain.exponentialRampToValueAtTime(0.001, catchT + 0.9)
  clatter.connect(clatterFilter).connect(clatterGain).connect(c.destination)
  clatter.start(catchT)
  clatter.stop(catchT + 0.95)
}

export function playEngineRev() {
  tone(65, 0.5, 'sawtooth', 0.1)
  tone(95, 0.5, 'sawtooth', 0.06, 0.05)
}

export function playTicketPrint() {
  for (let i = 0; i < 5; i++) tone(500 + i * 40, 0.05, 'square', 0.03, i * 0.045)
}

export function playBell() {
  tone(1400, 0.3, 'sine', 0.08)
  tone(2100, 0.25, 'sine', 0.04, 0.02)
}

// ── Engine idle — real recorded diesel bus idle, looped ──
let engineEl = null
function getEngineEl() {
  if (!engineEl) {
    engineEl = new Audio('/audio/engine-idle.mp3')
    engineEl.loop = true
    engineEl.volume = 0.32
  }
  return engineEl
}
export function startEngineHum() {
  if (muted) return
  const el = getEngineEl()
  el.muted = false
  el.volume = 0
  el.currentTime = 0
  el.play().catch(() => {})
  // gentle fade-in so it doesn't pop in over the starter-crank tail
  const target = 0.32
  const steps = 12
  let i = 0
  const t = setInterval(() => {
    i++
    el.volume = Math.min(target, (target * i) / steps)
    if (i >= steps) clearInterval(t)
  }, 40)
}
export function stopEngineHum() {
  if (!engineEl) return
  const el = engineEl
  const steps = 8
  let i = 0
  const startVol = el.volume
  const t = setInterval(() => {
    i++
    el.volume = Math.max(0, startVol * (1 - i / steps))
    if (i >= steps) { clearInterval(t); el.pause() }
  }, 30)
}

// ── Ambient environment — synthesized filtered-noise bed per region,
// plus scheduled one-shot events (temple bell, honk, chirp, wave, market chatter).
const AMBIENT_PROFILE = {
  0: { filterType: 'bandpass', freq: 700, level: 0.055, events: [{ type: 'honk',    every: [5, 10] }] },       // Chennai — traffic
  1: { filterType: 'lowpass',  freq: 300, level: 0.03,  events: [{ type: 'bell',    every: [4, 7]  }] },        // Thanjavur — temple
  2: { filterType: 'bandpass', freq: 900, level: 0.05,  events: [{ type: 'bell', every: [7,11] }, { type: 'chatter', every: [2,4] }] }, // Madurai — market + temple
  3: { filterType: 'lowpass',  freq: 250, level: 0.075, events: [{ type: 'wave',    every: [3, 5]  }] },        // Kanyakumari — ocean
  4: { filterType: 'highpass', freq: 1400,level: 0.022, events: [{ type: 'chirp',   every: [3, 7]  }] },        // Nilgiris — wind + birds
  5: { filterType: 'lowpass',  freq: 350, level: 0.026, events: [{ type: 'chirp',   every: [2, 5]  }] },        // Cauvery Delta — village
}

let ambientMasterGain = null
let ambientFilter = null
let ambientGain = null
let ambientEnabled = false
let currentAmbientRoute = null
let ambientEventTimeout = null

function ensureAmbientBase(c) {
  if (ambientMasterGain) return
  ambientMasterGain = c.createGain()
  ambientMasterGain.gain.value = muted ? 0 : 1
  ambientMasterGain.connect(c.destination)
  const noise = getNoiseBuffer(c)
  const src = c.createBufferSource()
  src.buffer = noise
  src.loop = true
  ambientFilter = c.createBiquadFilter()
  ambientFilter.type = 'lowpass'
  ambientFilter.frequency.value = 500
  ambientGain = c.createGain()
  ambientGain.gain.value = 0
  src.connect(ambientFilter).connect(ambientGain).connect(ambientMasterGain)
  src.start()
}

function playAmbientEvent(type) {
  if (muted) return
  switch (type) {
    case 'bell':
      playBell()
      break
    case 'honk':
      tone(300, 0.3, 'sawtooth', 0.05)
      tone(230, 0.32, 'sawtooth', 0.04, 0.04)
      break
    case 'chirp':
      tone(2200 + Math.random() * 800, 0.09, 'sine', 0.025)
      break
    case 'wave': {
      const c = getCtx()
      const src = c.createBufferSource()
      src.buffer = getNoiseBuffer(c)
      const f = c.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = 200
      const g = c.createGain()
      g.gain.setValueAtTime(0, c.currentTime)
      g.gain.linearRampToValueAtTime(0.07, c.currentTime + 0.9)
      g.gain.linearRampToValueAtTime(0, c.currentTime + 2.4)
      src.connect(f).connect(g).connect(c.destination)
      src.start()
      src.stop(c.currentTime + 2.5)
      break
    }
    case 'chatter':
      for (let i = 0; i < 3; i++) tone(600 + Math.random() * 400, 0.1, 'triangle', 0.018, i * 0.08)
      break
  }
}

function scheduleAmbientEvents(routeId) {
  clearTimeout(ambientEventTimeout)
  if (!ambientEnabled) return
  const p = AMBIENT_PROFILE[routeId] || AMBIENT_PROFILE[0]
  const ev = p.events[Math.floor(Math.random() * p.events.length)]
  const [minS, maxS] = ev.every
  const delay = (minS + Math.random() * (maxS - minS)) * 1000
  ambientEventTimeout = setTimeout(() => {
    if (!ambientEnabled) return
    playAmbientEvent(ev.type)
    scheduleAmbientEvents(routeId)
  }, delay)
}

function applyAmbientProfile(routeId) {
  const c = getCtx()
  ensureAmbientBase(c)
  const p = AMBIENT_PROFILE[routeId] || AMBIENT_PROFILE[0]
  ambientFilter.type = p.filterType
  ambientFilter.frequency.cancelScheduledValues(c.currentTime)
  ambientFilter.frequency.linearRampToValueAtTime(p.freq, c.currentTime + 1.2)
  ambientGain.gain.cancelScheduledValues(c.currentTime)
  ambientGain.gain.linearRampToValueAtTime(p.level, c.currentTime + 1.2)
  scheduleAmbientEvents(routeId)
}

// Called whenever the current route changes — crossfades the ambient bed.
export function setAmbientRoute(routeId) {
  currentAmbientRoute = routeId
  if (ambientEnabled) applyAmbientProfile(routeId)
}

export function startAmbient() {
  ambientEnabled = true
  if (currentAmbientRoute != null) applyAmbientProfile(currentAmbientRoute)
}

export function stopAmbient() {
  ambientEnabled = false
  clearTimeout(ambientEventTimeout)
  if (ambientGain) {
    const c = getCtx()
    ambientGain.gain.cancelScheduledValues(c.currentTime)
    ambientGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.6)
  }
}
