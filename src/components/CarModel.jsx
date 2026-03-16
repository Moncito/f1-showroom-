import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const CAR_CONFIGS = {
    'ferrari': { scale: 0.72, position: [0, 0.5, 0], rotation: [0, 0, 0] },
    'mercedes': { scale: 0.9, position: [0, 0.5, 0], rotation: [0, 0, 0] },
    'mclaren': { scale: 0.86, position: [0, 1.0, 0], rotation: [0, 0, 0] },
    'aston': { scale: 0.9, position: [0, 0.6, 0], rotation: [0, 0, 0] },
}

// Idle sway — gentle sine oscillation on Y axis.
// Stays paused while the user is dragging (orbitRef.current?.state?.pointerDown).
const SWAY_AMPLITUDE = 0.12   // radians — about ±7°
const SWAY_SPEED = 0.28   // full cycle every ~22s, very calm

export default function CarModel({ path, orbitRef }) {
    const group = useRef()
    const { scene } = useGLTF(path)

    const carKey = path.split('/').pop().replace('.glb', '')
    const config = CAR_CONFIGS[carKey] ?? { scale: 1, position: [0, 0, 0], rotation: [0, 0, 0] }

    // Phase offset so the car doesn't snap when the model swaps
    const phase = useRef(0)

    useFrame(({ clock }) => {
        if (!group.current) return

        // Pause sway while user is actively orbiting
        const userDragging = orbitRef?.current?.state?.pointerDown ?? false
        if (userDragging) {
            // Sync phase so when they release there's no jump
            phase.current = clock.elapsedTime * SWAY_SPEED
            return
        }

        const t = clock.elapsedTime * SWAY_SPEED
        group.current.rotation.y = config.rotation[1] + Math.sin(t) * SWAY_AMPLITUDE
    })

    return (
        <primitive
            ref={group}
            object={scene}
            scale={config.scale}
            position={config.position}
            rotation={config.rotation}
        />
    )
}

useGLTF.preload('/models/ferrari.glb')
useGLTF.preload('/models/mercedes.glb')
useGLTF.preload('/models/mclaren.glb')
useGLTF.preload('/models/aston.glb')