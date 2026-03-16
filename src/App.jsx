import { useState } from 'react'
import Experience from './components/Experience'
import Overlay from './components/Overlay'

const CARS = [
  { id: 'ferrari', path: '/models/ferrari.glb', name: 'Ferrari', team: 'Scuderia Ferrari', color: '#E8002D' },

  { id: 'mercedes', path: '/models/mercedes.glb', name: 'Mercedes', team: 'Mercedes-AMG Petronas', color: '#27F4D2' },
  { id: 'mclaren', path: '/models/mclaren.glb', name: 'McLaren', team: 'McLaren F1 Team', color: '#FF8000' },
  { id: 'aston', path: '/models/aston.glb', name: 'Aston Martin', team: 'Aston Martin Aramco', color: '#229971' },
]

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeCar = CARS[activeIndex]

  function handlePrev() {
    setActiveIndex(i => (i - 1 + CARS.length) % CARS.length)
  }

  function handleNext() {
    setActiveIndex(i => (i + 1) % CARS.length)
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">

      {/* 3D Canvas — fixed behind everything */}
      <div className="fixed inset-0 z-0">
        <Experience modelPath={activeCar.path} accentColor={activeCar.color} />
      </div>

      {/* HTML Overlay — on top */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <Overlay
          car={activeCar}
          index={activeIndex}
          total={CARS.length}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

    </div>
  )
}