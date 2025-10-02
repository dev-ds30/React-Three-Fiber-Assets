import * as THREE from 'three'
import { Fragment, Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment, Loader, MeshTransmissionMaterial } from '@react-three/drei'

function Sphere(props) {
  return (
    <mesh castShadow {...props} renderOrder={-2000000}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="white" roughness={1} />
    </mesh>
  )
}

function Zoom({ vec = new THREE.Vector3(0, 0, 100) }) {
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 10, 0, 100), 0.075)
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 22, 0.075)
    state.camera.updateProjectionMatrix()
  })
}

function Spheres() {
  const group = useRef()
  useFrame((state) => {
    group.current.children[0].position.x = THREE.MathUtils.lerp(
      group.current.children[0].position.x,
      -18 - state.mouse.x * 3,
      0.02
    )
    group.current.children[1].position.x = THREE.MathUtils.lerp(
      group.current.children[1].position.x,
      -10 - state.mouse.x * 10,
      0.01
    )
    group.current.children[2].position.x = THREE.MathUtils.lerp(
      group.current.children[2].position.x,
      18 - state.mouse.x * 5,
      0.03
    )
    group.current.children[3].position.x = THREE.MathUtils.lerp(
      group.current.children[3].position.x,
      10 - state.mouse.x * 6,
      0.04
    )
  })
  return (
    <group ref={group}>
      <Sphere position={[-40, 1, 10]} />
      <Sphere position={[-20, 10, -20]} scale={10} />
      <Sphere position={[40, 3, -4]} scale={3} />
      <Sphere position={[30, 0.75, 10]} scale={0.75} />
    </group>
  )
}

function WeatherOrb({ position, scale = 1, color, type = 'rain', rotationSpeed = 1 }) {
  const mesh = useRef()
  const particles = useRef()
  
  const particleCount = 200
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = Math.random() * scale * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      const col = new THREE.Color(color)
      colors[i3] = col.r
      colors[i3 + 1] = col.g
      colors[i3 + 2] = col.b
    }
    
    return { positions, colors }
  }, [scale, color])
  
  useFrame((state) => {
    mesh.current.rotation.y += 0.005 * rotationSpeed
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    
    if (particles.current) {
      particles.current.rotation.y -= 0.002 * rotationSpeed
      particles.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.15
    }
  })
  
  return (
    <group position={position}>
      <mesh ref={mesh} castShadow scale={scale}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.92}
          roughness={0.2}
          thickness={1.2}
          ior={1.5}
          chromaticAberration={0.4}
          anisotropy={0.4}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color={color}
        />
      </mesh>
      
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particlePositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05 * scale}
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      
      <pointLight color={color} intensity={3 * scale} distance={10 * scale} />
    </group>
  )
}

function WeatherOrbs() {
  const group = useRef()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    group.current.children[0].position.y = THREE.MathUtils.lerp(
      group.current.children[0].position.y,
      2 + Math.sin(t * 0.5) * 0.5,
      0.05
    )
    group.current.children[0].position.x = THREE.MathUtils.lerp(
      group.current.children[0].position.x,
      -8 - state.mouse.x * 4,
      0.03
    )
    
    group.current.children[1].position.y = THREE.MathUtils.lerp(
      group.current.children[1].position.y,
      -2 + Math.sin(t * 0.3 + 1) * 0.8,
      0.04
    )
    group.current.children[1].position.x = THREE.MathUtils.lerp(
      group.current.children[1].position.x,
      2 - state.mouse.x * 8,
      0.02
    )
    
    group.current.children[2].position.y = THREE.MathUtils.lerp(
      group.current.children[2].position.y,
      1 + Math.sin(t * 0.4 + 2) * 0.6,
      0.045
    )
    group.current.children[2].position.x = THREE.MathUtils.lerp(
      group.current.children[2].position.x,
      8 - state.mouse.x * 5,
      0.035
    )
    
    group.current.children[3].position.y = THREE.MathUtils.lerp(
      group.current.children[3].position.y,
      -1 + Math.sin(t * 0.6 + 3) * 0.4,
      0.055
    )
    group.current.children[3].position.x = THREE.MathUtils.lerp(
      group.current.children[3].position.x,
      -4 - state.mouse.x * 6,
      0.025
    )
    
    group.current.children[4].position.y = THREE.MathUtils.lerp(
      group.current.children[4].position.y,
      3 + Math.sin(t * 0.35 + 4) * 0.7,
      0.06
    )
    group.current.children[4].position.x = THREE.MathUtils.lerp(
      group.current.children[4].position.x,
      12 - state.mouse.x * 3.5,
      0.04
    )
  })
  
  return (
    <group ref={group}>
      <WeatherOrb 
        position={[-8, 2, -5]} 
        scale={2.5} 
        color="#4080ff" 
        type="rain"
        rotationSpeed={0.8}
      />
      <WeatherOrb 
        position={[2, -2, -15]} 
        scale={3.5} 
        color="#80d0ff" 
        type="snow"
        rotationSpeed={0.5}
      />
      <WeatherOrb 
        position={[8, 1, 0]} 
        scale={2} 
        color="#ffc040" 
        type="sunny"
        rotationSpeed={1.2}
      />
      <WeatherOrb 
        position={[-4, -1, -10]} 
        scale={1.5} 
        color="#ff80a0" 
        type="cloudy"
        rotationSpeed={0.7}
      />
      <WeatherOrb 
        position={[12, 3, -8]} 
        scale={1.8} 
        color="#a0ff80" 
        type="clear"
        rotationSpeed={1}
      />
    </group>
  )
}

export default function App() {
  return (
    <Fragment>
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0, 100], fov: 22 }}>
        <fog attach="fog" args={['#e8f4f8', 100, 150]} />
        <color attach="background" args={['#e8f4f8']} />
        <spotLight
          penumbra={1}
          angle={1}
          castShadow
          position={[10, 60, -5]}
          intensity={8}
          shadow-mapSize={[512, 512]}
        />
        <Suspense fallback={null}>
          <group position={[0, -8, 0]}>
            <WeatherOrbs />
            <Spheres />
            <mesh
              rotation-x={-Math.PI / 2}
              position={[0, 0.01, 0]}
              scale={[200, 200, 200]}
              receiveShadow
              renderOrder={100000}>
              <planeGeometry />
              <shadowMaterial transparent color="#1a3050" opacity={0.15} />
            </mesh>
          </group>
          <hemisphereLight intensity={0.3} />
          <ambientLight intensity={0.6} />
          <Environment preset="city" />
          <Zoom />
          <Text
            position={[0, -2.5, -50]}
            letterSpacing={-0.05}
            fontSize={30}
            color="#2a5080"
            material-toneMapped={false}
            material-fog={false}
            anchorX="center"
            anchorY="middle">
            {`ATMOSPHERE`}
          </Text>
        </Suspense>
      </Canvas>
      <Loader />
    </Fragment>
  )
}
