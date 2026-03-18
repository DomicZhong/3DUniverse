import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { loadPlanetTexture } from '../../utils/textureLoader';
import { generatePlanetTexture } from '../../utils/textureGenerator';
import Moon from './Moon';
import { playSoundEffect } from './AudioManager';
import * as THREE from 'three';

export default function Planet({ data, scale = 1 }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [texture, setTexture] = useState(null);
  const {
    isPaused,
    timeSpeed,
    selectedPlanet,
    setSelectedPlanet,
    orbitColor,
    orbitThickness
  } = useStore();

  // 计算行星大小（教育模式下适当放大）
  const planetSize = scale * 0.3 + Math.log10(data.diameter / 1000) * 0.3;

  // 计算轨道半径（使用对数压缩，让外行星不那么远）
  const orbitRadius = 1 + Math.log10(data.distanceFromSun) * 10;

  useEffect(() => {
    // 加载NASA真实纹理
    loadPlanetTexture(data.id, true)
      .then(loadedTexture => {
        setTexture(loadedTexture);
      })
      // 当纹理加载失败时的错误处理回调
// 使用程序化生成的纹理作为备选方案，确保即使纹理文件缺失也能正常显示行星
.catch(error => {
        console.error(`Failed to load texture for ${data.name}:`, error);
        // 使用程序化纹理作为备选
        const canvas = generatePlanetTexture(data.id, 1024);
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        setTexture(fallbackTexture);
      });
  }, [data.id]);

  useFrame((_state, delta) => {
    if (groupRef.current && !isPaused) {
      // 公转
      const speed = (1 / data.orbitalPeriod) * timeSpeed;
      groupRef.current.rotation.y += delta * speed * 0.5;
    }

    if (meshRef.current && !isPaused) {
      // 自转 - 考虑逆行自转
      const rotationSpeed = (1 / data.rotationPeriod) * timeSpeed;
      const direction = data.retrogradeRotation ? -1 : 1;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5 * direction;
    }
  });

  const isSelected = selectedPlanet?.id === data.id;

  if (!texture) return null; // 等待纹理加载

  const orbitOpacity = isSelected ? 0.8 : 0.3;

  return (
    <group ref={groupRef}>
      {/* 轨道线 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[
          orbitRadius - (orbitThickness * 0.05),
          orbitRadius + (orbitThickness * 0.05),
          128
        ]} />
        <meshBasicMaterial
          color={isSelected ? '#FFD700' : orbitColor}
          side={THREE.DoubleSide}
          transparent
          opacity={orbitOpacity}
        />
      </mesh>

      {/* 行星 */}
      <group position={[orbitRadius, 0, 0]}>
        {/* 行星旋转组 - 应用自转轴倾斜 */}
        <group rotation={[THREE.MathUtils.degToRad(data.axialTilt || 0), 0, 0]}>
          <mesh
            ref={meshRef}
            onClick={() => {
              setSelectedPlanet(data);
              playSoundEffect('click');
            }}
            userData={{ planetId: data.id }}
          >
            <sphereGeometry args={[planetSize, 64, 64]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.6}
              metalness={0.2}
              emissive={new THREE.Color(data.color)}
              emissiveIntensity={0.05}
            />
          </mesh>
        </group>

        {/* 土星环 - 需要根据行星的自转轴倾斜来调整 */}
        {data.hasRings && (
          <mesh rotation={[Math.PI / 2, 0, THREE.MathUtils.degToRad(26.7)]}>
            <ringGeometry args={[planetSize * 1.5, planetSize * 2.2, 64]} />
            <meshBasicMaterial
              color="#C9B896"
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}

        {/* 行星名称标签 - 不跟随自转轴倾斜 */}
        <Text
          position={[0, planetSize + 0.5, 0]}
          fontSize={0.4}
          color={isSelected ? '#FFD700' : '#FFF'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {data.name}
        </Text>

        {/* 选中时的指示器 */}
        {isSelected && (
          <mesh position={[0, planetSize + 1.5, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        )}

        {/* 月球（仅地球有） */}
        {data.hasMoon && <Moon parentScale={planetSize} />}
      </group>
    </group>
  );
}
