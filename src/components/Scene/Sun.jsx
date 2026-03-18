import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import { loadPlanetTexture } from '../../utils/textureLoader';
import { generatePlanetTexture } from '../../utils/textureGenerator';
import { sunData } from '../../data/planets';
import { playSoundEffect } from './AudioManager';
import * as THREE from 'three';

export default function Sun() {
  const meshRef = useRef();
  const glowRef = useRef();
  const [texture, setTexture] = useState(null);
  const { isPaused, timeSpeed, selectedPlanet, setSelectedPlanet } = useStore();

  useEffect(() => {
    // 加载NASA真实纹理
    let isMounted = true;

    loadPlanetTexture('sun', true)
      .then(loadedTexture => {
        if (isMounted) {
          setTexture(loadedTexture);
        }
      })
      .catch(error => {
        console.error('Failed to load sun texture:', error);
        // 使用程序化纹理作为备选
        if (isMounted) {
          const canvas = generatePlanetTexture('sun', 1024);
          const fallbackTexture = new THREE.CanvasTexture(canvas);
          setTexture(fallbackTexture);
        }
      });

    // 清理函数：组件卸载时设置标志
    return () => {
      isMounted = false;
    };
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += delta * 0.1 * timeSpeed;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  if (!texture) return null; // 等待纹理加载

  const isSelected = selectedPlanet?.id === 'sun';

  return (
    <group>
      {/* 太阳主体 */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onClick={() => {
          setSelectedPlanet(sunData);
          playSoundEffect('click');
        }}
        userData={{ planetId: 'sun' }}
      >
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* 太阳光晕 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 太阳光源 - 点光源，向所有方向发光 */}
      <pointLight
        position={[0, 0, 0]}
        intensity={50}
        distance={3000}
        decay={0.8}
        color="#FFFFFF"
      />

      {/* 补充环境光，模拟星际散射光 */}
      <ambientLight intensity={0.6} color="#90B0D0" />
    </group>
  );
}
