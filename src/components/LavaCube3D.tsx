import React, { useRef, Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Float, Sparkles, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import lavaCubeTexture from '@/assets/lava-cube-texture.png';

function MainCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, lavaCubeTexture);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth mouse following rotation
      const targetRotationX = state.pointer.y * 0.8;
      const targetRotationY = state.pointer.x * 0.8;
      
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.08;
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.08;
      
      // Add continuous spin
      meshRef.current.rotation.z += 0.003;
      
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
      meshRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Scale on hover/click
      const targetScale = clicked ? 3.2 : hovered ? 2.9 : 2.6;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.x = meshRef.current?.rotation.x || 0;
      glowRef.current.rotation.y = meshRef.current?.rotation.y || 0;
      glowRef.current.rotation.z = meshRef.current?.rotation.z || 0;
      glowRef.current.position.y = meshRef.current?.position.y || 0;
      glowRef.current.position.x = meshRef.current?.position.x || 0;
      
      // Pulsing glow
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.9;
      glowRef.current.scale.setScalar((meshRef.current?.scale.x || 2.6) * 1.15 * pulse);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group>
        {/* Glow effect */}
        <mesh ref={glowRef} scale={3}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial 
            color="#00aaff"
            transparent
            opacity={hovered ? 0.25 : 0.15}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Main cube */}
        <mesh 
          ref={meshRef} 
          scale={2.6}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            map={texture} 
            emissive="#0066ff"
            emissiveIntensity={hovered ? 0.6 : 0.3}
            roughness={0.2}
            metalness={0.8}
            envMapIntensity={1.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

function DecorativeCube({ position, size, speed, color }: { position: [number, number, number], size: number, speed: number, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useMemo(() => position, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Orbital movement
      meshRef.current.position.x = initialPosition[0] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.position.y = initialPosition[1] + Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.5;
      meshRef.current.position.z = initialPosition[2] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
      
      // Rotation
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
      
      // Pulsing scale
      const pulse = Math.sin(state.clock.elapsedTime * speed * 2) * 0.1 + 1;
      meshRef.current.scale.setScalar(size * pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.9}
        transparent
        opacity={0.8}
        distort={0.2}
        speed={2}
      />
    </mesh>
  );
}

function DecorativeCubes() {
  const cubes = useMemo(() => [
    { position: [-4, 2, -2] as [number, number, number], size: 0.4, speed: 0.8, color: '#00ffff' },
    { position: [4, -1, -3] as [number, number, number], size: 0.5, speed: 1.2, color: '#0088ff' },
    { position: [-3, -2, -1] as [number, number, number], size: 0.3, speed: 1, color: '#00aaff' },
    { position: [3, 2.5, -2] as [number, number, number], size: 0.35, speed: 0.9, color: '#0066ff' },
    { position: [-2, 3, -4] as [number, number, number], size: 0.45, speed: 1.1, color: '#00ddff' },
    { position: [2, -2.5, -2] as [number, number, number], size: 0.25, speed: 1.3, color: '#0099ff' },
    { position: [-4.5, 0, -3] as [number, number, number], size: 0.3, speed: 0.7, color: '#00ccff' },
    { position: [4.5, 1, -1] as [number, number, number], size: 0.35, speed: 1.4, color: '#0077ff' },
  ], []);

  return (
    <>
      {cubes.map((cube, index) => (
        <DecorativeCube key={index} {...cube} />
      ))}
    </>
  );
}

function ParticleField() {
  return (
    <>
      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Blue sparkles */}
      <Sparkles
        count={150}
        scale={15}
        size={3}
        speed={0.5}
        opacity={0.8}
        color="#00aaff"
      />
      <Sparkles
        count={100}
        scale={12}
        size={4}
        speed={0.3}
        opacity={0.6}
        color="#0066ff"
      />
      <Sparkles
        count={80}
        scale={20}
        size={2}
        speed={0.7}
        opacity={0.5}
        color="#00ffff"
      />
    </>
  );
}

function Scene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Main lights */}
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00aaff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0066ff" />
      <pointLight position={[0, 10, 5]} intensity={1} color="#00ffff" />
      
      {/* Spotlight for dramatic effect */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        color="#0088ff"
        castShadow
      />
      
      {/* Rim lights */}
      <pointLight position={[-5, 0, 5]} intensity={0.5} color="#00ccff" />
      <pointLight position={[5, 0, 5]} intensity={0.5} color="#0044ff" />
      
      <MainCube />
      <DecorativeCubes />
      <ParticleField />
    </>
  );
}

const LavaCube3D: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LavaCube3D;
