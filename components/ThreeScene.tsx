import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Component to handle dynamic camera movement based on scroll and aspect ratio
const CameraController = () => {
  const { camera, size } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    // Initialize
    scrollRef.current = window.scrollY;
    // Passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useFrame((state, delta) => {
    if (camera instanceof THREE.PerspectiveCamera) {
       // --- 1. Aspect Ratio / FOV Logic ---
       const aspect = size.width / size.height;
       const baseFov = 45;
       
       // Calculate responsive FOV to maintain horizontal coverage on narrow screens
       // We use a linear approximation that widens the vertical FOV as aspect ratio decreases
       let responsiveFov = baseFov;
       
       // Threshold increased to 1.2 to catch square-ish tablets/mobile earlier
       if (aspect < 1.2) {
           // As screen gets narrower, widen FOV more aggressively
           // (1.2 - aspect) * 50 gives a good curve for mobile devices
           responsiveFov = baseFov + (1.2 - aspect) * 50; 
       }
       
       // Cap maximum FOV to prevent extreme fisheye distortion
       responsiveFov = Math.min(responsiveFov, 90);

       // --- 2. Scroll Zoom Logic with Dead Zone ---
       const viewportHeight = window.innerHeight;
       // Dead Zone: 10% of viewport height. 
       // Within this zone, camera is LOCKED to hero state.
       const deadZoneThreshold = viewportHeight * 0.10; 
       
       let zoomProgress = 0;
       
       if (scrollRef.current > deadZoneThreshold) {
           // Calculate progress ONLY after passing the dead zone
           const effectiveScroll = scrollRef.current - deadZoneThreshold;
           // Transition happens over the next 1.0 viewports for a measured, cinematic pull-back
           const transitionRange = viewportHeight * 1.0; 
           
           const rawProgress = Math.min(effectiveScroll / transitionRange, 1);
           // Smoothstep for non-linear, organic acceleration/deceleration
           zoomProgress = THREE.MathUtils.smoothstep(rawProgress, 0, 1);
       }

       // --- 3. Camera States ---
       // Hero Anchor: Camera placed DEEP inside the front-facing cluster (Z=12).
       const heroPosition = new THREE.Vector3(0, 0, 12); 
       
       // Overview State: Pulled back to reveal the full architectural graph.
       // Restricted to 20 to keep content legible and immersive.
       const overviewPosition = new THREE.Vector3(0, 0, 20);

       // Interpolate Position
       const targetPosition = new THREE.Vector3().lerpVectors(heroPosition, overviewPosition, zoomProgress);
       
       // Apply HEAVY Damping for architectural weight (Massive structure feel)
       // Lower factor = more damping / lag.
       camera.position.lerp(targetPosition, delta * 0.5);
       
       // Interpolate FOV for a subtle "Dolly Zoom" feeling
       // Narrower FOV when zoomed out makes it feel more orthographic/schematic
       const zoomedOutFov = responsiveFov * 0.85; 
       const targetFov = THREE.MathUtils.lerp(responsiveFov, zoomedOutFov, zoomProgress);
       
       camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 1.5);
       camera.updateProjectionMatrix();
    }
  });

  return null;
};

/**
 * Atmospheric Background Layer
 * Fills negative space with a non-structural, cinematic radial gradient and subtle grain.
 */
const AtmosphericBackground = () => {
  return (
    <mesh position={[0, 0, -40]} scale={[300, 300, 1]}>
      <planeGeometry />
      <shaderMaterial 
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={{
            // Neutral dark gunmetal, slightly warmed to avoid sterile feel
            uColor: { value: new THREE.Color("#121215") }, 
        }}
        vertexShader={`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `}
        fragmentShader={`
            uniform vec3 uColor;
            varying vec2 vUv;
            
            // Simple, high-performance noise
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            void main() {
                // Radial Gradient: Center is visible, Edges fade to transparency
                float dist = distance(vUv, vec2(0.5));
                // Smooth falloff from center (0.0) to edge (0.7 radius)
                float radial = 1.0 - smoothstep(0.0, 0.7, dist);
                
                // Screen-space grain to maintain texture consistency regardless of scale
                float noise = random(gl_FragCoord.xy / 2.0);
                
                // Compose:
                // Base opacity is low (max 5% at center) to remain subtle and atmospheric
                float alpha = radial * 0.05;
                
                // Add subtle grain to the color channels (2% intensity)
                vec3 finalColor = uColor + (noise * 0.02);
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `}
      />
    </mesh>
  );
};

/**
 * Enterprise-Grade Neural Generation Logic
 * Uses Clustered Distribution + Cardinal Anchoring
 */
const generateNeuralData = (particleCount: number, connectionDistance: number) => {
    // 1. Configuration: Structured Clusters
    // Global radius must match Camera Hero Position (Z=12) for the anchor to work.
    const globalOrbitRadius = 12.0; 
    const clusterRadiusSpread = 6.0; 
    const minNodeDist = 0.4;       
    const minNodeDistSq = minNodeDist * minNodeDist;

    const positions: number[] = [];
    const scales: number[] = [];
    const lives: number[] = [];

    // 2. Generate Cluster Centers
    // CENTER 0 is the HERO ANCHOR at (0, 0, 12)
    const centers = [
        new THREE.Vector3(0, 0, 1).multiplyScalar(globalOrbitRadius), // Front (Hero Anchor)
        new THREE.Vector3(0, 0, -1).multiplyScalar(globalOrbitRadius), // Back
        new THREE.Vector3(1, 0, 0).multiplyScalar(globalOrbitRadius), // Right
        new THREE.Vector3(-1, 0, 0).multiplyScalar(globalOrbitRadius), // Left
        new THREE.Vector3(0, 1, 0).multiplyScalar(globalOrbitRadius), // Top
        new THREE.Vector3(0, -1, 0).multiplyScalar(globalOrbitRadius), // Bottom
    ];
    const clusterCount = centers.length;

    // 3. Generate Nodes with Spatial Rejection (Anti-Clumping)
    const grid = new Map<string, number[]>();
    const cellSize = minNodeDist;
    const getGridKey = (x: number, y: number, z: number) => 
        `${Math.floor(x/cellSize)}:${Math.floor(y/cellSize)}:${Math.floor(z/cellSize)}`;

    const hasCollision = (x: number, y: number, z: number) => {
        const kx = Math.floor(x/cellSize);
        const ky = Math.floor(y/cellSize);
        const kz = Math.floor(z/cellSize);
        
        // Check 3x3x3 neighborhood
        for(let ox=-1; ox<=1; ox++) {
            for(let oy=-1; oy<=1; oy++) {
                for(let oz=-1; oz<=1; oz++) {
                    const key = `${kx+ox}:${ky+oy}:${kz+oz}`;
                    const indices = grid.get(key);
                    if(indices) {
                        for(const idx of indices) {
                            const dx = x - positions[idx*3];
                            const dy = y - positions[idx*3+1];
                            const dz = z - positions[idx*3+2];
                            if(dx*dx + dy*dy + dz*dz < minNodeDistSq) return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    let count = 0;
    let attempts = 0;
    const maxAttempts = particleCount * 20; 

    while (count < particleCount && attempts < maxAttempts) {
        attempts++;
        
        // Pick a cluster
        const clusterIdx = Math.floor(Math.random() * clusterCount);
        const center = centers[clusterIdx];

        // Generate candidate point within cluster volume
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        // Volume distribution with core density bias
        const r = Math.pow(Math.random(), 0.8) * clusterRadiusSpread; 
        
        const x = center.x + r * Math.sin(phi) * Math.cos(theta);
        const y = center.y + r * Math.sin(phi) * Math.sin(theta);
        const z = center.z + r * Math.cos(phi);

        if (!hasCollision(x, y, z)) {
            positions.push(x, y, z);
            scales.push(Math.random() * 0.6 + 0.4); // Node size variation
            lives.push(Math.random()); // Phase for shader animation
            
            const key = getGridKey(x, y, z);
            if(!grid.has(key)) grid.set(key, []);
            grid.get(key)!.push(count);
            
            count++;
        }
    }

    // 4. Generate Connections
    const linePositions: number[] = [];
    const connDistSq = connectionDistance * connectionDistance;
    const connCellSize = connectionDistance;
    
    // Spatial grid for connections
    const connGrid = new Map<string, number[]>();
    for(let i=0; i<count; i++) {
        const x = positions[i*3];
        const y = positions[i*3+1];
        const z = positions[i*3+2];
        const key = `${Math.floor(x/connCellSize)}:${Math.floor(y/connCellSize)}:${Math.floor(z/connCellSize)}`;
        if(!connGrid.has(key)) connGrid.set(key, []);
        connGrid.get(key)!.push(i);
    }

    for (let i = 0; i < count; i++) {
        const x1 = positions[i*3];
        const y1 = positions[i*3+1];
        const z1 = positions[i*3+2];
        
        const kx = Math.floor(x1/connCellSize);
        const ky = Math.floor(y1/connCellSize);
        const kz = Math.floor(z1/connCellSize);

        for (let ox = -1; ox <= 1; ox++) {
            for (let oy = -1; oy <= 1; oy++) {
                for (let oz = -1; oz <= 1; oz++) {
                    const key = `${kx+ox}:${ky+oy}:${kz+oz}`;
                    const neighbors = connGrid.get(key);
                    if (neighbors) {
                        for (const j of neighbors) {
                            if (j > i) { 
                                const x2 = positions[j*3];
                                const y2 = positions[j*3+1];
                                const z2 = positions[j*3+2];
                                const distSq = (x1-x2)**2 + (y1-y2)**2 + (z1-z2)**2;

                                if (distSq < connDistSq) {
                                    linePositions.push(x1, y1, z1);
                                    linePositions.push(x2, y2, z2);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return { 
        positions: new Float32Array(positions), 
        scales: new Float32Array(scales), 
        linePositions: new Float32Array(linePositions),
        lives: new Float32Array(lives)
    };
};

const NeuralNetwork = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsGeometryRef = useRef<THREE.BufferGeometry>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollTarget = useRef(0);
  
  const particleCount = 2500; 
  const connectionDistance = 2.0; 
  
  const { positions, scales, linePositions, lives } = useMemo(() => 
    generateNeuralData(particleCount, connectionDistance), 
  []);

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      
      const handleScroll = () => {
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          const rawScroll = Math.min(1, Math.max(0, window.scrollY / totalHeight));
          
          // --- Non-Linear Color Remapping ---
          // 0.0 - 0.25: Mostly Cyan (Hero)
          // 0.25 - 0.75: Transition Phase (Solutions -> Work)
          // 0.75 - 1.0: Mostly Purple (Contact/Footer)
          scrollTarget.current = THREE.MathUtils.smoothstep(rawScroll, 0.25, 0.75);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  useFrame((state, delta) => {
      const time = state.clock.elapsedTime;

      if (groupRef.current) {
          // Ultra-slow, stable drift for architectural feel
          groupRef.current.rotation.y += delta * 0.015;
          
          // --- Cinematic Parallax ---
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;

          // Rotation: ±0.5 degrees (Extremely subtle tilt)
          const maxRot = THREE.MathUtils.degToRad(0.5);
          const targetRotX = my * maxRot;
          const targetRotZ = -mx * maxRot; 

          // Position: ±0.2 units (Micro shift)
          const maxPos = 0.2;
          const targetPosX = -mx * maxPos;
          const targetPosY = my * maxPos;

          // Extra Heavy Damping (delta * 0.05) for mass - Glacial drift
          const damping = delta * 0.05; 

          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, damping);
          groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, damping);
          groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, damping);
          groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, damping);
      }

      // Handle Color Transition based on Scroll
      if (shaderMaterialRef.current) {
          shaderMaterialRef.current.uniforms.uTime.value = time;
          
          // Smoothly interpolate scroll value for color mixing
          const currentScroll = shaderMaterialRef.current.uniforms.uScroll.value;
          // Slower interpolation (delta * 1.5) for a "delayed" luxury feel
          const newScroll = THREE.MathUtils.lerp(currentScroll, scrollTarget.current, delta * 1.5);
          shaderMaterialRef.current.uniforms.uScroll.value = newScroll;

          // Update Lines Color to match
          if (lineMaterialRef.current) {
              const colorA = new THREE.Color("#2EE6D6"); // Cyanish
              const colorB = new THREE.Color("#7000FF"); // Purple
              lineMaterialRef.current.color.lerpColors(colorA, colorB, newScroll);
              // Increase opacity slightly at the bottom for dramatic effect
              lineMaterialRef.current.opacity = 0.08 + (newScroll * 0.05);
          }
      }

      // Rhythmic Signal Pulse
      if (pointsGeometryRef.current) {
        const livesAttribute = pointsGeometryRef.current.attributes.life;
        if (livesAttribute) {
            const livesArray = livesAttribute.array as Float32Array;
            // Slow breathing cycle
            const rhythmicFactor = Math.sin(time * 0.8) * 0.5 + 1.0; 

            for (let i = 0; i < particleCount; i++) {
                livesArray[i] -= delta * (rhythmicFactor * 0.3 + Math.random() * 0.3); 
                if (livesArray[i] <= 0) livesArray[i] = 1.0; 
            }
            livesAttribute.needsUpdate = true;
        }
      }
  });

  return (
    <group ref={groupRef}>
        <points>
            <bufferGeometry ref={pointsGeometryRef}>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-scale" count={scales.length} array={scales} itemSize={1} />
                <bufferAttribute attach="attributes-life" count={lives.length} array={lives} itemSize={1} />
            </bufferGeometry>
            <shaderMaterial
                ref={shaderMaterialRef}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    colorA: { value: new THREE.Color("#00F0FF") }, // Cyan
                    colorB: { value: new THREE.Color("#7000FF") }, // Violet
                    signalColorA: { value: new THREE.Color("#E0FFFF") }, // Bright Ice
                    signalColorB: { value: new THREE.Color("#FF00FF") }, // Magenta
                    uTime: { value: 0 },
                    uScroll: { value: 0 }
                }}
                vertexShader={`
                    attribute float scale;
                    attribute float life;
                    varying float vLife;
                    void main() {
                        vLife = life;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = scale * (220.0 / -mvPosition.z) * vLife; 
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `}
                fragmentShader={`
                    uniform vec3 colorA;
                    uniform vec3 colorB;
                    uniform vec3 signalColorA;
                    uniform vec3 signalColorB;
                    uniform float uTime;
                    uniform float uScroll;
                    varying float vLife;
                    void main() {
                        float r = distance(gl_PointCoord, vec2(0.5));
                        if (r > 0.5) discard;
                        
                        // Base colors based on scroll
                        vec3 currentColor = mix(colorA, colorB, uScroll);
                        vec3 currentSignal = mix(signalColorA, signalColorB, uScroll);

                        float glow = 1.0 - (r * 2.0);
                        glow = pow(glow, 2.0); 
                        
                        float pulse = 0.5 + 0.5 * sin(uTime * 1.5 + vLife * 10.0);
                        
                        vec3 finalColor = mix(currentColor, currentSignal, pulse * 0.5);
                        float alpha = glow * vLife * (0.4 + pulse * 0.3);
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `}
            />
        </points>

        <lineSegments>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial 
                ref={lineMaterialRef}
                color="#2EE6D6" 
                transparent 
                opacity={0.08} 
                blending={THREE.AdditiveBlending} 
            />
        </lineSegments>
    </group>
  );
};

const ThreeScene: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 45 }}
        dpr={[1, 2]} // Dynamic Pixel Ratio for sharp rendering on all devices
        gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
            alpha: true 
        }}
      >
        <CameraController />
        <AtmosphericBackground />
        <NeuralNetwork />
      </Canvas>
    </div>
  );
};

export default ThreeScene;