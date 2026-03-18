import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { generatePlanetTexture } from '../../utils/textureGenerator';
import { moonData } from '../../data/planets';
import { playSoundEffect } from './AudioManager';
import { getBasePath } from '../../config/assets';
import * as THREE from 'three';

export default function Moon({ parentScale = 1 }) {
  const meshRef = useRef();
  const orbitGroupRef = useRef();
  const [texture, setTexture] = useState(null);
  const {
    isPaused,
    timeSpeed,
    selectedPlanet,
    setSelectedPlanet
  } = useStore();

  // 月球大小（相对于地球缩小）
  const moonSize = parentScale * 0.08;

  // 月球轨道半径
  const orbitRadius = 2.5;

  useEffect(() => {
    // 加载月球纹理 - 使用正确的路径
    const textureLoader = new THREE.TextureLoader();
    const moonTexturePath = `${getBasePath()}textures/moon.jpg`;
    textureLoader.load(moonTexturePath,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Failed to load moon texture:', error);
        // 使用程序化纹理作为备选
        const canvas = generatePlanetTexture('moon', 512);
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        setTexture(fallbackTexture);
      }
    );
  }, []);

  useFrame((_state, delta) => {
    // 月球公转（围绕地球）
    if (orbitGroupRef.current && !isPaused) {
      const speed = (1 / moonData.orbitalPeriod) * timeSpeed * 5;
      orbitGroupRef.current.rotation.y += delta * speed * 0.5;
    }

    // 月球自转（潮汐锁定，与公转同步）
    if (meshRef.current && !isPaused) {
      const rotationSpeed = (1 / moonData.rotationPeriod) * timeSpeed * 5;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
    }
  });

  if (!texture) return null; // 等待纹理加载

  const isSelected = selectedPlanet?.id === moonData.id;
  const orbitOpacity = isSelected ? 0.8 : 0.3;

  return (
    <group ref={orbitGroupRef}>
      {/* 月球轨道线 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[
          orbitRadius - 0.02,
          orbitRadius + 0.02,
          64
        ]} />
        <meshBasicMaterial
          color={isSelected ? '#FFD700' : '#666666'}
          side={THREE.DoubleSide}
          transparent
          opacity={orbitOpacity}
        />
      </mesh>

      {/* 月球 */}
      <group position={[orbitRadius, 0, 0]}>
        {/* 月球旋转组 - 应用自转轴倾斜 */}
        <group rotation={[THREE.MathUtils.degToRad(moonData.axialTilt || 0), 0, 0]}>
          <mesh
            ref={meshRef}
            onClick={() => {
              setSelectedPlanet(moonData);
              playSoundEffect('click');
            }}
            userData={{ planetId: 'moon', isPlanetMesh: true }}
          >
            <sphereGeometry args={[moonSize, 32, 32]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        </group>

        {/* 月球名称标签 */}
        <Text
          position={[0, moonSize + 0.3, 0]}
          fontSize={0.2}
          color={isSelected ? '#FFD700' : '#FFF'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {moonData.name}
        </Text>

        {/* 选中时的指示器 */}
        {isSelected && (
          <mesh position={[0, moonSize + 0.8, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        )}
      </group>
    </group>
  );
}
