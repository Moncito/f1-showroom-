import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CAR_CONFIGS = {
    'ferrari': { scale: 0.72, position: [0, 0.5, 0], rotation: [0, 0, 0], year: '2024', season: 'F1 Championship' },
    'mercedes': { scale: 0.9, position: [0, 0.5, 0], rotation: [0, 0, 0], year: '2024', season: 'F1 Championship' },
    'mclaren': { scale: 0.86, position: [0, 1.0, 0], rotation: [0, 0, 0], year: '2024', season: 'F1 Championship' },
    'aston': { scale: 0.9, position: [0, 0.6, 0], rotation: [0, 0, 0], year: '2024', season: 'F1 Championship' },
}

// ── Material physics for realistic car surfaces ──────────────────────────────────
const MATERIAL_PHYSICS = {
    carbon: { roughness: 0.25, metalness: 0.95 },      // Carbon fiber: glossy weave
    paint: { roughness: 0.35, metalness: 0.88 },       // Body paint: smooth competition finish
    tire: { roughness: 0.98, metalness: 0 },           // Tires: matte grip
    rubber: { roughness: 0.98, metalness: 0 },         // Rubber components: matte
    default: { roughness: 0.4, metalness: 0.7 },       // Fallback
}

// Idle sway — gentle sine oscillation on Y axis
const SWAY_AMPLITUDE = 0.12   // radians — about ±7°
const SWAY_SPEED = 0.28       // full cycle every ~22s, very calm

export default function CarModel({ path, orbitRef }) {
    const group = useRef()
    const { scene } = useGLTF(path)

    const carKey = path.split('/').pop().replace('.glb', '')
    const config = CAR_CONFIGS[carKey] ?? { scale: 1, position: [0, 0, 0], rotation: [0, 0, 0], year: '2024', season: 'F1 Championship' }

    // Phase offset so the car doesn't snap when the model swaps
    const phase = useRef(0)

    // ── Apply material physics on load ──────────────────────────────────────────────
    useEffect(() => {
        scene.traverse(node => {
            if (node.isMesh && node.material) {
                const mat = node.material
                if (mat instanceof THREE.MeshStandardMaterial) {
                    const matName = mat.name.toLowerCase()

                    // Determine material type and apply physics
                    if (matName.includes('carbon')) {
                        mat.roughness = MATERIAL_PHYSICS.carbon.roughness
                        mat.metalness = MATERIAL_PHYSICS.carbon.metalness
                    } else if (matName.includes('tire') || matName.includes('rubber')) {
                        mat.roughness = MATERIAL_PHYSICS.tire.roughness
                        mat.metalness = MATERIAL_PHYSICS.tire.metalness
                    } else if (matName.includes('paint') || matName.includes('body') || matName.includes('chassis')) {
                        mat.roughness = MATERIAL_PHYSICS.paint.roughness
                        mat.metalness = MATERIAL_PHYSICS.paint.metalness
                    } else {
                        // Default to realistic base
                        mat.roughness = MATERIAL_PHYSICS.default.roughness
                        mat.metalness = MATERIAL_PHYSICS.default.metalness
                    }
                    mat.needsUpdate = true
                }
            }
        })
    }, [scene])

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