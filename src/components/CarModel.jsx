import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

// ── Per-car tuning ──────────────────────────────────────────
// Adjust scale, position [x, y, z], and rotation [x, y, z] in radians
// for each car until it looks right. This is normal — every GLB is different.
const CAR_CONFIGS = {
    'ferrari': { scale: 1, position: [-0, -0.6, 2], rotation: [0, 0, 0] },
    'mercedes': { scale: 1, position: [-0.5, -0.4, 0], rotation: [0, 0, 0] },
    'mclaren': { scale: 1, position: [0, 0, 0], rotation: [0, 0, 0] },
    'aston': { scale: 1, position: [0, 0, 0], rotation: [0, 0, 0] },
}

export default function CarModel({ path }) {
    const group = useRef()
    const { scene } = useGLTF(path)

    // Derive the car key from the path e.g. '/models/ferrari.glb' → 'ferrari'
    const carKey = path.split('/').pop().replace('.glb', '')
    const config = CAR_CONFIGS[carKey] ?? { scale: 1, position: [0, 0, 0], rotation: [0, 0, 0] }

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