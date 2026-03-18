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
  const rotationGroupRef = useRef();
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
  const orbitRadius = 2 + Math.log10(data.distanceFromSun) * 15;

  // 格式化自转速度显示
  const formatRotationSpeed = () => {
    const period = data.rotationPeriod;
    if (period < 1) {
      // 小于1天的显示小时
      const hours = (period * 24).toFixed(1);
      return `${hours}小时/圈`;
    } else if (period < 7) {
      // 小于7天的显示天
      return `${period.toFixed(1)}天/圈`;
    } else if (period < 30) {
      // 小于30天的显示天
      return `${period.toFixed(0)}天/圈`;
    } else {
      // 大于等于30天的显示天
      return `${period.toFixed(0)}天/圈`;
    }
  };

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
      // 自转 - 考虑逆行自转（现在meshRef是group，所以直接旋转group）
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
      <group position={[orbitRadius, 0, 0]} userData={{ planetId: data.id }}>
        {/* 行星旋转组 - 应用自转轴倾斜 */}
        <group rotation={[THREE.MathUtils.degToRad(data.axialTilt || 0), 0, 0]}>
          {/* 行星自转容器 */}
          <group ref={rotationGroupRef}>
            <mesh
              ref={meshRef}
              onClick={() => {
                setSelectedPlanet(data);
                playSoundEffect('click');
              }}
              userData={{ planetId: data.id, isPlanetMesh: true }}
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

            {/* 自转轴辅助线和方向箭头（仅在选中时显示，跟随行星自转） */}
            {isSelected && (
              <>
                {/* 自转轴线 */}
                <mesh>
                  <cylinderGeometry args={[0.02, 0.02, planetSize * 4, 8]} />
                  <meshBasicMaterial color="#00FF00" transparent opacity={0.7} />
                </mesh>

                {/* 北极箭头 */}
                <mesh position={[0, planetSize * 2, 0]}>
                  <coneGeometry args={[0.15, 0.4, 8]} />
                  <meshBasicMaterial color="#00FF00" />
                </mesh>

                {/* 南极箭头 */}
                <mesh position={[0, -planetSize * 2, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.15, 0.4, 8]} />
                  <meshBasicMaterial color="#00FF00" />
                </mesh>

                {/* 北极旋转方向指示箭头 */}
                <group position={[0, planetSize * 2.3, 0]}>
                  {/* 正常自转：逆时针，逆行自转：顺时针 */}
                  <mesh rotation={[data.retrogradeRotation ? -Math.PI / 2 : Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.2, 0.03, 8, 16, 3]} />
                    <meshBasicMaterial color="#FF6B6B" />
                  </mesh>
                  {/* 旋转方向小箭头 */}
                  <mesh position={[0.15, 0, 0]} rotation={[0, 0, data.retrogradeRotation ? -Math.PI / 4 : Math.PI / 4]}>
                    <coneGeometry args={[0.05, 0.15, 4]} />
                    <meshBasicMaterial color="#FF6B6B" />
                  </mesh>
                </group>

                {/* 南极旋转方向指示箭头 */}
                <group position={[0, -planetSize * 2.3, 0]}>
                  {/* 从南极看：正常自转为顺时针，逆行自转为逆时针 */}
                  <mesh rotation={[data.retrogradeRotation ? Math.PI / 2 : -Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.2, 0.03, 8, 16, 3]} />
                    <meshBasicMaterial color="#FF6B6B" />
                  </mesh>
                  {/* 旋转方向小箭头 */}
                  <mesh position={[0.15, 0, 0]} rotation={[0, 0, data.retrogradeRotation ? Math.PI / 4 : -Math.PI / 4]}>
                    <coneGeometry args={[0.05, 0.15, 4]} />
                    <meshBasicMaterial color="#FF6B6B" />
                  </mesh>
                </group>
              </>
            )}
          </group>

          {/* 速度标签 - 放在自转容器外，不跟随自转 */}
          {isSelected && (
            <Text
              position={[0.4, planetSize * 2.3, 0]}
              fontSize={0.12}
              color="#FF6B6B"
              anchorX="left"
              anchorY="middle"
            >
              {formatRotationSpeed()}
            </Text>
          )}
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
