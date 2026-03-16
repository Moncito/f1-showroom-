import { Canvas, useThree } from '@react-three/fiber'
import {
    Environment,
    OrbitControls,
    Center,
    ContactShadows,
} from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import CarModel from './CarModel'

const LIGHTING = {
    ferrari: {
        keyIntensity: 90,
        keyColor: '#fff5e8',
        rimIntensity: 1.4,
        envPreset: 'studio',
        bounceColor: '#ff1a1a',
    },
    mercedes: {
        keyIntensity: 130,
        keyColor: '#f0f8ff',
        rimIntensity: 2.0,
        envPreset: 'studio',
        bounceColor: '#00e5c2',
    },
    mclaren: {
        keyIntensity: 140,
        keyColor: '#fff3d6',
        rimIntensity: 1.8,
        envPreset: 'warehouse',
        bounceColor: '#ff8800',
    },
    aston: {
        keyIntensity: 160,
        keyColor: '#f5fff8',
        rimIntensity: 2.2,
        envPreset: 'studio',
        bounceColor: '#00cc80',
    },
}

function SceneClear() {
    const { scene, gl } = useThree()
    useEffect(() => {
        scene.background = null
        gl.setClearColor(new THREE.Color(0, 0, 0), 0)
    }, [scene, gl])
    return null
}

export default function Experience({ modelPath, accentColor }) {
    const orbitRef = useRef()
    const carKey = modelPath.split('/').pop().replace('.glb', '')
    const light = LIGHTING[carKey] ?? LIGHTING.ferrari

    return (
        <Canvas
            camera={{ position: [0, 1.2, 5], fov: 42 }}
            gl={{
                antialias: true,
                alpha: true,
                premultipliedAlpha: false,
            }}
            onCreated={({ gl, scene }) => {
                gl.setClearColor(0x000000, 0)
                scene.background = null
            }}
            shadows
            style={{
                background: 'transparent',
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
            }}
        >
            <SceneClear />

            <ambientLight intensity={0.4} />

            <spotLight
                position={[2, 8, 5]}
                intensity={light.keyIntensity}
                angle={0.38}
                penumbra={0.65}
                color={light.keyColor}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0005}
            />

            <spotLight
                position={[-3, 5, 4]}
                intensity={light.keyIntensity * 0.35}
                angle={0.5}
                penumbra={1}
                color={light.keyColor}
            />

            <directionalLight
                position={[-4, 5, -7]}
                intensity={light.rimIntensity}
                color="#cce4ff"
            />

            <directionalLight
                position={[-6, 1, 3]}
                intensity={0.35}
                color="#ffffff"
            />

            <pointLight
                position={[0, -0.8, 2.5]}
                intensity={2.2}
                color={light.bounceColor}
                distance={7}
                decay={2}
            />

            <pointLight
                position={[0, -2.5, 0]}
                intensity={0.35}
                color="#1a2a40"
                distance={6}
                decay={2}
            />

            {/* background={false} stops drei painting env onto scene.background */}
            <Environment preset={light.envPreset} background={false} />

            {/* ── ContactShadows does all the floor grounding work ────────
          No floor mesh at all — the shadow alone is enough to
          anchor the car and looks cleaner than a visible plane.  */}
            <ContactShadows
                position={[0, -0.85, 0]}
                opacity={0.8}
                scale={16}
                blur={3.5}
                far={3}
                color="#000000"
            />

            <Center position={[0, -0.35, 0]}>
                <CarModel path={modelPath} orbitRef={orbitRef} />
            </Center>

            <OrbitControls
                ref={orbitRef}
                enablePan={false}
                minDistance={2.5}
                maxDistance={9}
                maxPolarAngle={Math.PI / 2.2}
                minPolarAngle={Math.PI / 6}
                autoRotate={false}
                enableDamping
                dampingFactor={0.05}
            />
        </Canvas>
    )
}