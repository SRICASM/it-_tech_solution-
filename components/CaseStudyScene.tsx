import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, Icosahedron, Torus, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { CaseStudy } from '../types';

// Component to handle dynamic camera FOV based on aspect ratio with smooth interpolation
const ResponsiveCamera = () => {
  const { camera, size } = useThree();
  
  useFrame((state, delta) => {
    if (camera instanceof THREE.PerspectiveCamera) {
       // Determine target FOV based on aspect ratio
       const aspect = size.width / size.height;
       
       // Standard FOV for landscape is 45
       let targetFov = 45;
       
       // For portrait or square containers (aspect < 1.2), we widen FOV to keep the object visible
       // We adjust the formula to be more sensitive for smaller/narrower containers often found in grid layouts
       if (aspect < 1.2) {
           targetFov = 45 + (1.2 - aspect) * 45;
       }
       
       // Cap at 100 to avoid excessive distortion
       targetFov = Math.min(targetFov, 100);
       
       // Smoothly interpolate current FOV to target FOV
       camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 3.0);
       camera.updateProjectionMatrix();
    }
  });

  return null;
};

/**
 * Renders 3D text for metrics.
 */
const MetricText = ({ label, value, position, visible }: { label: string, value: string, position: [number, number, number], visible: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
        gsap.to(groupRef.current.scale, {
            x: visible ? 1 : 0,
            y: visible ? 1 : 0,
            z: visible ? 1 : 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    }
  }, [visible]);

  return (
    <group position={position} scale={0} ref={groupRef}>
      <Text
        color="#00F0FF"
        fontSize={0.35}
        font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0Pn54W4E.woff"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.2, 0]}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {value}
      </Text>
      <Text
        color="#E4E4E7"
        fontSize={0.15}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        anchorX="center"
        anchorY="top"
        position={[0, -0.1, 0]}
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
};

const FintechModel = ({ active, hovered, metrics }: { active: boolean, hovered: boolean, metrics: CaseStudy['metrics'] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = useRef({ value: 1 });

  useEffect(() => {
      // Ring animation
      if (ringRef.current) {
          gsap.to(ringRef.current.scale, {
              x: active ? 1.8 : (hovered ? 1.3 : 1),
              y: active ? 1.8 : (hovered ? 1.3 : 1),
              z: active ? 1.8 : (hovered ? 1.3 : 1),
              duration: 1,
              ease: "elastic.out(1, 0.5)"
          });
      }
      // Core animation
      if (meshRef.current) {
          gsap.to(meshRef.current.scale, {
              x: active ? 0.8 : (hovered ? 1.1 : 1),
              y: active ? 0.8 : (hovered ? 1.1 : 1),
              z: active ? 0.8 : (hovered ? 1.1 : 1),
              duration: 1,
              ease: "power2.out"
          });
      }
      // Rotation speed animation
      gsap.to(rotationSpeed.current, {
          value: active ? 0.2 : (hovered ? 2.5 : 1),
          duration: 1.5,
          ease: "power2.out"
      });
  }, [active, hovered]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2 * rotationSpeed.current.value;
      meshRef.current.rotation.y += delta * 0.3 * rotationSpeed.current.value;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x -= delta * 0.1 * rotationSpeed.current.value;
      ringRef.current.rotation.y -= delta * 0.1 * rotationSpeed.current.value;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Icosahedron args={[1.2, 0]} ref={meshRef}>
           <MeshDistortMaterial color="#00F0FF" speed={2} distort={0.2} radius={1} wireframe={!active} />
        </Icosahedron>
        <Torus args={[1.8, 0.05, 16, 100]} ref={ringRef}>
            <meshStandardMaterial color="#7000FF" emissive="#7000FF" emissiveIntensity={active ? 3 : (hovered ? 1.5 : 1)} toneMapped={false} />
        </Torus>
      </Float>
      
      <MetricText visible={active} label={metrics[0].label} value={metrics[0].value} position={[-2.5, 1, 0]} />
      <MetricText visible={active} label={metrics[1].label} value={metrics[1].value} position={[2.5, -1, 0]} />
    </group>
  );
};

const HealthModel = ({ active, hovered, metrics }: { active: boolean, hovered: boolean, metrics: CaseStudy['metrics'] }) => {
   const groupRef = useRef<THREE.Group>(null);
   const materialRef = useRef<any>(null);
   const rotationSpeed = useRef({ value: 1 });

   useEffect(() => {
       if (groupRef.current) {
           gsap.to(groupRef.current.scale, {
               x: active ? 1.4 : (hovered ? 1.15 : 0.9),
               y: active ? 1.4 : (hovered ? 1.15 : 0.9),
               z: active ? 1.4 : (hovered ? 1.15 : 0.9),
               duration: 1,
               ease: "power2.out"
           });
       }
       gsap.to(rotationSpeed.current, {
           value: active ? 0.5 : (hovered ? 2.0 : 1),
           duration: 1.5,
           ease: "power2.out"
       });
   }, [active, hovered]);
   
   useFrame((state, delta) => {
       if (groupRef.current) {
           groupRef.current.rotation.y += delta * 0.1 * rotationSpeed.current.value;
       }
   });

   const particles = useMemo(() => {
       return new Array(12).fill(0).map((_, i) => ({
           position: [
               (Math.random() - 0.5) * 3,
               (Math.random() - 0.5) * 3,
               (Math.random() - 0.5) * 3
           ] as [number, number, number]
       }));
   }, []);

   return (
       <group ref={groupRef}>
           <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
                {particles.map((p, i) => (
                    <Sphere key={i} args={[0.25, 16, 16]} position={p.position}>
                        <MeshDistortMaterial ref={materialRef} color={i % 2 === 0 ? "#00F0FF" : "#7000FF"} speed={3} distort={hovered ? 0.8 : 0.6} />
                    </Sphere>
                ))}
           </Float>
            <MetricText visible={active} label={metrics[0].label} value={metrics[0].value} position={[-2, 1.8, 0]} />
            <MetricText visible={active} label={metrics[1].label} value={metrics[1].value} position={[2, -1.8, 0]} />
       </group>
   );
};

const CaseStudyScene: React.FC<{ caseStudy: CaseStudy }> = ({ caseStudy }) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div 
        className="w-full h-full relative cursor-pointer bg-obsidian/50 transition-colors hover:bg-obsidian/80" 
        onClick={() => setActive(!active)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
        <ResponsiveCamera />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00F0FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7000FF" />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        {caseStudy.id === 'fintech-core' ? (
            <FintechModel active={active} hovered={hovered} metrics={caseStudy.metrics} />
        ) : (
            <HealthModel active={active} hovered={hovered} metrics={caseStudy.metrics} />
        )}
      </Canvas>
      
      {/* Overlay Instructions */}
      <div className={`absolute bottom-4 right-4 bg-obsidian/80 backdrop-blur px-3 py-1 rounded border border-white/10 text-xs font-mono text-cyan pointer-events-none transition-all duration-500 ${active ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          CLICK TO ANALYZE
      </div>
      
      {/* Active State Indicator */}
      <div className={`absolute top-4 left-4 flex items-center gap-2 transition-all duration-300 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_#00F0FF]"></div>
          <span className="text-xs font-mono text-cyan tracking-widest">LIVE DATA VIEW</span>
      </div>
    </div>
  );
};

export default CaseStudyScene;