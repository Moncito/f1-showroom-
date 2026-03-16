import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Center } from '@react-three/drei'
import CarModel from './CarModel'

export default function Experience({ modelPath, accentColor }) {
    return (
        <Canvas
            camera={{ position: [0, 1.5, 5], fov: 45 }}
            gl={{ antialias: true }}
        >
            {/* Stronger lighting so car details are visible */}
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
            <directionalLight position={[-5, 2, -5]} intensity={1.5} color="#ffffff" />
            <spotLight
                position={[0, 8, 2]}
                intensity={4}
                angle={0.4}
                penumbra={1}
                color="#ffffff"
            />

            {/* sunset gives cars a warm dramatic glow */}
            <Environment preset="sunset" backgroundBlurriness={1} />

            <Center>
                <CarModel path={modelPath} />
            </Center>

            <OrbitControls
                enablePan={false}
                minDistance={2}
                maxDistance={10}
                autoRotate
                autoRotateSpeed={1.5}
            />
        </Canvas>
    )
}