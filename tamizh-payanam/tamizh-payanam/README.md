# தமிழ் பயணம் — Tamizh Payanam
### *ஒரு பயணம். ஆயிரம் கதைகள்.* — (One Journey. A Thousand Stories.)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5.4-443E38.svg?style=flat-square)](https://github.com/pmndrs/zustand)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Synthesis-F3C94B.svg?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![YouTube IFrame API](https://img.shields.io/badge/YouTube-IFrame_Player-FF0000.svg?style=flat-square&logo=youtube&logoColor=white)](https://developers.google.com/youtube/iframe_api_reference)
[![License: MIT](https://img.shields.io/badge/License-MIT-2E8B57.svg?style=flat-square)](../LICENSE)

---

## 🚌 About The Project

**"தமிழ் பயணம் — Tamizh Payanam"** (Repository: `Oru-Payanam-Aayiram-Kathaigal`) is an atmospheric, highly aesthetic retro-futuristic web experience celebrating the rich culture, geography, music, cinema, literature, cuisine, and timeless nostalgia of Tamil Nadu.

The application frames exploration as a midnight bus journey departing from **Villupuram Depot** aboard an authentic **TNSTC (Tamil Nadu State Transport Corporation)** government bus traveling across six iconic regions of Tamil Nadu.

Combining hand-crafted vector SVG illustrations, procedural Web Audio API synthesis, real recorded diesel engine idle loops, YouTube IFrame API cassette tape playback, Zustand state management with `localStorage` persistence, dynamic spatial ambient audio, interactive window vignettes, and vintage CRT monitor styling, *Tamizh Payanam* delivers a deeply nostalgic homage to night bus travel across Tamil Nadu.

---

## 🚀 Quick Start & Development

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

### Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

Open `http://localhost:5173` in your browser.

---

## 🗺️ The 6 Iconic Routes

| ID | Destination (English) | Destination (Tamil) | Route | Fare | Class | Radio Station | Key Highlights |
|:--:|:---|:---|:---:|:---:|:---:|:---:|:---|
| **0** | **Chennai** | சென்னை | `127` | ₹185 | `GEN` | `FM 93.5` | Marina Beach, George Town, Kapaleeshwarar Temple, Fort St. George |
| **1** | **Thanjavur** | தஞ்சாவூர் | `54A` | ₹142 | `SIT` | `MW 729` | Brihadeeswarar Temple, Tanjore Palace, Saraswathi Mahal, Bronze Museum |
| **2** | **Madurai** | மதுரை | `7` | ₹218 | `SIT` | `FM 101.9` | Meenakshi Amman Temple, Thirumalai Nayakkar Palace, Teppakulam, Flower Market |
| **3** | **Kanyakumari** | கன்னியாகுமரி | `49` | ₹340 | `EXP` | `FM 107.0` | Vivekananda Rock, Thiruvalluvar Statue, Kumari Amman Temple, Sunset Point |
| **4** | **Nilgiris** | நீலகிரி | `12` | ₹276 | `EXP` | `FM 91.1` | Ooty Lake, Botanical Gardens, Doddabetta Peak, Nilgiri Mountain Railway |
| **5** | **Cauvery Delta** | காவிரி டெல்டா | `36B` | ₹98 | `GEN` | `FM 88.4` | Kumbakonam Temples, Mahamaham Tank, Darasuram, Gangaikondacholapuram |

---

## 🎮 Key Controls & Shortcuts

* <kbd>H</kbd> — Sound Bus Air Horn (*கோவிந்தா! / HORN OK PLEASE*) + Screen Flash
* <kbd>D</kbd> — Toggle Developer Telemetry HUD
* <kbd>F</kbd> — Toggle Fullscreen Journey Mode
* **Click Windows** — Read "Outside the Window" city vignettes
* **Click Ticket** — Flip ticket to view 6-region journey progress checklist
* **Click Bell** — Ring conductor call bell (*🔔 அடுத்த நிறுத்தம்!*)
* **Click Mirror** — Trigger side mirror reflection easter egg
* **Dashboard Switches** — Control Ignition (`IGN`), Headlights (`HEAD`), Indicators (`◀ IND`/`IND ▶`), Mute (`SND`), Ambience (`AMB`)
* **Tape Rack** — Select curated music cassettes or unlocked region fast-travel cassettes
* **Hide Bus** — Zen mode to enjoy the scenery and music unobstructed

---

## 📁 Source Code Organization

* [`src/App.jsx`](./src/App.jsx) — Master layout, viewport layering, keyboard listeners, and transition orchestrator.
* [`src/components/TNSTCBus.jsx`](./src/components/TNSTCBus.jsx) — Precision SVG vector model of the TNSTC Villupuram bus.
* [`src/components/TamizhRadio.jsx`](./src/components/TamizhRadio.jsx) — Retro cassette deck and YouTube IFrame API player.
* [`src/components/TapeRack.jsx`](./src/components/TapeRack.jsx) — Caravan-style cassette rack for music tapes and visited region tapes.
* [`src/components/BusTicket.jsx`](./src/components/BusTicket.jsx) — Printed bus ticket stub and flip journey progress checklist.
* [`src/components/Dashboard.jsx`](./src/components/Dashboard.jsx) — Cockpit switches, digital speedometer, and fuel gauge.
* [`src/components/RouteSelector.jsx`](./src/components/RouteSelector.jsx) — Destination buttons with engine safety interlock.
* [`src/components/ContentPanel.jsx`](./src/components/ContentPanel.jsx) — Slide-in cultural encyclopedia drawer and city stories.
* [`src/audio/sound.js`](./src/audio/sound.js) — Procedural Web Audio API sound synthesizer & spatial ambient beds.
* [`src/store/useStore.js`](./src/store/useStore.js) — Zustand centralized state store with `localStorage` persistence.
* [`src/data/routes.js`](./src/data/routes.js) — Destinations metadata, radio stations, and cassette tape definitions.
* [`src/data/stories.js`](./src/data/stories.js) — City vignette narratives.

---

For the full detailed project overview, architectural flow diagrams, and design system specifications, please refer to the [Root README.md](../README.md).

<p align="center">
  <b>TNSTC VILLUPURAM · தமிழ்நாடு அரசுப் போக்குவரத்துக்கழகம் · தமிழ் பயணம்</b><br>
  <i>ஒரு பயணம். ஆயிரம் கதைகள். — One Journey. A Thousand Stories.</i>
</p>
