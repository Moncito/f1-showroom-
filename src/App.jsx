import { useState, useEffect, useRef } from 'react'
import Experience from './components/Experience'
import Overlay from './components/Overlay'
import ShaderBackground from './components/ShaderBackground'

const CARS = [
  {
    id: 'ferrari',
    path: '/models/ferrari.glb',
    name: 'Ferrari',
    team: 'Scuderia Ferrari',
    color: '#E8002D',
    lineColor: 'rgba(232, 0, 45, 0.05)',
  },
  {
    id: 'mercedes',
    path: '/models/mercedes.glb',
    name: 'Mercedes',
    team: 'Mercedes-AMG Petronas',
    color: '#27F4D2',
    lineColor: 'rgba(39, 244, 210, 0.04)',
  },
  {
    id: 'mclaren',
    path: '/models/mclaren.glb',
    name: 'McLaren',
    team: 'McLaren F1 Team',
    color: '#FF8000',
    lineColor: 'rgba(255, 128, 0, 0.05)',
  },
  {
    id: 'aston',
    path: '/models/aston.glb',
    name: 'Aston Martin',
    team: 'Aston Martin Aramco',
    color: '#229971',
    lineColor: 'rgba(34, 153, 113, 0.05)',
  },
]

function buildSpeedLines(car) {
  return `repeating-linear-gradient(
    90deg,
    ${car.lineColor} 0px,
    ${car.lineColor} 1px,
    transparent 1px,
    transparent 18px
  )`
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [linesVisible, setLinesVisible] = useState(true)
  const pendingIndex = useRef(null)

  const activeCar = CARS[activeIndex]

  function changeCar(nextIndex) {
    if (isTransitioning) return
    pendingIndex.current = nextIndex
    setIsTransitioning(true)
    setLinesVisible(false)
  }

  function handlePrev() { changeCar((activeIndex - 1 + CARS.length) % CARS.length) }
  function handleNext() { changeCar((activeIndex + 1) % CARS.length) }

  useEffect(() => {
    if (!isTransitioning) return
    const swap = setTimeout(() => {
      setActiveIndex(pendingIndex.current)
      setIsTransitioning(false)
    }, 350)
    const lines = setTimeout(() => setLinesVisible(true), 500)
    return () => { clearTimeout(swap); clearTimeout(lines) }
  }, [isTransitioning])

  return (
    // No background on this div — the shader canvas handles it entirely
    <div className="w-screen h-screen overflow-hidden relative">

      {/* ── Layer 0: Fractal shader background ──────────────────────
          Raw WebGL canvas. Sits behind everything.
          Color transitions smoothly via targetColorRef internally. */}
      <ShaderBackground accentColor={activeCar.color} />

      {/* ── Layer 1: Speed lines — team color, very low opacity ───── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: buildSpeedLines(activeCar),
          opacity: linesVisible ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* ── Layer 2: Film grain SVG overlay ───────────────────────── */}
      <svg
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 2, width: '100%', height: '100%', opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── Layer 3: Vignette ──────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: `radial-gradient(ellipse 85% 80% at 50% 42%,
            transparent 45%,
            rgba(0,0,0,0.6) 100%
          )`,
        }}
      />

      {/* ── Layer 10: Three.js canvas ──────────────────────────────── */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 10,
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'scale(0.97)' : 'scale(1)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        <Experience modelPath={activeCar.path} accentColor={activeCar.color} />
      </div>

      {/* ── Layer 20: HTML overlay ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 20 }}>
        <Overlay
          car={activeCar}
          index={activeIndex}
          total={CARS.length}
          onPrev={handlePrev}
          onNext={handleNext}
          isTransitioning={isTransitioning}
        />
      </div>
    </div>
  )
}