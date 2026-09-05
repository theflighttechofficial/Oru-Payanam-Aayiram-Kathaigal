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
  if (radioMasterGain) radioMasterGain.gain.value = v ? 0 : (radioEnabled ? radioVolumeFrac : 0)
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

// ── Diesel bus ignition ──
// Per user request, the only startup/idle sound is the real recorded diesel
// bus loop (public/audio/engine-idle.mp3) — see startEngineHum below. No
// synthesized crank/catch effect is layered on top of it.

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
// Tracks whichever fade (in or out) is currently running, so rapidly
// toggling the engine on/off/on can't leave two intervals fighting over
// el.volume at once (which made the volume jump erratically, and could
// even pause the element out from under a fade-in still trying to raise it).
let engineFadeTimer = null
export function startEngineHum() {
  if (muted) return
  if (engineFadeTimer) { clearInterval(engineFadeTimer); engineFadeTimer = null }
  const el = getEngineEl()
  el.muted = false
  el.volume = 0
  el.currentTime = 0
  el.play().catch(() => {})
  // gentle fade-in so it doesn't pop in over the starter-crank tail
  const target = 0.32
  const steps = 12
  let i = 0
  engineFadeTimer = setInterval(() => {
    i++
    el.volume = Math.min(target, (target * i) / steps)
    if (i >= steps) { clearInterval(engineFadeTimer); engineFadeTimer = null }
  }, 40)
}
export function stopEngineHum() {
  if (!engineEl) return
  if (engineFadeTimer) { clearInterval(engineFadeTimer); engineFadeTimer = null }
  const el = engineEl
  const steps = 8
  let i = 0
  const startVol = el.volume
  engineFadeTimer = setInterval(() => {
    i++
    el.volume = Math.max(0, startVol * (1 - i / steps))
    if (i >= steps) { clearInterval(engineFadeTimer); engineFadeTimer = null; el.pause() }
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

// ── FM radio — synthesized retro station tone (pad + static hiss + slow
// melodic drift), one profile per RADIO_STATIONS entry. There's no real
// licensed song audio bundled, so this stands in as an audible "on-air" bed
// that actually plays instead of the dial sitting silently.
const STATION_PROFILE = [
  { base: 220, wave: 'triangle', detune: 6,  filterFreq: 1400, level: 0.05 },
  { base: 262, wave: 'sine',     detune: 4,  filterFreq: 1100, level: 0.045 },
  { base: 196, wave: 'triangle', detune: 8,  filterFreq: 1600, level: 0.05 },
  { base: 294, wave: 'sawtooth', detune: 5,  filterFreq: 1300, level: 0.035 },
  { base: 175, wave: 'sine',     detune: 3,  filterFreq: 900,  level: 0.045 },
  { base: 233, wave: 'triangle', detune: 10, filterFreq: 1800, level: 0.04 },
]

let radioMasterGain = null
let radioOscA = null
let radioOscB = null
let radioToneGain = null
let radioToneFilter = null
let radioLFO = null
let radioStaticGain = null
let radioVolumeFrac = 1.0
let radioEnabled = false
let radioMelodyTimeout = null

function ensureRadioBase(c) {
  if (radioMasterGain) return
  radioMasterGain = c.createGain()
  radioMasterGain.gain.value = 0
  radioMasterGain.connect(c.destination)

  // Static hiss bed
  const noise = getNoiseBuffer(c)
  const staticSrc = c.createBufferSource()
  staticSrc.buffer = noise
  staticSrc.loop = true
  const staticFilter = c.createBiquadFilter()
  staticFilter.type = 'highpass'
  staticFilter.frequency.value = 4000
  radioStaticGain = c.createGain()
  radioStaticGain.gain.value = 0.015
  staticSrc.connect(staticFilter).connect(radioStaticGain).connect(radioMasterGain)
  staticSrc.start()

  // Tonal "music" pad — two slightly detuned oscillators through a filter
  radioOscA = c.createOscillator()
  radioOscB = c.createOscillator()
  radioToneFilter = c.createBiquadFilter()
  radioToneFilter.type = 'lowpass'
  radioToneGain = c.createGain()
  radioToneGain.gain.value = 0
  radioOscA.connect(radioToneFilter)
  radioOscB.connect(radioToneFilter)
  radioToneFilter.connect(radioToneGain).connect(radioMasterGain)
  radioOscA.start()
  radioOscB.start()

  // Slow LFO breathing on the filter cutoff, so the pad feels alive
  radioLFO = c.createOscillator()
  radioLFO.frequency.value = 0.12
  const lfoGain = c.createGain()
  lfoGain.gain.value = 200
  radioLFO.connect(lfoGain).connect(radioToneFilter.frequency)
  radioLFO.start()
}

// Gentle wandering melody: re-picks a note within the station's scale every
// few seconds so the pad doesn't sit on one dead pitch.
function scheduleRadioMelody(profile) {
  clearTimeout(radioMelodyTimeout)
  if (!radioEnabled) return
  const c = getCtx()
  const steps = [0, 2, 3, 5, 7, 8, 10]
  const semis = steps[Math.floor(Math.random() * steps.length)]
  const freq = profile.base * Math.pow(2, semis / 12)
  const t = c.currentTime
  radioOscA.frequency.cancelScheduledValues(t)
  radioOscB.frequency.cancelScheduledValues(t)
  radioOscA.frequency.linearRampToValueAtTime(freq, t + 1.2)
  radioOscB.frequency.linearRampToValueAtTime(freq * Math.pow(2, profile.detune / 1200), t + 1.2)
  radioMelodyTimeout = setTimeout(() => scheduleRadioMelody(profile), 2200 + Math.random() * 1800)
}

export function startRadio(stationIdx) {
  const c = getCtx()
  ensureRadioBase(c)
  radioEnabled = true
  const profile = STATION_PROFILE[stationIdx] || STATION_PROFILE[0]
  radioOscA.type = profile.wave
  radioOscB.type = profile.wave
  radioToneFilter.frequency.cancelScheduledValues(c.currentTime)
  radioToneFilter.frequency.setValueAtTime(profile.filterFreq, c.currentTime)
  scheduleRadioMelody(profile)
  const target = muted ? 0 : profile.level * radioVolumeFrac
  radioToneGain.gain.cancelScheduledValues(c.currentTime)
  radioToneGain.gain.linearRampToValueAtTime(profile.level, c.currentTime + 0.4)
  radioMasterGain.gain.cancelScheduledValues(c.currentTime)
  radioMasterGain.gain.linearRampToValueAtTime(muted ? 0 : radioVolumeFrac, c.currentTime + 0.4)
}

export function stopRadio() {
  radioEnabled = false
  clearTimeout(radioMelodyTimeout)
  if (!radioMasterGain) return
  const c = getCtx()
  radioMasterGain.gain.cancelScheduledValues(c.currentTime)
  radioMasterGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.3)
}

// Brief scanning-static burst, played when the dial is tuned to a new station.
export function tuneRadio(stationIdx) {
  if (!muted) {
    const c = getCtx()
    const src = c.createBufferSource()
    src.buffer = getNoiseBuffer(c)
    const f = c.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.setValueAtTime(600, c.currentTime)
    f.frequency.linearRampToValueAtTime(4000, c.currentTime + 0.18)
    const g = c.createGain()
    g.gain.setValueAtTime(0.06, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2)
    src.connect(f).connect(g).connect(c.destination)
    src.start()
    src.stop(c.currentTime + 0.22)
  }
  if (radioEnabled) startRadio(stationIdx)
}

export function setRadioVolume(v) {
  radioVolumeFrac = Math.max(0, Math.min(1, v / 100))
  if (!radioMasterGain || !radioEnabled) return
  const c = getCtx()
  radioMasterGain.gain.cancelScheduledValues(c.currentTime)
  radioMasterGain.gain.linearRampToValueAtTime(muted ? 0 : radioVolumeFrac, c.currentTime + 0.1)
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
