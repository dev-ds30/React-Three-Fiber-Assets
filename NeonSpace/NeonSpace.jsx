import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function AudioVisualizerSphere({ position, scale = 1 }) {
  const sphereRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    if (!sphereRef.current) return

    const time = state.clock.elapsedTime
    const bass = Math.abs(Math.sin(time * 2)) * 0.5 + 0.5
    const mid = Math.abs(Math.sin(time * 3.5)) * 0.5 + 0.5

    sphereRef.current.scale.setScalar(scale * (1 + bass * 0.3))
    sphereRef.current.rotation.y = time * 0.5
    sphereRef.current.rotation.x = Math.sin(time * 0.3) * 0.2

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.5 + mid * 1.5
    }
  })

  return (
    <mesh ref={sphereRef} position={position}>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={1}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

function PulsingRing({ position, radius, color, speed = 1 }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (!ringRef.current) return

    const time = state.clock.elapsedTime * speed
    const pulse = Math.abs(Math.sin(time)) * 0.5 + 0.5

    ringRef.current.scale.setScalar(1 + pulse * 0.2)
    ringRef.current.rotation.z = time * 0.3
    ringRef.current.material.opacity = 0.3 + pulse * 0.4
  })

  return (
    <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.05, 16, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  )
}

function NeonGrid() {
  const gridRef = useRef()

  useFrame((state) => {
    if (!gridRef.current) return

    const time = state.clock.elapsedTime
    const positions = gridRef.current.geometry.attributes.position.array

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 2]
      const distance = Math.sqrt(x * x + z * z)
      const wave = Math.sin(distance * 0.3 - time * 2) * 0.5
      positions[i + 1] = wave
    }

    gridRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} wireframe transparent opacity={0.4} />
    </mesh>
  )
}

function LaserBeam({ start, end, color }) {
  const beamRef = useRef()

  useFrame((state) => {
    if (!beamRef.current) return

    const time = state.clock.elapsedTime
    beamRef.current.material.opacity = 0.3 + Math.sin(time * 5) * 0.2
  })

  const startVec = new THREE.Vector3(...start)
  const endVec = new THREE.Vector3(...end)
  const direction = endVec.clone().sub(startVec)
  const length = direction.length()
  const position = startVec.clone().add(direction.multiplyScalar(0.5))

  const quaternion = new THREE.Quaternion()
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())

  return (
    <mesh ref={beamRef} position={position.toArray()} quaternion={quaternion.toArray()}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.5} />
    </mesh>
  )
}

function FloatingCube({ position, size = 1, color, rotationSpeed = 1 }) {
  const cubeRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (!cubeRef.current) return

    const time = state.clock.elapsedTime
    cubeRef.current.rotation.x = time * rotationSpeed * 0.5
    cubeRef.current.rotation.y = time * rotationSpeed
    cubeRef.current.position.y = position[1] + Math.sin(time * 2) * 0.5

    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(time * 3) * 1
    }
  })

  return (
    <group position={position}>
      <mesh ref={cubeRef}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight ref={glowRef} intensity={2} distance={5} color={color} />
    </group>
  )
}

function ParticleField() {
  const particlesRef = useRef()

  const [positions, velocities] = useMemo(() => {
    const pos = []
    const vel = []

    for (let i = 0; i < 1000; i++) {
      pos.push((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 40)
      vel.push((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02)
    }

    return [new Float32Array(pos), vel]
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return

    const time = state.clock.elapsedTime
    const pos = particlesRef.current.geometry.attributes.position.array

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += velocities[i] + Math.sin(time + i) * 0.001
      pos[i + 1] += velocities[i + 1] + Math.cos(time + i) * 0.001
      pos[i + 2] += velocities[i + 2] + Math.sin(time + i) * 0.001

      if (Math.abs(pos[i]) > 20) pos[i] *= -0.9
      if (Math.abs(pos[i + 1]) > 15) pos[i + 1] *= -0.9
      if (Math.abs(pos[i + 2]) > 20) pos[i + 2] *= -0.9
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#00ffff" transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  )
}

function StrobeLights() {
  const light1Ref = useRef()
  const light2Ref = useRef()
  const light3Ref = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (light1Ref.current) {
      light1Ref.current.intensity = Math.abs(Math.sin(time * 4)) * 3
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = Math.abs(Math.sin(time * 4 + Math.PI / 3)) * 3
    }
    if (light3Ref.current) {
      light3Ref.current.intensity = Math.abs(Math.sin(time * 4 + (Math.PI * 2) / 3)) * 3
    }
  })

  return (
    <>
      <pointLight ref={light1Ref} position={[5, 5, 5]} color="#ff00ff" distance={15} />
      <pointLight ref={light2Ref} position={[-5, 5, 5]} color="#00ffff" distance={15} />
      <pointLight ref={light3Ref} position={[0, 5, -5]} color="#ffff00" distance={15} />
    </>
  )
}

function GlassPrism({ position }) {
  const prismRef = useRef()

  useFrame((state) => {
    if (!prismRef.current) return

    const time = state.clock.elapsedTime
    prismRef.current.rotation.y = time * 0.8
    prismRef.current.rotation.x = Math.sin(time * 0.5) * 0.3
  })

  return (
    <mesh ref={prismRef} position={position}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshPhysicalMaterial
        transmission={0.95}
        thickness={0.5}
        roughness={0.05}
        ior={1.5}
        color="#ffffff"
        transparent
        opacity={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}

function EqualizerBars() {
  return (
    <group position={[0, -1, -8]}>
      {Array.from({ length: 16 }).map((_, i) => {
        const BarComponent = ({ index }) => {
          const barRef = useRef()

          useFrame((state) => {
            if (!barRef.current) return

            const time = state.clock.elapsedTime
            const frequency = 2 + index * 0.3
            const height = 1 + Math.abs(Math.sin(time * frequency)) * 4

            barRef.current.scale.y = height
            barRef.current.position.y = height / 2
          })

          return (
            <mesh ref={barRef} position={[(index - 7.5) * 0.6, 1, 0]}>
              <boxGeometry args={[0.4, 1, 0.4]} />
              <meshStandardMaterial
                color={`hsl(${(index / 16) * 360}, 100%, 50%)`}
                emissive={`hsl(${(index / 16) * 360}, 100%, 50%)`}
                emissiveIntensity={1.5}
              />
            </mesh>
          )
        }

        return <BarComponent key={i} index={i} />
      })}
    </group>
  )
}

function NeonTunnel() {
  const tunnelRef = useRef()

  useFrame((state) => {
    if (!tunnelRef.current) return

    const time = state.clock.elapsedTime
    tunnelRef.current.rotation.z = time * 0.5
  })

  return (
    <group ref={tunnelRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const z = -i * 2
        const scale = 1 + i * 0.15

        return (
          <mesh key={i} position={[0, 0, z]} scale={[scale, scale, 1]}>
            <ringGeometry args={[3, 3.2, 32]} />
            <meshStandardMaterial
              color={`hsl(${(i / 20) * 360}, 100%, 50%)`}
              emissive={`hsl(${(i / 20) * 360}, 100%, 50%)`}
              emissiveIntensity={1}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function CentralStage() {
  const stageRef = useRef()

  useFrame((state) => {
    if (!stageRef.current) return

    const time = state.clock.elapsedTime
    stageRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2
  })

  return (
    <mesh ref={stageRef} position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[5, 64]} />
      <meshStandardMaterial color="#000000" emissive="#ff00ff" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
    </mesh>
  )
}

function CustomSparkles() {
  const sparklesRef = useRef()

  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 200; i++) {
      pos.push((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 40)
    }
    return new Float32Array(pos)
  }, [])

  useFrame((state) => {
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={sparklesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 10, 40]} />

      <ambientLight intensity={0.1} />

      <StrobeLights />

      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#00ffff" />
      <directionalLight position={[-10, 10, 5]} intensity={0.5} color="#ff00ff" />

      <spotLight position={[0, 10, 0]} angle={0.6} penumbra={0.5} intensity={2} color="#ffffff" />

      <CentralStage />
      <AudioVisualizerSphere position={[0, 0, 0]} scale={1.5} />
      <GlassPrism position={[0, 0, 0]} />

      <PulsingRing position={[0, 0, 0]} radius={3} color="#ff00ff" speed={1} />
      <PulsingRing position={[0, 0, 0]} radius={4} color="#00ffff" speed={1.5} />
      <PulsingRing position={[0, 0, 0]} radius={5} color="#ffff00" speed={2} />

      <NeonGrid />
      <NeonTunnel />
      <EqualizerBars />

      <FloatingCube position={[-4, 2, 0]} size={0.8} color="#ff00ff" rotationSpeed={1} />
      <FloatingCube position={[4, 2, 0]} size={0.8} color="#00ffff" rotationSpeed={1.2} />
      <FloatingCube position={[0, 3, -3]} size={0.6} color="#ffff00" rotationSpeed={0.8} />

      <LaserBeam start={[-4, 2, 0]} end={[4, 2, 0]} color="#ff00ff" />
      <LaserBeam start={[4, 2, 0]} end={[0, 3, -3]} color="#00ffff" />
      <LaserBeam start={[0, 3, -3]} end={[-4, 2, 0]} color="#ffff00" />

      <ParticleField />
      <CustomSparkles />

      <OrbitControls enableDamping dampingFactor={0.05} minDistance={5} maxDistance={25} maxPolarAngle={Math.PI / 1.8} />
    </>
  )
}

export default function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        overflow: 'hidden',
        background: '#000000'
      }}>
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3
        }}>
        <Scene />
      </Canvas>
    </div>
  )
}
